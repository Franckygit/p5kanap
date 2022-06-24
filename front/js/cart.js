// -------------------------------------------- RÉCUPÉRATION DES PRODUITS ------------------------------------------------

let productsValue = localStorage.getItem(localStorage.key("products"));

let productsInCart = JSON.parse(productsValue);

// ------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------- AFFICHAGE DES PRODUITS ---------------------------------------------------

function displayProduct(products) {

    let numberOfProducts = productsInCart.length;

    if (numberOfProducts > 0) {
        const items = document.querySelector("#cart__items");
        let numProduct = 0;
        for (let product of productsInCart) {
            numProduct++;
            items.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
            <div class="cart__item__img">
            ${product.url}
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price}€</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>`
    }
}};

displayProduct();

// ----------------------------------------------------------------------------------------------------
// -------------------------------------CALCUL PRIX ET QUANTITÉ TOTAL.E -------------------------------

let price = 0;

let items = 0;

for (let product of productsInCart) {
    price += product.price * product.quantity;
    items += product.quantity;
}

const displayPrice = document.querySelector("#totalPrice");
displayPrice.innerHTML += `${price}`;

const displayItems = document.querySelector("#totalQuantity");
displayItems.innerHTML += `${items}`;

//--------------------------------------------------------------------------------------------------------
//---------------------------------------CHANGEMENT DE QUANITÉ--------------------------------------------

function changeQuantity() {

    let changeQuantity = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < changeQuantity.length; k++) {
        changeQuantity[k].addEventListener("change", (event) => {
            event.preventDefault();

            //Selection de l'element à modifier en fonction de son id ET sa couleur
            let quantityModif = productsInCart[k].quantity;
            let qttModifValue = changeQuantity[k].valueAsNumber;

            const resultFind = productsInCart.find((el) => el.qttModifValue !== quantityModif);

            resultFind.quantity = qttModifValue;
            productsInCart[k].quantity = resultFind.quantity;

            localStorage.setItem("products", JSON.stringify(productsInCart));

            location.reload();
        })
    }
}
changeQuantity();

// ----------------------------------------------------------------------------------------------------
// ------------------------------------- BOUTON SUPPRIMER ---------------------------------------------

let deleteItemBtn = document.querySelectorAll(".deleteItem");

for (let i = 0; i < deleteItemBtn.length; i++){

    deleteItemBtn[i].addEventListener("click", (event) => {

        event.preventDefault();

            productsInCart.splice(i, 1);

            localStorage.setItem("products", JSON.stringify(productsInCart));

        alert("Ce produit a été supprimé du panier");

    })

}

// --------------------------------------------------------------------------------------------
// ------------------------------------------ FORMULAIRE --------------------------------------

let orderBtn = document.querySelector("#order");

orderBtn.addEventListener("click", (event) => {

    event.preventDefault();

    if (invalidFirstName()) {
        let error = document.getElementById('firstNameErrorMsg');
        error.textContent = "Veuillez saisir un prénom valide avec une majuscule.";
    }

    if (invalidLastName()) {
        let error = document.getElementById('lastNameErrorMsg')
        error.textContent = "Veuillez saisir un nom valide avec une majuscule.";
    }
    if (invalidAdress()){
        let error = document.getElementById('addressErrorMsg')
        error.textContent = "Veuillez saisir une adresse valide.";
    }
    if (invalidCity()) {
        let error = document.getElementById('cityErrorMsg')
        error.textContent = "Veuillez saisir un code postal suivi d'une ville valide.";
    }
    if (invalidEmail()) {
        let error = document.getElementById('emailErrorMsg')
        error.textContent = "Veuillez saisir une adresse mail valide en minuscules.";
    }

    if (invalidFirstName()===false && invalidLastName()===false && invalidAdress()===false && invalidCity()===false && invalidEmail()===false && productsInCart.length !== 0) {

        JSON.parse(localStorage.getItem("form"));

        localStorage.setItem("form", JSON.stringify(createContact()))

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(createContact()),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {

                const orderId = data.orderId

                window.location.href = "../html/confirmation.html" + "?orderId=" + orderId

                return console.log(data)
            })

            .catch((err) => console.log(err))

        alert("Commande réussie");
    }
    }
)

// ---------------------------------------------------------------------------------------------------
// -------------------------------- FONCTIONS FORMULAIRE ---------------------------------------------

function invalidFirstName() {
    const name = document.querySelector("#firstName").value;
    const regex = /^[A-Z][A-Za-z\é\è\ê\ë\ô\ö\ï\î\-\'][^0-9\^ ]+$/;
    if (regex.test(name) === false) {
        return true;

    }
    return false
}

function invalidLastName() {
    const lastName = document.querySelector("#lastName").value
    const regex = /^[A-Z][A-Za-z\é\è\ê\ë\ô\ö\ï\î\-\'][^0-9\^ ]+$/
    if (regex.test(lastName) === false) {
        
        return true
    }
    return false
}


function invalidAdress() {
    const address = document.querySelector("#address").value
    const regex = /^[0-9]+\s*([a-zA-Z\-\']+\s*[a-zA-Z\-\'])*$/
    if (regex.test(address) === false) {
        
        return true
    }
    return false
}


function invalidCity() {
    const city = document.querySelector("#city").value
    const regex = /[0-9]{5} [A-Za-z\-\']{3,40}$/
    if (regex.test(city) === false) {
        
        return true
    }
    return false
}


function invalidEmail() {
    const email = document.querySelector("#email").value
    const regex = /^[0-9\a-z\.]+@([0-9\a-z]+\.)+[\a-z]{2,4}$/
    if (regex.test(email) === false) {
        
        return true
    }
    return false
}

function createContact() {
    let form = {    
        contact: {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
    },  
        products: cartIds()
    }
    return form
}

function cartIds() {
    let ids = [];
    for (let i = 0; i < productsInCart.length; i++) {
        let id = productsInCart[i]._id
        ids.push(id)
    }
    return ids
}

// ---------------------------------------------------------------------------------------------------------
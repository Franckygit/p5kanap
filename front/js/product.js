function getOneProduct(id) { // fonction pour récupérer un seul produit depuis l'api en ciblant son id
    return fetch("http://localhost:3000/api/products/" +id)
        .then(function (res) {
            return res.json();
        })
        .then(product => {
            return product;
        })
        .catch((err) => {
            document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
            console.log("erreur 404, api error: " + err);
        });
}

let params = new URL(document.location).searchParams;
let id = params.get("id");

function getProductIdFromUrl () { // fonction qui modifie l'url de la page en fonction de l'id du produit
    return new URL(location.href).searchParams.get("id");
}

function renderProduct(product) { // fonction qui injecte les données de l'article dans le DOM
    const productImg = document.querySelector("article div.item__img")
    const productTitle = document.querySelector("#title")
    const productPrice = document.querySelector("#price")
    const productDescription = document.querySelector("#description")
    const productOption = document.querySelector("#colors");

    productImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productTitle.textContent = `${product.name}`;
    productPrice.textContent = `${product.price}`;
    productDescription.textContent = `${product.description}`;
   
    productOption.insertAdjacentHTML("beforeend", product.colors.map(color => `<option value="${color}">${color}</option>`))
    
}

async function displayProduct () { // fonction pour afficher le tout
    const productId = getProductIdFromUrl();
    const product = await getOneProduct(productId);
    renderProduct (product);
}
displayProduct();



const falseColor = document.querySelector(`--SVP, choisissez une couleur --`);
const itemQuantity = document.querySelector("#quantity");
const color = document.querySelector("#colors");

const addToCartBtn = document.querySelector("#addToCart");

addToCartBtn.addEventListener("click", () => {
    if (itemQuantity.value > 0 && itemQuantity.value < 100 && color.value !== ""){
        const productTitle = document.querySelector("#title");
        const productPrice = document.querySelector("#price");
        const productImg = document.querySelector("article div.item__img");
        const productId = getProductIdFromUrl();
        const productOption = document.querySelector("#colors");
        let productAdded  = {
            name: productTitle.innerHTML,
            price: parseFloat(productPrice.innerHTML),
            color: color.value,
            quantity: parseFloat(itemQuantity.value),
            url: productImg.innerHTML,
            _id : id,
        };
        let productsInCart = [];

        if (localStorage.getItem("products") !== null) {
            productsInCart = JSON.parse(localStorage.getItem("products"));
        }

        //console.log(productAdded._id)
        //console.log(productAdded.color)

        let productFound = productsInCart.find(element => element._id == productAdded._id && element.color == productAdded.color);

        //console.log(productFound);

        if (productFound) {
            let addQuantity = parseInt(productFound.quantity) + parseInt(productAdded.quantity);
            productFound.quantity = addQuantity;
            localStorage.setItem("products", JSON.stringify(productsInCart));
        } else {
            productsInCart.push(productAdded);
            localStorage.setItem("products", JSON.stringify(productsInCart));
        }

        //console.log("Article.s ajouté.s au panier!");
        //console.log(productAdded);

        alert("Produit ajouté au panier");
    } else {
        alert("Veuillez renseigner une couleur et/ou une quantité d'articles");
    }});



// --------------------------------------------------------------------------------
// fonction pour éviter la redondance d'un article dans le LocalStorage
// si le produit ajouté existe déjà dans le panier
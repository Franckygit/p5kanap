function getAllProducts() { // fonction pour récupérer tous les produits de l'api
    return fetch("http://localhost:3000/api/products")
        .then(function (res) {
            return res.json();
        })
        .then(products => {
            return products;
        })
}

function renderProducts(products) { // fonction qui permet de récupérer sur la page d'accueil autant d'articles qu'il y a dans la base de données
    let numberOfProducts = products.length;
    if (numberOfProducts > 0) {
        const items = document.querySelector("#items");
        for(const product of products) { // boucle qui se multiplie tant qu'il y a des articles à afficher
            items.innerHTML += `<a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`; 
        }
    }     
}

async function displayProducts() { // fonction qui affiche tous les produits
    const productsFromServer = await getAllProducts();
    renderProducts(productsFromServer);
}
displayProducts();


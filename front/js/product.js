let name, price, imageUrl, description, colors, altTxt;

// Récupération de l'id du produit passé dans l'url
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const buttSubmit = document.getElementById("addToCart");
const select = document.getElementById("colors");

request();

/**
 * Envoie une requète au back-end pour récupérer les infos produit pour l'id récupéré dans l'url
 */
function request() {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => response.json()
        .then((data) => {
            name = data.name;
            price = data.price;
            imageUrl = data.imageUrl;
            description = data.description;
            colors = data.colors;
            altTxt = data.altTxt;
            makeItem();
        })).catch(() => error());
};

/**
 * Implémente le code HTML avec les valeurs reçues de l'API.
 * @param { String } name 
 * @param { Number } price 
 * @param { String } imageUrl 
 * @param { String } description 
 * @param { Array } colors (Array of Strings)
 * @param { String } altTxt 
 */
function makeItem () {
    document.title = name;
    const newImg = document.createElement("img");
    newImg.setAttribute("src", imageUrl);
    newImg.setAttribute("alt", altTxt);
    const parentImg = document.querySelector(".item__img");
    parentImg.appendChild(newImg);

    const h1 = document.getElementById("title");
    h1.innerText = name;

    const spanPrice = document.getElementById("price");
    spanPrice.innerText = price;

    const p = document.getElementById("description");
    p.innerText = description;

    for (const color of colors) {
        const newOption = document.createElement("option");
        newOption.setAttribute("value", color);
        newOption.innerText = color;
        select.appendChild(newOption);
    }
}

buttSubmit.addEventListener('click', () => {
    const colorChoosen = select.value;
    const inputQuantity = document.getElementById("quantity");
    const quantity = inputQuantity.value;
    if (colorChoosen == "" && (quantity < 1 || quantity > 100)) {
        applyStyle(select, "red", 2, inputQuantity, "red", 2);
        alert("Merci de choisir un colori parmis ceux disponibles et une quantité (attention, 100 pièces maximum !).");
    }
    else if (colorChoosen == "") {
        applyStyle(select, "red", 2, inputQuantity, "black", 1);
        alert("N'oubliez pas de choisir un colori ! ;-D");
    }
    else if (quantity < 1 || quantity > 100) {
        if (quantity > 100) {
            alert("Attention, vous ne pouvez pas commander plus de 100 canapés !");
        }
        else {
            alert("Merci de saisir un nombre d'articles désirés valide.")
        }
        applyStyle(select, "black", 1, inputQuantity, "red", 2);
    }
    else {
        applyStyle(select, "black", 1, inputQuantity, "black", 1);

        // On pourrait stocker uniquement idSpecific, id, colorChoosen et quantity mais l'idée est
        // de ne pas faire une nouvelle requête à l'API (hormis la requête POST) sur la page panier.
        const idSpecific = id + colorChoosen;
        const product = {
            idSpec: idSpecific,
            idItem: id,
            nameItem: name,
            colorItem: colorChoosen,
            qtity: quantity,
            priceItem: price,
            imageUrlItem: imageUrl,
            altTxtItem: altTxt
        };
        let productInLocalStorage = JSON.parse(localStorage.getItem("products"));
        if (productInLocalStorage) {
            const index = productInLocalStorage.findIndex(item => item.idSpec == idSpecific)
            if (index != -1) {
                const newQuantity = Number(productInLocalStorage[index].qtity) + Number(quantity);
                const newProduct = {
                    idSpec: idSpecific,
                    idItem: id,
                    nameItem: name,
                    colorItem: colorChoosen,
                    qtity: newQuantity,
                    priceItem: price,
                    imageUrlItem: imageUrl,
                    altTxtItem: altTxt
                }
                productInLocalStorage.splice(index, 1, newProduct);
            }
            else {
                productInLocalStorage.push(product);
            }
        }
        else {
            productInLocalStorage = [];
            productInLocalStorage.push(product);
        }
        localStorage.setItem("products", JSON.stringify(productInLocalStorage));
        alert("Votre produit a bien été ajouté au panier");
    }
})

/**
 * Cette fonction applique le style demandé aux 2 input de la page.
 * @param { Object } element1 
 * @param { String } color1 
 * @param { Number } size1 
 * @param { Object } element2 
 * @param { String } color2 
 * @param { Number } size2 
 */
function applyStyle(element1, color1, size1, element2, color2, size2) {
    element1.style.borderColor = color1;
    element1.style.borderWidth = `${size1}px`;
    element2.style.borderColor = color2;
    element2.style.borderWidth = `${size2}px`;
}

/**
 * En cas d'échec de la requète, remplace l'article par un message d'erreur
 */
function error() {
    const section = document.querySelector(".item");
    const article = document.querySelector("article");
    section.removeChild(article);
    const newPMessage = document.createElement("p");
    newPMessage.innerHTML = "Oups !<br>Something went wrong on dirait...";
    newPMessage.style.textAlign = "center";
    newPMessage.style.color = "black";
    section.appendChild(newPMessage);
}
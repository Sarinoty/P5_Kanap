request();
/**
 * Envoie une requète au back-end puis lance la création des vignettes avec les infos reçues
 */
function request() {
    fetch("http://localhost:3000/api/products")
        .then((response) => response.json().then((data) => {
            for (const item of data) {
                makeItem(item.name, item.imageUrl, item._id, item.colors, item.description, item.altTxt);
            }
        })).catch((e) => showError());
}

/**
 * Crée une vignette pour chaque item dans la BDD
 * @param { String } name 
 * @param { String } image
 * @param { String } id 
 * @param { String } description 
 * @param { String } altTxt 
 */
function makeItem(name, image, id, description, altTxt) {
    // Création de l'élément de type lien.
    const newLink = document.createElement("a");
    newLink.setAttribute("href", `./product.html?id=${id}`);

    // Création de l'élément article
    const newArticle = document.createElement("article");

    // Création de l'élément image
    const newImg = document.createElement("img");
    newImg.setAttribute("src", image);
    newImg.setAttribute("alt", altTxt);
    newArticle.appendChild(newImg);

    // Création du h3
    const newh3 = document.createElement("h3");
    newh3.innerText = name;
    newArticle.appendChild(newh3);

    // Création du paragraphe
    const newP = document.createElement("p");
    newP.innerText = description;
    newArticle.appendChild(newP);

    // Imbrication des éléments restants
    newLink.appendChild(newArticle);
    const parent = document.getElementById("items");
    parent.appendChild(newLink);
}

/**
 * En cas d'échec de la requète, crée un article avec un message d'erreur
 */
function showError() {
    const newArticle2 = document.createElement("article");
    newArticle2.innerHTML = "Il n'y a aucun article disponible à ce jour.<br>Merci de revenir nous voir ultérieurement.";
    newArticle2.style.paddingBottom = "25px";
    newArticle2.style.textAlign= "center";
    const Parent = document.getElementById("items");
    Parent.appendChild(newArticle2);
}
// Si ce script est appelé depuis la page de confirmation on affiche le numéro de commande passé dans l'url.
if (document.title == "Confirmation") {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const spanConf = document.getElementById("orderId");
    spanConf.innerText = id;
}
// Si ce script n'est pas appelé depuis la page de confirmation on construit la page panier.
else {
    const productsList = JSON.parse(localStorage.getItem("products"));
    const section = document.getElementById("cart__items");
    const span1 = document.getElementById("totalQuantity");
    const span2 = document.getElementById("totalPrice");
    const subButton = document.getElementById("order");
    let cName, cPName, cMail, cAdd, cCity;
    cName = cPName = cMail = cAdd = cCity = 0;
    let products = [];
    let contact = {};

    // S'il y a bien quelques chose dans le localStorage :
    if (productsList && productsList.length != 0) {
        let i = 0;
        const productsListOrdered = productsList.sort(function compare(a, b) {
            if (a.nameItem < b.nameItem) {return -1;}
            if (a.nameItem > b.nameItem) {return 1};
            return 0;
        });
        for (const items of productsListOrdered) {
            const article = document.createElement("article");
            article.className = "cart__item";
            article.dataset.id = items.idItem;
            article.dataset.color = items.colorItem;
            const div1 = document.createElement("div");
            div1.className = "cart__item__img";
            const img = document.createElement("img");
            img.setAttribute("src", items.imageUrlItem);
            img.setAttribute("alt", items.altTxtItem);
            div1.appendChild(img);
            const div2 = document.createElement("div");
            div2.className = "cart__item__content";
            const div3 = document.createElement("div");
            div3.className = "cart__item__content__description";
            const h2 = document.createElement("h2");
            h2.innerText = items.nameItem;
            div3.appendChild(h2);
            const p1 = document.createElement("p");
            p1.innerText = items.colorItem;
            div3.appendChild(p1);
            const p2 = document.createElement("p");
            p2.innerText = items.priceItem + " €";
            div3.appendChild(p2);
            div2.appendChild(div3);
            const div4 = document.createElement("div");
            div4.className = "cart__item__content__settings";
            const div5 = document.createElement("div");
            div5.className = "cart__item__content__settings__quantity";
            const p3 = document.createElement("p");
            p3.innerText = "Qté : ";
            div5.appendChild(p3);
            var input = document.createElement("input");
            input.setAttribute("type", "number");
            input.className = "itemQuantity";
            input.setAttribute("name", "itemQuantity");
            input.setAttribute("min", 1);
            input.setAttribute("max", 100);
            input.setAttribute("value", items.qtity);
            div5.appendChild(input);
            div4.appendChild(div5);
            const div6 = document.createElement("div");
            div6.className = "cart__item__content__settings__delete";
            const p4 = document.createElement("p");
            p4.className = "deleteItem";
            p4.id = i;
            p4.innerText = "Supprimer";
            p4.setAttribute("onclick", "removeItem(this.id)");
            div6.appendChild(p4);
            div4.appendChild(div6);
            div2.appendChild(div4);
            article.appendChild(div1);
            article.appendChild(div2);
            section.appendChild(article);

            i++;

            adjustQuantityAndPrice();
        }
    }
    // Si le localStorage est vide :
    else {
        const newP = document.createElement("p");
        newP.innerText = "Votre panier est vide pour le moment";
        newP.style.textAlign = "center";
        newP.style.marginBottom = "50px";
        section.appendChild(newP);
        adjustQuantityAndPrice();
    }


    // On écoute le changement de chaque élément input
    const inputsQtity = document.querySelectorAll(".itemQuantity");
    inputsQtity.forEach((inputQtity) => {
        inputQtity.addEventListener('change', (e) => {
            const art = getId(e) + getColor(e); // On récupère l'id spécifique
            if (e.target.value) {
                productsList.forEach((product) => {
                    if (product.idSpec == art) {
                        product.qtity = e.target.value;
                    }
                });
                localStorage.setItem("products", JSON.stringify(productsList));
                adjustQuantityAndPrice();
            }
            else {
                removeItem(art, e.target);
            }
        });
    })

    /**
     * Renvoie l'id du produit stocké dans les data de l'article parent de l'input qui a été modifié
     * @param { Object } e 
     * @returns
     */
    function getId (e) {
        return e.target.closest("article").dataset.id;
    }

    /**
     * Renvoie la couleur du produit stockée dans les data de l'article parent de l'input qui a été modifié
     * @param { Object } e 
     * @returns
     */
    function getColor (e) {
        return e.target.closest("article").dataset.color;
    }

    /**
     * Supprime un article
     * @param { String } idToDelete id spécifique de l'article à supprimer
     * @param { Object } target input correspondant
     */
    function removeItem(idToDelete, target) {
        if (confirm("Vous êtes sur le point de supprimer un article de votre panier. Voulez-vous continuer ?")) {
            productsList.splice(idToDelete, 1);
            localStorage.setItem("products", JSON.stringify(productsList));
            window.location.reload();
        }
        else if (target != undefined && target.value == 0) {
            target.value = 1;
        }
    }

    /**
     * Mets à jour le nombre d'articles et le prix total.
     */
    function adjustQuantityAndPrice() {
        if (productsList) {
            let finalQtity = productsList.reduce((a, b) => a + parseInt(b.qtity), 0);
            span1.innerText = finalQtity;

            let finalPrice = productsList.reduce((a, b) => a + parseInt(b.qtity * b.priceItem), 0);
            span2.innerText = finalPrice;
        }
        else {
            span1.innerText = "0";
            span2.innerText = "0";
        }
    }

    // Vérification du formulaire
    const champNom = document.getElementById("lastName");
    const champPrenom = document.getElementById("firstName");
    const champMail = document.getElementById("email");
    const champAddr = document.getElementById("address");
    const champVille = document.getElementById("city");
    champPrenom.addEventListener("change", () => {
        const errorFName = document.getElementById("firstNameErrorMsg");
        if (!verifNames(champPrenom.value)) {
            champPrenom.style.border = "2px solid red"
            errorFName.innerText = "Veuillez saisir votre prénom !";
            cPName = 1;
        }
        else {
            champPrenom.style.border = "0";
            errorFName.innerText = "";
            cPName = 0;
        }
    })

    champNom.addEventListener("change", () => {
        const errorName = document.getElementById("lastNameErrorMsg");
        if (!verifNames(champNom.value)) {
            champNom.style.border = "2px solid red";
            errorName.innerText = "Veuillez saisir votre nom !";
            cName = 1;
        }
        else {
            champNom.style.border = "0";
            errorName.innerText = "";
            cName = 0;
        }
    });

    champAddr.addEventListener("change", () => {
        const errorAdd = document.getElementById("addressErrorMsg");
        if (!verifAdd(champAddr.value)) {
            champAddr.style.border = "2px solid red";
            errorAdd.innerText = "Veuillez saisir une adresse correcte !";
            cAdd = 1;
        }
        else {
            champAddr.style.border = "0";
            errorAdd.innerText = "";
            cAdd = 0;
        }
    });

    champVille.addEventListener("change", () => {
        const errorVille = document.getElementById("cityErrorMsg");
        if (!verifNames(champVille.value)) {
            champVille.style.border = "2px solid red";
            errorVille.innerText = "Veuillez saisir un nom de ville valide !";
            cCity = 1;
        }
        else {
            champVille.style.border = "0";
            errorVille.innerText = "";
            cCity = 0;
        }
    });

    champMail.addEventListener("change", () => {
        const errorMail = document.getElementById("emailErrorMsg");
        if (!verifMail(champMail.value)) {
            champMail.style.border = "2px solid red";
            errorMail.innerText = "Veuillez saisir une adresse e-mail valide !";
            cMail = 1;
        }
        else {
            champMail.style.border = "0";
            errorMail.innerText = "";
            cMail = 0;
        }
    });


    // Clic sur le bouton "Commander !"
    subButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evite le rechargement de la page qui vide les champs et interrompt la requête POST avant d'avoir la réponse du serveur
        // On vérifie que tous les champs ont été correctement remplis
        if (cName == 0 && cPName == 0 && cMail == 0 && cAdd == 0 && cCity == 0) {
            verificationFinale();
        }
        else {
            alert("Certains champs n'ont pas été renseignés correctement. Merci de vérifier les informations saisies.");
        }
    });

    /**
     * Requête POST envoyée au server pour obtenir l'id de commande.
     */
    function requetePost() {
        // Données à envoyer
        const order = {
            contact,
            products
        };
        // En-tête de la requête
        const entete = {
            method: "POST",
            body: JSON.stringify(order),
            headers: {"Content-Type": "application/json"},
        };

        fetch("http://localhost:3000/api/products/order", entete)
            .then((response) => {
                // On vérifie qu'on reçoit bien un status HTTP 201 c'est à dire que la requête a réussi et qu'une ressource a été créée en conséquence
                if (response.status == 201) {
                    return response.json();
                }
                else {
                    alert("La validation de l'achat a échoué. Veuillez essayer de nouveau ultérieurement");
                    console.error("Echec de la requête POST, status : " + response.status);
                }
            })
            .then((data) => {
                finalisation(data.orderId);
            })
    }

    /**
     * On vérifie qu'il y a bien des articles dans le panier puis on implémente l'objet à envoyer avec la requête POST.
     */
    function verificationFinale() {
        // Si le localStorage a été vidé depuis la page panier il faut empêcher la commande :
        let isTherePanier = JSON.parse(localStorage.getItem("products"));
        if (isTherePanier == null || isTherePanier.length < 1) {
            alert("Une erreur est survenue. Votre panier est vide. Merci de le remplir avant de procéder au paiement.");
        }
        // Si le panier n'a pas été vidé on envoie la liste des id dans l'array 'products'
        else {
            for (const ids of isTherePanier) {
                products.push(ids.idItem);
            }
            // On implémente l'objet contact
            contact.firstName = champPrenom.value;
            contact.lastName = champNom.value;
            contact.address = champAddr.value;
            contact.city = champVille.value;
            contact.email = champMail.value;
            
            requetePost();
        }
    }

    /**
     * Vide la localStorage et redirige l'utilisateur vers la page de confirmation dont on a glissé l'id de commande dans l'url
     * @param { String } orderId 
     */
    function finalisation(orderId) {
        localStorage.clear();
        document.location.href = `confirmation.html?id=${orderId}`;
    }

    // Regex testées sur le site https://regex101.com/ --- On aurait pu placer ces vérifications dans le html mais le choix retenu est de ne pas toucher au html.
    /**
     * 
     * @param { String } n 
     * @returns booléen
     */
    function verifNames(n) {
        return /^[^@&"()!_$*€£`+=\/;?#\d]+$/.test(n);
    }

    /**
     * Vérifie que l'adresse e-mail saisie correspond bien au format xxx@xxx.xxx
     * @param { String } adresse 
     * @returns booléen
     */
    function verifMail(adresse) {
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(adresse);
    }

    /**
     * Vérifie que l'adresse saisie ne contient pas de caractères spéciaux ni uniquement des chiffres.
     * @param { String } v 
     * @returns booléen
     */
    function verifAdd(v) {
        return /(?!^\d+$)^[^@&"()!_$*€£`+=\/;?#]+$/.test(v);
    }
}
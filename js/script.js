const form = document.querySelector("#formulaire-serie");
const titre = document.querySelector("#titre");
const genre_serie = document.querySelector("#genre-serie");
const description = document.querySelector("#description");
const erreur_titre = document.querySelector("#erreur-titre");
const erreur_genre = document.querySelector("#erreur-genre");
const erreur_image = document.querySelector("#erreur-image");
const recherche = document.querySelector("#recherche");
const filtre_genre = document.querySelector("#filtre-genre");
const btn_reinitialiser = document.querySelector("#btn-reinitialiser");
const nombre_series = document.querySelector("#nombre-series");
const liste_series = document.querySelector("#liste-series");
const etat_vide = document.querySelector("#etat-vide");
const message_erreur_api = document.querySelector("#message-erreur-api");
const modal_details = document.querySelector("#modal-details");
const fermer_details = document.querySelector("#fermer-details");
const pagination = document.querySelector("#pagination");
const btn_precedent = document.querySelector("#btn-precedent");
const btn_suivant = document.querySelector("#btn-suivant");
const page_actuelle = document.querySelector("#page-actuelle");
const image_serie = document.querySelector("#image-serie");

let series = [];
let page = 1;

async function recupererSeries() {
    try {
        const response = await fetch("https://api.tvmaze.com/shows?page=0");

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des séries");
        }
        const data = await response.json();
        series = data;
        console.log(series);
        localStorage.setItem("series", JSON.stringify(series));
        afficher(series);
    }
    catch(error){
        message_erreur_api.textContent = "Impossible de charger les séries.";
        message_erreur_api.hidden = false;
        console.error(error);
    }
}
series = JSON.parse(localStorage.getItem("series"));
if (series) {
    afficher(rechercher_filtrer(series));
} else {
    recupererSeries();
}

function afficherGenres() {
    let genres = [];

    series.forEach((serie) => {
        serie.genres.forEach((genre) => {
            if (!genres.includes(genre)) {
                genres.push(genre);
            }
        });
    });
    genres.sort();
    genres.forEach((genre) => {
        let option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        filtre_genre.appendChild(option);
    });
}

function afficher(liste) {
    liste_series.innerHTML = "";
    
    if (liste.length === 0) {
        etat_vide.hidden = false;
        pagination.hidden = true;
        return;
    }
    etat_vide.hidden = true;
    
    let total_pages = Math.ceil(liste.length / 15);
    let debut = (page - 1) * 15;
    let fin = debut + 15;
    let series_page = liste.slice(debut, fin);
    nombre_series.textContent = series_page.length + " séries affichées";

    series_page.forEach((serie) => {
        let description = serie.summary || "Aucune description disponible";

        let carte = document.createElement("article");
        carte.className = "bg-[#1B1B1B] border border-[#333333] rounded-xl overflow-hidden";

        let affiche = document.createElement("img");
        affiche.src = serie.image.original;
        affiche.alt = "Affiche de " + serie.name;
        affiche.className = "w-full h-80";

        let contenu = document.createElement("div");
        contenu.className = "p-3";

        let titre = document.createElement("h3");
        titre.className = "text-base font-bold mb-3";
        titre.textContent = serie.name || "Sans titre";

        let badges = document.createElement("div");
        badges.className = "flex flex-wrap gap-1 mb-3";

        serie.genres.forEach((genre) => {
            let badge = document.createElement("span");
            badge.className = "bg-[#333333] text-[#DDDDDD] text-xs px-3 py-1 rounded-full";
            badge.textContent = genre;
            badges.appendChild(badge);
        });

        let desc = document.createElement("p");
        desc.className = "text-[#AAAAAA] text-sm truncate mb-1";
        desc.textContent = description.replace(/<[^>]*>/g, "");

        contenu.appendChild(titre);
        contenu.appendChild(badges);
        contenu.appendChild(desc);

        carte.appendChild(affiche);
        carte.appendChild(contenu);

        liste_series.appendChild(carte);
    });
    pagination.hidden = total_pages <= 1;

    page_actuelle.textContent = `Page ${page} sur ${total_pages}`;

    btn_precedent.disabled = page === 1;
    btn_suivant.disabled = page === total_pages;

    btn_precedent.classList.toggle("opacity-40", page === 1);
    btn_suivant.classList.toggle("opacity-40", page === total_pages);
    afficherGenres();
}
btn_suivant.addEventListener("click", () => {
    page++;
    afficher(rechercher_filtrer(series));
});

btn_precedent.addEventListener("click", () => {
    page--;
    afficher(rechercher_filtrer(series));
});
recherche.addEventListener("input", () => {
    page = 1;
    afficher(rechercher_filtrer(series));
});
function rechercher(liste) {
    let text = recherche.value.trim().toLowerCase();
    let resultat = liste.filter((serie) =>serie.name.toLowerCase().includes(text));
    return resultat;
}
filtre_genre.addEventListener("change",()=>{
    page=1;
    afficher(rechercher_filtrer(series));
})
function filtrer(liste) {
    let genre = filtre_genre.value;
    let resultat = liste.filter((serie) => {
        return genre === "" || serie.genres.includes(genre);
    });
    return resultat;
}
function rechercher_filtrer(series) {
    let arr = series;
    arr = rechercher(arr);
    arr = filtrer(arr);
    return arr;
}
btn_reinitialiser.addEventListener("click",()=>{
    recherche.value = "";
    filtre_genre.value = "";
    afficher(series);
})
function afficherErreur(input, erreur, message) {
    erreur.textContent = message;
    input.classList.remove("border-[#383838]");
    input.classList.add("border-red-500");
}
function supprimerErreur(input, erreur) {
    erreur.textContent = "";
    input.classList.remove("border-red-500");
    input.classList.add("border-[#383838]");
}
function validation() {
    let valide = true;
    supprimerErreur(titre, erreur_titre);
    supprimerErreur(genre_serie, erreur_genre);
    supprimerErreur(image_serie, erreur_image);

    let nom = titre.value.trim();

    if (nom === "" || nom.length < 2 || nom.length > 60) {
        afficherErreur(titre, erreur_titre, "Le nom de la série est obligatoire et doit contenir entre 2 et 60 caractères");
        valide = false;
    }
    let texte_genres = genre_serie.value.trim();
    let genres = texte_genres.split(",").map((genre) => genre.trim());

    if (texte_genres === "") {
        afficherErreur(genre_serie, erreur_genre, "Veuillez saisir au moins un genre.");
        valide = false;
    }else if (genres.some((genre) => genre === "") || genres.some((genre) => genre.length < 2) || genres.some((genre) => !/^[\p{L}\s'-]+$/u.test(genre))) {
        afficherErreur(genre_serie, erreur_genre, "Chaque genre doit contenir au moins 2 caractères et Séparez les genres par des virgules");
        valide = false;
    }
    let fichiers = image_serie.files;

    if (fichiers.length === 0) {
        afficherErreur(image_serie, erreur_image, "Veuillez sélectionner une image.");
        valide = false;
    } else {
        let fichier = fichiers[0];
        let taille_max = 2 * 1024 * 1024;
        if (fichier.size > taille_max) {
            afficherErreur(image_serie, erreur_image, "L'image ne doit pas dépasser 2 Mo.");
            valide = false;
        }
    }
    return valide;
}
titre.addEventListener("input", () => {
    supprimerErreur(titre, erreur_titre);
});

genre_serie.addEventListener("input", () => {
    supprimerErreur(genre_serie, erreur_genre);
});

image_serie.addEventListener("change", () => {
    supprimerErreur(image_serie, erreur_image);
});
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validation()) {
        return;
    }
});


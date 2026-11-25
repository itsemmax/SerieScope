import {supprimerErreur, afficherErreur} from "./notify.js"
const description = document.querySelector("#description");
const form = document.querySelector("#formulaire-serie");
const titre = document.querySelector("#titre");
const genre_serie = document.querySelector("#genre-serie");
const langue_serie = document.querySelector("#langue-serie");
const image_serie = document.querySelector("#image-serie");
const erreur_titre = document.querySelector("#erreur-titre");
const erreur_langue = document.querySelector("#erreur-langue");
const erreur_image = document.querySelector("#erreur-image");
const erreur_genre = document.querySelector("#erreur-genre");
const btn_ajouter = document.querySelector("#btn-ajouter");
const btn_annuler = document.querySelector("#btn-annuler");
const titre_formulaire = document.querySelector("#titre-formulaire");

export function validation() {
    let valide = true;
    supprimerErreur(titre, erreur_titre);
    supprimerErreur(genre_serie, erreur_genre);
    supprimerErreur(image_serie, erreur_image);
    supprimerErreur(langue_serie,erreur_langue);

    let nom = titre.value.trim();

    if (nom === "" || nom.length < 2 || nom.length > 60) {
        afficherErreur(titre, erreur_titre, "Le nom de la série est obligatoire et doit contenir entre 2 et 60 caractères");
        valide = false;
    }
    if (langue_serie.value === "") {
        afficherErreur(langue_serie, erreur_langue, "Choisis une langue.");
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
    return valide;
}
export function recupererValeurs() {
    let fichier = image_serie.files[0];
    let nouvelleSerie = {
        name: titre.value.trim(),
        genres: genre_serie.value.split(",").map((genre) => genre.trim()),
        language: langue_serie.value,
        summary: description.value.trim()
    };
    if (fichier) {
        nouvelleSerie.image = { original: URL.createObjectURL(fichier) };
    }
    return nouvelleSerie;
}
export function remplir_form(serie){
    reinitialiser_form();
    titre.value = serie.name || "";
    langue_serie.value = serie.language || "";
    genre_serie.value = (serie.genres || []).join(", ");
    description.value = serie.summary || "";
    titre_formulaire.textContent = "Modifier une série";
    btn_ajouter.textContent = "Enregistrer les modifications";
    btn_annuler.hidden = false;
    window.scrollTo(0, 0);
}

export function reinitialiser_form(){
    form.reset();
    supprimerErreur(titre, erreur_titre);
    supprimerErreur(genre_serie, erreur_genre);
    supprimerErreur(langue_serie, erreur_langue);
    supprimerErreur(image_serie, erreur_image);
    titre_formulaire.textContent = "Ajouter une série";
    btn_ajouter.textContent = "Ajouter la série";
    btn_annuler.hidden = true;
}

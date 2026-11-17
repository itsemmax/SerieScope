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
export function recupererValeurs() {
    let fichier = image_serie.files[0];
    let nouvelleSerie = {
        name: titre.value.trim(),
        genres: genre_serie.value.split(",").map((genre) => genre.trim()),
        language: langue_serie.value,
        summary: description.value.trim(),
        image:{
            original: URL.createObjectURL(fichier)
        }
    };
    return nouvelleSerie;
}

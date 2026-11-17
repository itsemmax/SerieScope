
import {getAll,create} from "./src/serieService.js";
import {afficher} from "./ui/cards.js";
import {state} from "./data/store.js";
import {validation,recupererValeurs} from "./ui/form.js"
import { supprimerErreur } from "./ui/notify.js";

const message_erreur_api = document.querySelector("#message-erreur-api");
const form = document.querySelector("#formulaire-serie");
const titre = document.querySelector("#titre");
const genre_serie = document.querySelector("#genre-serie");
const langue_serie = document.querySelector("#langue-serie");
const image_serie = document.querySelector("#image-serie");
const erreur_titre = document.querySelector("#erreur-titre");
const erreur_langue = document.querySelector("#erreur-langue");
const erreur_image = document.querySelector("#erreur-image");
const erreur_genre = document.querySelector("#erreur-genre");

async function chargerSeries() {
    try{
        state.series = await getAll();
        message_erreur_api.hidden = true;
        console.log(state.series);
        afficher(state.series);
    }catch (error){
        if (error.code === "ECONNABORTED") {
            message_erreur_api.textContent = "Le serveur met trop de temps à répondre.";
        }
        else {
            message_erreur_api.textContent = "Impossible de charger les séries.";
        }
        message_erreur_api.hidden = false;
        console.error(error);
    }
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
langue_serie.addEventListener("change", () => {
    supprimerErreur(langue_serie,erreur_langue);
});
form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(!validation()){
        return;
    }
    let serie = recupererValeurs();
    let image = serie.image;
    delete serie.image;
    let test = await create(serie);
    test.image = image;
    state.series.push(test);
    afficher(state.series);
    form.reset();
})
chargerSeries();

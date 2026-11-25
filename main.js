
import {getAll,create,remove,update} from "./src/serieService.js";
import {afficher} from "./ui/cards.js";
import {state} from "./data/store.js";
import {validation,recupererValeurs,remplir_form,reinitialiser_form} from "./ui/form.js"
import { supprimerErreur } from "./ui/notify.js";
import { remplirFiltres } from "./ui/filters.js";

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
const btn_ajouter = document.querySelector("#btn-ajouter");
const btn_annuler = document.querySelector("#btn-annuler");

let serieEnModification = null;
let numeroRequete = 0;

export async function chargerSeries(actualiserFiltres = false) {
    const numero = ++numeroRequete;
    try{
        if (actualiserFiltres) {
            const toutesLesSeries = await getAll();
            remplirFiltres(toutesLesSeries);
        }
        const series = await getAll(state.filters);
        if (numero !== numeroRequete) {
            return;
        }
        state.series = series;
        message_erreur_api.hidden = true;
        afficher(state.series);
    }catch (error){
        if (numero !== numeroRequete) {
            return;
        }
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
    btn_ajouter.disabled = true;
    btn_annuler.disabled = true;
    try{
        let serie = recupererValeurs();
        let image = serie.image || serieEnModification?.image;
        delete serie.image;

        if(serieEnModification) {
            let resultat = await update(serieEnModification.id, serie);
            let serieModifiee = { ...serieEnModification, ...serie, ...resultat };
            if (image) {
                serieModifiee.image = image;
            }
            state.series = state.series.map((item) => item.id === serieEnModification.id ? serieModifiee : item);
        }else{
            let serieCreee = await create(serie);
            if (image){
                serieCreee.image = image;
            }
            state.series.push(serieCreee);
        }
        if (state.filters.name || state.filters.genre || state.filters.language) {
            await chargerSeries(true);
        } else {
            remplirFiltres(state.series);
            afficher(state.series);
        }
        serieEnModification = null;
        reinitialiser_form();
    }catch(error){
        console.error(error);
        alert("Erreur lors de l'enregistrement de la série.");
    }
    btn_ajouter.disabled = false;
    btn_annuler.disabled = false;
});

btn_annuler.addEventListener("click", () => {
    serieEnModification = null;
    reinitialiser_form();
});

export async function supprimerSerie(serie) {
    if (!confirm(`Voulez-vous supprimer "${serie.name}" ?`)) {
        return;
    }
    try{
        await remove(serie.id);
        if (serieEnModification?.id === serie.id) {
            serieEnModification = null;
            reinitialiser_form();
        }
        await chargerSeries(true);
    }catch(error){
        console.error(error);
        alert("Erreur lors de la suppression");
    }
}
export function modifierSerie(serie){
    serieEnModification = serie;
    remplir_form(serie);
}
chargerSeries(true);

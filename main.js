
import {getAll} from "./src/serieService.js";
import {afficher} from "./ui/cards.js";

const message_erreur_api = document.querySelector("#message-erreur-api");

async function chargerSeries() {
    try{
        const data = await getAll();
        message_erreur_api.hidden = true;
        console.log(data);
        afficher(data);
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
chargerSeries();

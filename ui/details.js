import { getById } from "../src/serieService.js";

const chargement = document.querySelector("#chargement");
const message_erreur = document.querySelector("#message-erreur");
const details_serie = document.querySelector("#details-serie");
const image = document.querySelector("#detail-image");
const titre = document.querySelector("#detail-titre");
const note = document.querySelector("#detail-note");
const premiere = document.querySelector("#detail-premiere");
const fin = document.querySelector("#detail-fin");
const lien_site = document.querySelector("#detail-site");
const site_officiel = document.querySelector("#site-officiel");
const description_serie = document.querySelector("#detail-description");

async function chargerDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id){
        chargement.hidden = true;
        message_erreur.textContent = "Aucune série sélectionnée. Choisis une série dans le catalogue.";
        message_erreur.hidden = false;
        return;
    }
    try {
        const serie = await getById(id);

        document.title = `${serie.name || "Sans titre"} — SérieScope`;
        titre.textContent = serie.name || "Sans titre";
        image.src = serie.image?.original || serie.image?.medium || "assets/images/image.png";
        image.alt = `Affiche de ${serie.name || "la série"}`;

        if (serie.rating && serie.rating.average != null) {
            note.textContent = serie.rating.average + " / 10";
        } else {
            note.textContent = "Non notée";
        }

        premiere.textContent = serie.premiered || "Non renseignée";
        fin.textContent = serie.ended || "Non renseignée";

        if (serie.officialSite) {
            if (serie.officialSite.startsWith("https://")) {
                lien_site.href = serie.officialSite;
                site_officiel.hidden = false;
            }
        }
        const description = serie.summary || "Aucun résumé disponible.";
        description_serie.textContent = description.replace(/<[^>]*>/g, "");
        details_serie.hidden = false;
    } catch (error) {
        message_erreur.textContent = "Impossible de charger les détails de la série.";
        message_erreur.hidden = false;
    }
    chargement.hidden = true;
}
chargerDetails();

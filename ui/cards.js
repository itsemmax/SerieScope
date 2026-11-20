import {supprimerSerie,modifierSerie} from "../main.js";
const liste_series = document.querySelector("#liste-series");
const etat_vide = document.querySelector("#etat-vide");
const nombre_series = document.querySelector("#nombre-series");
const filtre_genre = document.querySelector("#filtre-genre");
const filtre_langue = document.querySelector("#filtre-langue");

function afficherGenres_languages(liste) {
    const genre_selectionne = filtre_genre.value;
    const langue_selectionnee = filtre_langue.value;
    filtre_genre.innerHTML = '<option value="">Tous les genres</option>';
    filtre_langue.innerHTML = '<option value="">Toutes les langues</option>';
    let genres = [];
    let languages =[];
    liste.forEach((serie) => {
        (serie.genres || []).forEach((genre) => {
            if (!genres.includes(genre)) {
                let option = document.createElement("option");
                option.value = genre;
                option.textContent = genre;
                filtre_genre.append(option);
                genres.push(genre);
            }
        });
    });
    liste.forEach((serie) => {
            if (serie.language && !languages.includes(serie.language)) {
                languages.push(serie.language);
                let option = document.createElement("option");
                option.value = serie.language;
                option.textContent = serie.language;
                filtre_langue.append(option);
        };
    });
    filtre_genre.value = genres.includes(genre_selectionne) ? genre_selectionne : "";
    filtre_langue.value = languages.includes(langue_selectionnee) ? langue_selectionnee : "";
}

export function afficher(liste){
    liste_series.innerHTML = "";

    nombre_series.textContent = liste.length + " séries affichées";
    afficherGenres_languages(liste);
    
    if (liste.length === 0) {
        etat_vide.hidden = false;
        return;
    }
    etat_vide.hidden = true;
    liste.forEach((serie) => {
        let description = serie.summary || "Aucune description disponible";

        let carte = document.createElement("article");
        carte.className = "bg-[#1B1B1B] border border-[#333333] rounded-xl overflow-hidden";

        let affiche = document.createElement("img");
        affiche.src = serie.image?.original || "assets/images/image.png";
        affiche.alt = "Affiche de " + serie.name;
        affiche.className = "w-full h-110";

        let contenu = document.createElement("div");
        contenu.className = "p-3";

        let titre = document.createElement("h3");
        titre.className = "text-base font-bold mb-3";
        titre.textContent = serie.name || "Sans titre";

        let badges = document.createElement("div");
        badges.className = "flex flex-wrap gap-1 mb-3";

        (serie.genres || []).forEach((genre) => {
            let badge = document.createElement("span");
            badge.className = "bg-[#333333] text-[#DDDDDD] text-xs px-3 py-1 rounded-full";
            badge.textContent = genre;
            badges.appendChild(badge);
        });

        let desc = document.createElement("p");
        desc.className = "text-[#AAAAAA] text-sm truncate mb-1";
        desc.textContent = description.replace(/<[^>]*>/g, "");

        let btn_details = document.createElement("button");
        btn_details.textContent = "Voir les détails";
        btn_details.type = "button";
        btn_details.className = "w-full mt-4 bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-md text-sm";

        btn_details.addEventListener("click", () => {
            window.location.href = `details.html?id=${serie.id}`;
        });

        let actions = document.createElement("div");
        actions.className = "grid grid-cols-1 md:grid-cols-2 gap-2 mt-2";

        let btn_modifier = document.createElement("button");
        btn_modifier.textContent = "Modifier";
        btn_modifier.type = "button";
        btn_modifier.dataset.action = "modifier";
        btn_modifier.className = "bg-blue-950 bg-[#333333] text-white px-4 py-2 rounded-md text-sm";
        btn_modifier.addEventListener("click", () =>{
             modifierSerie(serie)});

        let btn_supprimer = document.createElement("button");
        btn_supprimer.textContent = "Supprimer";
        btn_supprimer.type = "button";
        btn_supprimer.dataset.action = "supprimer";
        btn_supprimer.className = "bg-red-950 text-red-300 px-4 py-2 rounded-md text-sm";
        btn_supprimer.addEventListener("click", () => supprimerSerie(serie));

        actions.append(btn_modifier, btn_supprimer);
        contenu.append(titre, badges, desc, btn_details, actions);
        carte.append(affiche, contenu);
        liste_series.append(carte);
    });
}

const liste_series = document.querySelector("#liste-series");
const etat_vide = document.querySelector("#etat-vide");
const nombre_series = document.querySelector("#nombre-series");
const filtre_genre = document.querySelector("#filtre-genre");

function afficherGenres(liste) {
    let genres = [];

    liste.forEach((serie) => {
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

export function afficher(liste){
    liste_series.innerHTML = "";

    nombre_series.textContent = liste.length + " séries affichées";
    
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
        affiche.src = serie.image?.original || "assets/images/placeholder.png";
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
        btn_details.className = "mt-4 bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-md text-sm";

        btn_details.addEventListener("click", () => {
            window.location.href = `details.html?id=${serie.id}`;
        });

        contenu.append(titre, badges, desc, btn_details);
        carte.append(affiche, contenu);
        liste_series.append(carte);
    });
    afficherGenres(liste);
}

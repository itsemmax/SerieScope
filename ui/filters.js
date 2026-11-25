import { state } from "../data/store.js";
import { chargerSeries } from "../main.js";

const recherche = document.querySelector("#recherche");
const filtre_genre = document.querySelector("#filtre-genre");
const filtre_langue = document.querySelector("#filtre-langue");
const btn_reinitialiser = document.querySelector("#btn-reinitialiser");

export function remplirFiltres(liste) {
    filtre_genre.innerHTML = '<option value="">Tous les genres</option>';
    filtre_langue.innerHTML = '<option value="">Toutes les langues</option>';
    let genres = [];
    let languages = [];

    liste.forEach((serie) => {
        (serie.genres || []).forEach((genre) => {
            if (!genres.includes(genre)) {
                genres.push(genre);
            }
        });
        if (serie.language && !languages.includes(serie.language)) {
            languages.push(serie.language);
        }
    });

    if (state.filters.genre && !genres.includes(state.filters.genre)) {
        genres.push(state.filters.genre);
    }
    if (state.filters.language && !languages.includes(state.filters.language)) {
        languages.push(state.filters.language);
    }

    genres.forEach((genre) => {
        let option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        filtre_genre.append(option);
    });
    languages.forEach((language) => {
        let option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        filtre_langue.append(option);
    });

    recherche.value = state.filters.name;
    filtre_genre.value = state.filters.genre;
    filtre_langue.value = state.filters.language;
}

function rechercherFiltrer() {
    state.filters.name = recherche.value.trim();
    state.filters.genre = filtre_genre.value;
    state.filters.language = filtre_langue.value;
    localStorage.setItem("filters", JSON.stringify(state.filters));
    chargerSeries();
}

recherche.addEventListener("input", rechercherFiltrer);
filtre_genre.addEventListener("change", rechercherFiltrer);
filtre_langue.addEventListener("change", rechercherFiltrer);

btn_reinitialiser.addEventListener("click", () => {
    state.filters = { name: "", genre: "", language: "" };
    recherche.value = "";
    filtre_genre.value = "";
    filtre_langue.value = "";
    localStorage.removeItem("filters");
    chargerSeries();
});

remplirFiltres([]);

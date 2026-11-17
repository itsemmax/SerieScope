export function afficherErreur(input,erreur,message) {
    erreur.textContent = message;
    input.classList.remove("border-[#383838]");
    input.classList.add("border-red-500");
}
export function supprimerErreur(input,erreur) {
    erreur.textContent = "";
    input.classList.remove("border-red-500");
    input.classList.add("border-[#383838]");
}

export const state = {
    series: [],
    filters: { name: "", genre: "", language: "" }
};

try{
    const filtres = JSON.parse(localStorage.getItem("filters"));
    if (filtres) {
        state.filters.name = filtres.name || "";
        state.filters.genre = filtres.genre || "";
        state.filters.language = filtres.language || "";
    }
}catch (error) {
    console.error(error);
}

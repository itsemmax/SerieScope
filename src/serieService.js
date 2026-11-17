import { myax } from "./api.js";

export async function getAll() {
    try {
        const response = await myax.get("/series");
        return response.data;
    }catch (error){
        console.error(error);
        throw error;
    }
}

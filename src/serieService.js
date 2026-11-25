import {myax } from "./api.js";

export async function getAll(filters = {}) {
    try {
        const response = await myax.get("/series", { params: filters });
        return response.data;
    }catch(error){
        throw error;
    }
}

export async function getById(id){
    try{
        const response = await myax.get(`/series/${id}`);
        return response.data;
    }catch(error){
        throw error;
    }
}
export async function create(serie){
    try{
        const response = await myax.post("/series",serie);
        return response.data;
    }catch(error){
        throw error;
    }
}
export async function update(id, serie) {
    try{
        const response = await myax.patch(`/series/${id}`,serie);
        return response.data;
    }catch(error){
        throw error;
    }
}
export async function remove(id){
    try{
        await myax.delete(`/series/${id}`);
    }catch(error){
        throw error;
    }
}

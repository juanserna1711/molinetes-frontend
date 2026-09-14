import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function consultarMolinetes(params = {}) {
    const response = await axios.get(`${API_URL}/molinetes`, {
        params
    });

    return response.data;
}

export async function crearMolinete(data) {
    const response = await axios.post(
        `${API_URL}/molinetes`,
        data
    );

    return response.data;
}

export async function actualizarMolinete(codigo, data) {
    const response = await axios.put(
        `${API_URL}/molinetes/${codigo}`,
        data
    );

    return response.data;
}


export async function eliminarMolinete(codigo) {
    const response = await axios.delete(
        `${API_URL}/molinetes/${codigo}`
    );
    return response.data;
}
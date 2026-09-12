import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function consultarRendTallas(params = {}) {
    const response = await axios.get(`${API_URL}/rendtallas`, {
        params
    });

    return response.data;
}

export async function crearRendTalla(data) {
    const response = await axios.post(
        `${API_URL}/rendtallas`,
        data
    );

    return response.data;
}

export async function actualizarRendTalla(codigo, data) {
    const response = await axios.put(
        `${API_URL}/rendtallas/${codigo}`,
        data
    );

    return response.data;
}

export async function eliminarRendTalla(codigo) {
    const response = await axios.delete(
        `${API_URL}/rendtallas/${codigo}`
    );

    return response.data;
}
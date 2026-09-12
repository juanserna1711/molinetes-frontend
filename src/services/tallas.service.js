import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function consultarTallas(params = {}) {
    const response = await axios.get(`${API_URL}/tallas`, {
        params
    });

    return response.data;
}

export async function crearTalla(data) {
    const response = await axios.post(
        `${API_URL}/tallas`,
        data
    );

    return response.data;
}

export async function actualizarTalla(codigo, data) {
    const response = await axios.put(
        `${API_URL}/tallas/${codigo}`,
        data
    );

    return response.data;
}

export async function activarTalla(codigo) {
    const response = await axios.patch(
        `${API_URL}/tallas/${codigo}/activar`
    );

    return response.data;
}

export async function desactivarTalla(codigo) {
    const response = await axios.patch(
        `${API_URL}/tallas/${codigo}/desactivar`
    );

    return response.data;
}
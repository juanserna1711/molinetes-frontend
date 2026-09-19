import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export async function consultarTigimoli(params = {}) {
    const response = await axios.get(
        `${API_URL}/tigimoli`,
        {
            params
        }
    );

    return response.data;
}

export async function consultarDetalleTigimoli(params = {}) {
    const response = await axios.get(
        `${API_URL}/tigimoli/detalle`,
        {
            params
        }
    );

    return response.data;
}


export async function crearTigimoli(data) {
    const response = await axios.post(
        `${API_URL}/tigimoli`,
        data
    );

    return response.data;
}
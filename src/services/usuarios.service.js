import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function consultarUsuarios(params = {}) {
    const response = await axios.get(`${API_URL}/usuarios`, {
        params
    });

    return response.data;
}

export async function crearUsuario(data) {
    const response = await axios.post(
        `${API_URL}/usuarios`,
        data
    );

    return response.data;
}

export async function actualizarUsuario(codigo, data) {
    const response = await axios.put(
        `${API_URL}/usuarios/${codigo}`,
        data
    );

    return response.data;
}

export async function activarUsuario(codigo) {
    const response = await axios.patch(
        `${API_URL}/usuarios/${codigo}/activar`
    );

    return response.data;
}

export async function desactivarUsuario(codigo) {
    const response = await axios.patch(
        `${API_URL}/usuarios/${codigo}/desactivar`
    );

    return response.data;
}

export async function eliminarUsuario(codigo) {
    const response = await axios.delete(
        `${API_URL}/usuarios/${codigo}`
    );
    return response.data;
}
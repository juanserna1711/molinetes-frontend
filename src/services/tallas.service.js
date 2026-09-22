/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /tallas para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/*
  Consulta los tallas utilizando los filtros recibidos.
*/
export async function consultarTallas(params = {}) {
    const response = await axios.get(`${API_URL}/tallas`, {
        params
    });

    return response.data;
}

/*
  Registra un nuevo talla con la información recibida.
*/
export async function crearTalla(data) {
    const response = await axios.post(
        `${API_URL}/tallas`,
        data
    );

    return response.data;
}

/*
  Actualiza la información del talla seleccionado.
*/
export async function actualizarTalla(codigo, data) {
    const response = await axios.put(
        `${API_URL}/tallas/${codigo}`,
        data
    );

    return response.data;
}

/*
  Activa el registro correspondiente al código recibido.
*/
export async function activarTalla(codigo) {
    const response = await axios.patch(
        `${API_URL}/tallas/${codigo}/activar`
    );

    return response.data;
}

/*
  Desactiva el registro correspondiente al código recibido.
*/
export async function desactivarTalla(codigo) {
    const response = await axios.patch(
        `${API_URL}/tallas/${codigo}/desactivar`
    );

    return response.data;
}

/*
  Elimina el talla correspondiente al código recibido.
*/
export async function eliminarTalla(codigo) {
    const response = await axios.delete(
        `${API_URL}/tallas/${codigo}`
    );

    return response.data;
}
/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /rendtallas para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/*
  Consulta los rendimientos por talla utilizando los filtros recibidos.
*/
export async function consultarRendTallas(params = {}) {
    const response = await axios.get(`${API_URL}/rendtallas`, {
        params
    });

    return response.data;
}

/*
  Registra un nuevo rendimiento por talla con la información recibida.
*/
export async function crearRendTalla(data) {
    const response = await axios.post(
        `${API_URL}/rendtallas`,
        data
    );

    return response.data;
}

/*
  Actualiza la información del rendimiento por talla seleccionado.
*/
export async function actualizarRendTalla(codigo, data) {
    const response = await axios.put(
        `${API_URL}/rendtallas/${codigo}`,
        data
    );

    return response.data;
}

/*
  Elimina el rendimiento por talla correspondiente al código recibido.
*/
export async function eliminarRendTalla(codigo) {
    const response = await axios.delete(
        `${API_URL}/rendtallas/${codigo}`
    );

    return response.data;
}
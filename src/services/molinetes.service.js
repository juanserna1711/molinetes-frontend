/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /molinetes para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/*
  Consulta los molinetes utilizando los filtros recibidos.
*/
export async function consultarMolinetes(params = {}) {
    const response = await axios.get(`${API_URL}/molinetes`, {
        params
    });

    return response.data;
}

/*
  Registra un nuevo molinete con la información recibida.
*/
export async function crearMolinete(data) {
    const response = await axios.post(
        `${API_URL}/molinetes`,
        data
    );

    return response.data;
}

/*
  Actualiza la información del molinete seleccionado.
*/
export async function actualizarMolinete(codigo, data) {
    const response = await axios.put(
        `${API_URL}/molinetes/${codigo}`,
        data
    );

    return response.data;
}


/*
  Elimina el molinete correspondiente al código recibido.
*/
export async function eliminarMolinete(codigo) {
    const response = await axios.delete(
        `${API_URL}/molinetes/${codigo}`
    );
    return response.data;
}
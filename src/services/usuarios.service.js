/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /usuarios para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/*
  Consulta los usuarios utilizando los filtros recibidos.
*/
export async function consultarUsuarios(params = {}) {
    const response = await axios.get(`${API_URL}/usuarios`, {
        params
    });

    return response.data;
}

/*
  Registra un nuevo usuario con la información recibida.
*/
export async function crearUsuario(data) {
    const response = await axios.post(
        `${API_URL}/usuarios`,
        data
    );

    return response.data;
}

/*
  Actualiza la información del usuario seleccionado.
*/
export async function actualizarUsuario(codigo, data) {
    const response = await axios.put(
        `${API_URL}/usuarios/${codigo}`,
        data
    );

    return response.data;
}

/*
  Activa el registro correspondiente al código recibido.
*/
export async function activarUsuario(codigo) {
    const response = await axios.patch(
        `${API_URL}/usuarios/${codigo}/activar`
    );

    return response.data;
}

/*
  Desactiva el registro correspondiente al código recibido.
*/
export async function desactivarUsuario(codigo) {
    const response = await axios.patch(
        `${API_URL}/usuarios/${codigo}/desactivar`
    );

    return response.data;
}

/*
  Elimina el usuario correspondiente al código recibido.
*/
export async function eliminarUsuario(codigo) {
    const response = await axios.delete(
        `${API_URL}/usuarios/${codigo}`
    );
    return response.data;
}
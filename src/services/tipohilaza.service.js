/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /tipohilaza para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

/*
  Las funciones entregan el cuerpo de respuesta del backend sin transformar sus datos.
  Los errores de Axios se propagan para que la página o el formulario gestione el mensaje.
*/
const API_URL = import.meta.env.VITE_API_URL;

// Consulta los tipos de hilaza utilizando los filtros recibidos.
export async function consultarTiposHilaza(params = {}) {
    const response = await axios.get(`${API_URL}/tipohilaza`, {
        params
    });

    return response.data;
}

// Registra un nuevo tipo de hilaza con la información recibida.
export async function crearTipoHilaza(data) {
    const response = await axios.post(
        `${API_URL}/tipohilaza`,
        data
    );

    return response.data;
}

// Actualiza la información del tipo de hilaza seleccionado.
export async function actualizarTipoHilaza(codigo, data) {
    const response = await axios.put(
        `${API_URL}/tipohilaza/${codigo}`,
        data
    );

    return response.data;
}

// Elimina el tipo de hilaza correspondiente al código recibido.
export async function eliminarTipoHilaza(codigo) {
    const response = await axios.delete(
        `${API_URL}/tipohilaza/${codigo}`
    );

    return response.data;
}
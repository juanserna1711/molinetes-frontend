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

import api from './api.js';

// Consulta los molinetes utilizando los filtros recibidos.
export async function consultarMolinetes(params = {}) {
    const response = await api.get(`/molinetes`, {params});

    return response.data;
}

// Registra un nuevo molinete con la información recibida.
export async function crearMolinete(data) {
    const response = await api.post(`/molinetes`, data);

    return response.data;
}

// Actualiza la información del molinete seleccionado.
export async function actualizarMolinete(codigo, data) {
    const response = await api.put(`/molinetes/${codigo}`, data);

    return response.data;
}
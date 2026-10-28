/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de atributos de orden de producción

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 27/Octubre/2026

  Descripcion responsabilidad:
  Expone las operaciones axios del recurso /orpratri para consultar y registrar
  los atributos asociados a una orden de producción.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';


// Consulta los atributos asociados a la orden de producción recibida.
export async function consultarOrpratri(codigo) {
    const response = await api.get(`/orpratri/${codigo}`);

    return response.data;
}

// Registra los atributos asociados a una orden de producción.
export async function crearOrpratri(data) {
    const response = await api.post(`/orpratri`, data);

    return response.data;
}
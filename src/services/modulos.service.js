/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /modulos para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';

// Consulta los módulos utilizando los filtros recibidos.
export async function consultarModulos(params = {}) {
    const response = await api.get(`/modulos`, { params });

    return response.data;
}

// Registra un nuevo módulo con la información recibida.
export async function crearModulo(data) {
    const response = await api.post(`/modulos`, data);

    return response.data;
}

// Actualiza la información del módulo seleccionado.
export async function actualizarModulo(codigo, data) {
    const response = await api.put(`/modulos/${codigo}`, data);

    return response.data;
}

// Elimina el módulo correspondiente al código recibido.
export async function eliminarModulo(codigo) {
    const response = await api.delete(`/modulos/${codigo}`);

    return response.data;
}
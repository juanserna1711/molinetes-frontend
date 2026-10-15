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

import api from './api.js';

// Consulta las tallas utilizando los filtros recibidos.
export async function consultarTallas(params = {}) {
    const response = await api.get(`/tallas`, {params});

    return response.data;
}

// Registra una nueva talla con la información recibida.
export async function crearTalla(data) {
    const response = await api.post(`/tallas`, data);

    return response.data;
}

// Actualiza la información de la talla seleccionada.
export async function actualizarTalla(codigo, data) {
    const response = await api.put(`/tallas/${codigo}`, data);

    return response.data;
}

// Activa el registro correspondiente al código recibido.
export async function activarTalla(codigo) {
    const response = await api.patch(`/tallas/${codigo}/activar`);

    return response.data;
}

// Desactiva el registro correspondiente al código recibido.
export async function desactivarTalla(codigo) {
    const response = await api.patch(`/tallas/${codigo}/desactivar`);

    return response.data;
}

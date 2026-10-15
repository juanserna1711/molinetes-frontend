/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones axios del recurso /tipohilaza para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';

// Consulta los tipos de hilaza utilizando los filtros recibidos.
export async function consultarTiposHilaza(params = {}) {
    const response = await api.get(`/tipohilaza`, {params});

    return response.data;
}

// Registra un nuevo tipo de hilaza con la información recibida.
export async function crearTipoHilaza(data) {
    const response = await api.post(`/tipohilaza`, data);

    return response.data;
}

// Actualiza la información del tipo de hilaza seleccionado.
export async function actualizarTipoHilaza(codigo, data) {
    const response = await api.put(`/tipohilaza/${codigo}`, data);

    return response.data;
}

// Elimina el tipo de hilaza correspondiente al código recibido.
export async function eliminarTipoHilaza(codigo) {
    const response = await api.delete(`/tipohilaza/${codigo}`);

    return response.data;
}
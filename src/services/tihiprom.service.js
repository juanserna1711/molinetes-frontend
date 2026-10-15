/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /tihiprom para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';

// Consulta los promedios por tipo de hilaza utilizando los filtros recibidos.
export async function consultarTiHiProm(params = {}) {
    const response = await api.get(`/tihiprom`, {params});

    return response.data;
}

// Registra nueva información de promedio por tipo de hilaza.
export async function crearTiHiProm(data) {
    const response = await api.post(`/tihiprom`, data);

    return response.data;
}

// Actualiza la información correspondiente al tipo de hilaza y talla seleccionados.
export async function actualizarTiHiProm(tipoHilaza, talla, data) {
    const response = await api.put(
        `/tihiprom/${tipoHilaza}/${talla}`, data);

    return response.data;
}
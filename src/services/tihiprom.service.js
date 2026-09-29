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

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/*
  Consulta los promedios por tipo de hilaza utilizando los filtros recibidos.
*/
export async function consultarTiHiProm(params = {}) {
    const response = await axios.get(`${API_URL}/tihiprom`, {
        params
    });

    return response.data;
}

/*
  Registra nueva información de promedio por tipo de hilaza.
*/
export async function crearTiHiProm(data) {
    const response = await axios.post(
        `${API_URL}/tihiprom`,
        data
    );

    return response.data;
}

/*
  Actualiza la información correspondiente al tipo de hilaza y talla seleccionados.
*/
export async function actualizarTiHiProm(
    tipoHilaza,
    talla,
    data
) {
    const response = await axios.put(
        `${API_URL}/tihiprom/${tipoHilaza}/${talla}`,
        data
    );

    return response.data;
}

/*
  Elimina la información correspondiente al tipo de hilaza y talla seleccionados.
*/
export async function eliminarTiHiProm(
    tipoHilaza,
    talla
) {
    const response = await axios.delete(
        `${API_URL}/tihiprom/${tipoHilaza}/${talla}`
    );

    return response.data;
}

/*
  Aplica en RENDTALL la parametrización del tipo de hilaza seleccionado.
*/
export async function aplicarTipoHilaza(
    tipoHilaza,
    data
) {
    const response = await axios.patch(
        `${API_URL}/tihiprom/${tipoHilaza}/aplicar`,
        data
    );

    return response.data;
}
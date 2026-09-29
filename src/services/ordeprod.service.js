/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de órdenes de trabajo ORDEPROD

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /ordeprod para consultar
  el historial y detalle de las órdenes de trabajo.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


/*
  Consulta las órdenes de trabajo utilizando
  los filtros y paginación recibidos.
*/
export async function consultarOrdeProd(params = {}) {

    const response = await axios.get(
        `${API_URL}/ordeprod`,
        {
            params
        }
    );

    return response.data;
}


/*
  Consulta el detalle de una Orden de Trabajo.
*/
export async function consultarDetalleOrdeProd(codigoOrden) {

    const response = await axios.get(
        `${API_URL}/ordeprod/${codigoOrden}`
    );

    return response.data;
}
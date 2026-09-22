/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /tigimoli para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


/*
  Consulta los cálculos TIGIMOLI utilizando los filtros recibidos.
*/
export async function consultarTigimoli(params = {}) {
    const response = await axios.get(
        `${API_URL}/tigimoli`,
        {
            params
        }
    );

    return response.data;
}

/*
  Consulta el detalle del cálculo seleccionado.
*/
export async function consultarDetalleTigimoli(params = {}) {
    const response = await axios.get(
        `${API_URL}/tigimoli/detalle`,
        {
            params
        }
    );

    return response.data;
}


/*
  Registra un nuevo cálculo TIGIMOLI con la información recibida.
*/
export async function crearTigimoli(data) {
    const response = await axios.post(
        `${API_URL}/tigimoli`,
        data
    );

    return response.data;
}
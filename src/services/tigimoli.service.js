/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone la operación Axios del recurso /tigimoli para registrar
  cálculos y generar la respectiva Orden de Trabajo.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 25/Septiembre/2026
  Descripcion:
  Se eliminan las consultas históricas de TIGIMOLI y se conserva
  únicamente el registro del cálculo.
=============================================================================*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


/*
  Registra un nuevo cálculo TIGIMOLI y genera
  la respectiva Orden de Trabajo.
*/
export async function crearTigimoli(data) {

    const response = await axios.post(
        `${API_URL}/tigimoli`,
        data
    );

    return response.data;
}
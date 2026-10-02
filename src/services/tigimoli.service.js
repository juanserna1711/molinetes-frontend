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

/*
  Las funciones entregan el cuerpo de respuesta del backend sin transformar sus datos.
  Los errores de Axios se propagan para que la página o el formulario gestione el mensaje.
*/
const API_URL = import.meta.env.VITE_API_URL;


/*
  Envía el cálculo preparado por la página, conservando el orden de las listas paralelas.
  La respuesta del registro permite identificar la Orden de Trabajo generada.
*/
export async function crearTigimoli(data) {

    const response = await axios.post(
        `${API_URL}/tigimoli`,
        data
    );

    return response.data;
}
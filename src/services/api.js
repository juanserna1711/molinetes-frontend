/*=============================================================================
  Nombre responsabilidad: Configuración HTTP común de la API

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Crea una instancia común de Axios con la URL base del backend y el envío
  de credenciales para las solicitudes realizadas desde los servicios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import axios from 'axios';

/*
  Crea la instancia Axios utilizada por los servicios del frontend.
  baseURL toma la dirección del backend desde VITE_API_URL y
  withCredentials permite enviar la cookie HttpOnly de autenticación.
*/
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export default api;
/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de login y autenticación

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 06/Octubre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /auth para iniciar, consultar
  y cerrar la sesión del usuario.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';

// Inicia sesión con las credenciales enviadas por el usuario.
export async function iniciarSesion(data) {

    const response = await api.post(`/auth/login`, data);

    return response.data;
}

// Consulta la sesión autenticada actualmente.
export async function obtenerSesion() {

    const response = await api.get(`/auth/me`);

    return response.data;
}

// Cierra la sesión actual y elimina la cookie de autenticación.
export async function cerrarSesion() {

    const response = await api.post(`/auth/logout`, {});

    return response.data;
}
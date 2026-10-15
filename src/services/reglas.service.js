/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de reglas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Expone las operaciones Axios del recurso /reglas para la gestión
  de permisos asociados a usuarios y módulos.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';

// Consulta las reglas utilizando los filtros recibidos.
export async function consultarReglas(params = {}) {
    const response = await api.get(`/reglas`, { params });

    return response.data;
}

// Consulta las reglas correspondientes al usuario autenticado.
export async function consultarMisPermisos() {
    const response = await api.get('/reglas/mis-permisos');

    return response.data;
}

// Registra una nueva regla con la información recibida.
export async function crearRegla(data) {
    const response = await api.post(`/reglas`, data);

    return response.data;
}

// Actualiza los permisos de la regla seleccionada.
export async function actualizarRegla(codigo, data) {
    const response = await api.put(`/reglas/${codigo}`, data);

    return response.data;
}

// Elimina la regla correspondiente al código recibido.
export async function eliminarRegla(codigo) {
    const response = await api.delete(`/reglas/${codigo}`);

    return response.data;
}
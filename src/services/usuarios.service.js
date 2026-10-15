/*=============================================================================
  Nombre responsabilidad: Comunicación HTTP de usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Expone las operaciones axios del recurso /usuarios para páginas y formularios.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import api from './api.js';


// Consulta los usuarios utilizando los filtros recibidos.
export async function consultarUsuarios(params = {}) {
    const response = await api.get(`/usuarios`, {params});

    return response.data;
}

// Registra un nuevo usuario con la información recibida.
export async function crearUsuario(data) {
    const response = await api.post(`/usuarios`, data);

    return response.data;
}

// Actualiza la información del usuario seleccionado.
export async function actualizarUsuario(codigo, data) {
    const response = await api.put(`/usuarios/${codigo}`, data);

    return response.data;
}

// Activa el registro correspondiente al código recibido.
export async function activarUsuario(codigo) {
    const response = await api.patch(`/usuarios/${codigo}/activar`);

    return response.data;
}

// Desactiva el registro correspondiente al código recibido.
export async function desactivarUsuario(codigo) {
    const response = await api.patch(`/usuarios/${codigo}/desactivar`);

    return response.data;
}
/*=============================================================================
  Nombre responsabilidad: Consulta de permisos por módulo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 09/Octubre/2026

  Descripcion responsabilidad:
  Obtiene los permisos de consulta, inserción, actualización, eliminación
  y reporte asociados a un módulo desde el contexto de permisos.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { usePermisosContext } from '../contexts/PermisosContext.jsx';


export function usePermisos(codigoModulo) {

    const {
        permisosPorModulo,
        loadingPermisos,
        errorPermisos
    } = usePermisosContext();


    const permisos = permisosPorModulo[codigoModulo] || {

        consulta: false,
        insercion: false,
        actualiza: false,
        elimina: false,
        reporte: false
    };


    return {

        ...permisos,

        loadingPermisos,
        errorPermisos
    };
}
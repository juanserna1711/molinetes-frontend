/*=============================================================================
  Nombre responsabilidad: Validar acceso a rutas por permiso de consulta

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 09/Octubre/2026

  Descripcion responsabilidad:
  Controla el acceso a una ruta protegida según el permiso de consulta
  configurado para el módulo correspondiente.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Navigate } from 'react-router-dom';

import { usePermisos } from '../hooks/usePermisos.js';


function PermissionRoute({
    codigoModulo,
    children
}) {

    const {
        consulta,
        loadingPermisos
    } = usePermisos(codigoModulo);


    /*
      Espera la carga de permisos antes de decidir el acceso.
    */
    if (loadingPermisos) {
        return null;
    }


    /*
      Si el usuario no puede consultar el módulo,
      regresa al inicio.
    */
    if (!consulta) {

        return (
            <Navigate
                to="/inicio"
                replace
            />
        );
    }


    return children;
}


export default PermissionRoute;
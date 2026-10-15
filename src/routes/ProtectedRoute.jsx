/*=============================================================================
  Nombre responsabilidad: Proteger rutas autenticadas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 06/Octubre/2026

  Descripcion responsabilidad:
  Controla el acceso a las rutas privadas de la aplicación según el estado
  de autenticación y redirige al login cuando no existe una sesión válida.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';


function ProtectedRoute() {

    const {
        autenticado,
        loadingAuth
    } = useAuth();


    if (loadingAuth) {
        return null;
    }


    if (!autenticado) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;

}


export default ProtectedRoute;
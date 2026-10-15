/*=============================================================================
  Nombre responsabilidad: Administrar el estado global de autenticación

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 06/Octubre/2026

  Descripcion responsabilidad:
  Mantiene la sesión autenticada disponible para toda la aplicación,
  consulta la sesión vigente al iniciar y coordina las operaciones de
  inicio y cierre de sesión.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import {
    iniciarSesion as iniciarSesionService,
    obtenerSesion,
    cerrarSesion as cerrarSesionService
} from '../services/auth.service.js';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);

    const [loadingAuth, setLoadingAuth] = useState(true);


    useEffect(() => {

        async function cargarSesion() {

            try {

                const response = await obtenerSesion();

                setUsuario(response.usuario);

            } catch {

                setUsuario(null);

            } finally {

                setLoadingAuth(false);

            }

        }

        cargarSesion();

    }, []);


    async function login(data) {

        const response = await iniciarSesionService(data);

        setUsuario(response.usuario);

        return response;

    }


    async function logout() {

        await cerrarSesionService();

        setUsuario(null);

    }


    const value = {
        usuario,
        autenticado: Boolean(usuario),
        loadingAuth,
        login,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider.'
        );
    }

    return context;

}
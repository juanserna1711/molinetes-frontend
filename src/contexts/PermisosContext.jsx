/*=============================================================================
  Nombre responsabilidad: Administrar los permisos del usuario autenticado

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 09/Octubre/2026

  Descripcion responsabilidad:
  Consulta y mantiene disponibles los permisos de acceso por módulo
  correspondientes al usuario autenticado.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

import { useAuth } from './AuthContext.jsx';
import { consultarMisPermisos } from '../services/reglas.service.js';


const PermisosContext = createContext(null);


export function PermisosProvider({ children }) {

    const {
        usuario,
        loadingAuth
    } = useAuth();

    const [reglas, setReglas] = useState([]);
    const [loadingPermisos, setLoadingPermisos] = useState(true);
    const [errorPermisos, setErrorPermisos] = useState(null);


    /* =========================================================
       CARGAR PERMISOS
       ========================================================= */

    useEffect(() => {

        async function cargarPermisos() {

            /*
              Espera que AuthContext determine si existe una sesión vigente.
            */
            if (loadingAuth) {
                return;
            }

            if (!usuario?.codigo) {

                setReglas([]);
                setErrorPermisos(null);
                setLoadingPermisos(false);

                return;
            }

            try {

                setLoadingPermisos(true);
                setErrorPermisos(null);

                const response = await consultarMisPermisos();

                const datos = response.data || response;

                setReglas(datos);

            } catch (error) {

                console.error(error);

                setReglas([]);

                setErrorPermisos(error.response?.data?.message || 'No fue posible cargar los permisos del usuario.');

            } finally {

                setLoadingPermisos(false);

            }
        }

        cargarPermisos();

    }, [usuario?.codigo, loadingAuth]);


    /* =========================================================
       PERMISOS POR MÓDULO
       ========================================================= */

    const permisosPorModulo = useMemo(() => {

        return Object.fromEntries(

            reglas.map((regla) => [

                regla.codigoModulo,

                {
                    consulta:
                        String(regla.consulta).toUpperCase() === 'A',

                    insercion:
                        String(regla.insercion).toUpperCase() === 'A',

                    actualiza:
                        String(regla.actualiza).toUpperCase() === 'A',

                    elimina:
                        String(regla.elimina).toUpperCase() === 'A',

                    reporte:
                        String(regla.reporte).toUpperCase() === 'A'
                }

            ])
        );

    }, [reglas]);


    const value = {

        reglas,
        permisosPorModulo,
        loadingPermisos,
        errorPermisos
    };


    return (

        <PermisosContext.Provider value={value}>

            {children}

        </PermisosContext.Provider>

    );
}


export function usePermisosContext() {

    const context = useContext(PermisosContext);

    if (!context) {

        throw new Error(
            'usePermisosContext debe utilizarse dentro de PermisosProvider.'
        );
    }

    return context;
}
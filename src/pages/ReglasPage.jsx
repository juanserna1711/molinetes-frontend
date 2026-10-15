/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de reglas de permisos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 09/Octubre/2026

  Descripcion responsabilidad:
  Carga usuarios, módulos y reglas, administra los filtros y cambios locales
  de permisos, y coordina el guardado de la matriz de autorizaciones.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import { usePermisos } from '../hooks/usePermisos.js';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { consultarUsuarios } from '../services/usuarios.service.js';
import { consultarModulos } from '../services/modulos.service.js';
import {
    consultarReglas,
    actualizarRegla
} from '../services/reglas.service.js';
import ReglasMatriz from '../components/Regla/ReglasMatriz.jsx';
import Snackbar from '../components/Snackbar.jsx';


function ReglasPage() {

    const [usuarios, setUsuarios] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [reglas, setReglas] = useState([]);
    const [reglasActualizando, setReglasActualizando] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [moduloSeleccionado, setModuloSeleccionado] = useState('');
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);
    const [loadingReglas, setLoadingReglas] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});
    const permisos = usePermisos(10);


    /* =========================================================
       SNACKBAR
       ========================================================= */

    function mostrarSnackbar(message, type = 'success') {
        setSnackbar({message, type});
    }


    useEffect(() => {

        if (!snackbar.message) {
            return;
        }

        // Cada mensaje programa su cierre; la limpieza cancela el temporizador anterior.
        const timer = setTimeout(() => {

            setSnackbar({message: '', type: 'success'});

        }, 3000);

        return () => clearTimeout(timer);

    }, [snackbar.message]);


    /* =========================================================
       CARGAR CATÁLOGOS
       ========================================================= */

    useEffect(() => {

        async function cargarCatalogos() {

            try {

                setLoadingCatalogos(true);
                setError(null);

                const [respuestaUsuarios, respuestaModulos] = await Promise.all([consultarUsuarios(), consultarModulos()]);

                setUsuarios(respuestaUsuarios.data || respuestaUsuarios);
                setModulos(respuestaModulos.data || respuestaModulos);

            } catch (error) {

                console.error(error);

                setError(error.response?.data?.message || 'No fue posible cargar los usuarios y módulos.');

            } finally {

                setLoadingCatalogos(false);

            }
        }

        cargarCatalogos();

    }, []);


    /* =========================================================
       FILTROS
       ========================================================= */

    function obtenerFiltros() {

        const filtros = {};

        if (usuarioSeleccionado !== '') {
            filtros.usuario = Number(usuarioSeleccionado);
        }

        if (moduloSeleccionado !== '') {
            filtros.modulo = Number(moduloSeleccionado);
        }

        return filtros;
    }


    /* =========================================================
       CARGAR REGLAS
       ========================================================= */

    useEffect(() => {

        const filtros = {};

        if (usuarioSeleccionado !== '') {
            filtros.usuario = Number(usuarioSeleccionado);
        }

        if (moduloSeleccionado !== '') {
            filtros.modulo = Number(moduloSeleccionado);
        }

        cargarReglas(filtros);

    }, [usuarioSeleccionado, moduloSeleccionado]);


    async function cargarReglas(filtros = {}) {

        try {

            setLoadingReglas(true);
            setError(null);

            const respuesta = await consultarReglas(filtros);

            setReglas(respuesta.data);

        } catch (error) {

            console.error(error);

            setReglas([]);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar las reglas de permisos.'
            );

        } finally {

            setLoadingReglas(false);
        }
    }


    /* =========================================================
       EDICIÓN DE PERMISOS
       ========================================================= */

    async function cambiarPermiso(codigoRegla, permiso) {

        if (!permisos.actualiza) {
            return;
        }

        const reglaActual = reglas.find((regla) => regla.codigo === codigoRegla);

        if (!reglaActual) {
            return;
        }

        const nuevaRegla = {...reglaActual, [permiso] : reglaActual[permiso] === 'A' ? 'I' : 'A'};

        //Refleja inmediatamente el cambio en pantalla.
        setReglas((actuales) => (

            actuales.map((regla) => (regla.codigo === codigoRegla ? nuevaRegla : regla))

        ));

        //Evita nuevos cambios sobre la misma regla mientras se actualiza en el servidor.
        setReglasActualizando((actuales) => [...actuales, codigoRegla]);

        try {

            await actualizarRegla(
                codigoRegla,
                {
                    consulta: nuevaRegla.consulta,
                    insercion: nuevaRegla.insercion,
                    actualiza: nuevaRegla.actualiza,
                    elimina: nuevaRegla.elimina,
                    reporte: nuevaRegla.reporte
                }
            );

        } catch (error) {

            console.error(error);

            //Si falla el servidor restaura la regla anterior.
            setReglas((actuales) => (

                actuales.map((regla) => (regla.codigo === codigoRegla ? reglaActual : regla))

            ));


            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible actualizar el permiso.',
                'error'
            );

        } finally {

            setReglasActualizando((actuales) => (

                actuales.filter((codigo) => codigo !== codigoRegla)

            ));
        }
    }

    const loading = loadingCatalogos || loadingReglas;
    const actualizando = reglasActualizando.length > 0;
    const hayFiltros = usuarioSeleccionado !== '' || moduloSeleccionado !== '';

    return (

        <section className="page">

            <header className="page-header">

                <div className="page-header-info">

                    <h1>Gestión de Permisos</h1>

                    <p>Asigne las acciones permitidas para cada usuario y módulo.</p>

                </div>

            </header>

            <section className="filters">

                <div className="filter-field filter-field-medium">

                    <label>
                        Usuario
                    </label>

                    <Autocomplete
                        className="reglas-autocomplete"
                        options={usuarios}
                        value={usuarios.find((usuario) => usuario.codigo === Number(usuarioSeleccionado)) || null}
                        onChange={(event, usuario) => {
                            setUsuarioSeleccionado(usuario ? String(usuario.codigo) : '');
                        }}
                        getOptionLabel={(usuario) =>`${usuario.nombre}`}
                        isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                        disabled={actualizando}
                        ListboxProps={{style: {maxHeight: 260}}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Todos los usuarios"
                            />
                        )}
                    />

                </div>


                <div className="filter-field filter-field-medium">

                    <label>
                        Módulo
                    </label>

                    <Autocomplete
                        className="reglas-autocomplete"
                        options={modulos}
                        value={modulos.find((modulo) => modulo.codigo === Number(moduloSeleccionado)) || null}
                        onChange={(event, modulo) => {
                            setModuloSeleccionado(modulo ? String(modulo.codigo) : '');
                        }}
                        getOptionLabel={(modulo) => modulo.nombre}
                        isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                        disabled={actualizando}
                        ListboxProps={{style: {maxHeight: 260}}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Todos los módulos"
                                size="small"
                            />
                        )}
                    />

                </div>

            </section>

            {loading && (
                <div className="state-container loading-state">
                    <CircularProgress
                        size={30}
                        thickness={4}
                    />

                    <div className="state-content">
                        <h2>Cargando permisos</h2>
                        <p>Consultando usuarios, módulos y reglas...</p>
                    </div>
                </div>
            )}

            {!loading && error && (
                <div className="state-container error-state">

                    <div className="state-icon error-icon">
                        <ErrorOutlineOutlinedIcon />
                    </div>

                    <div className="state-content">
                        <h2>No fue posible cargar los permisos</h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarReglas(obtenerFiltros())}
                        >
                            Reintentar
                        </button>
                    </div>

                </div>
            )}


            {!loading && !error && reglas.length === 0 && (

                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">
                        <SearchOffOutlinedIcon />
                    </div>

                    <div className="state-content">

                    <h2>
                        {hayFiltros ? 'No se encontraron reglas' : 'No hay reglas registradas'}
                    </h2>

                    <p>
                        {hayFiltros ? 'No hay reglas que coincidan con los filtros seleccionados.' : 'Aún no existen reglas registradas en el sistema.'}
                    </p>
                    </div>

                </div>

            )}

            {!loading && !error && reglas.length > 0 && (

                <ReglasMatriz
                    reglas={reglas}
                    reglasActualizando={reglasActualizando}
                    onCambiarPermiso={cambiarPermiso}
                    puedeActualizar={permisos.actualiza}
                />

            )}

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
            />

        </section>
    );
}

export default ReglasPage;
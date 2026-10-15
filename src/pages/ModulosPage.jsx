/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Conecta la tabla, el formulario, la confirmación de borrado y los servicios
  de módulos.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import { usePermisos } from '../hooks/usePermisos.js';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

import {
    consultarModulos,
    crearModulo as crearModuloService,
    actualizarModulo as actualizarModuloService,
    eliminarModulo as eliminarModuloService
} from '../services/modulos.service';

import ModulosTable from '../components/Modulo/ModulosTable';
import ModuloForm from '../components/Modulo/ModuloForm';
import ConfirmModal from '../components/ConfirmModal';
import Snackbar from '../components/Snackbar';


function ModulosPage() {

    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [zona, setZona] = useState('');
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [moduloAEliminar, setModuloAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});
    const permisos = usePermisos(9);


    /*
      =========================================================
      FUNCIONES DE LA TABLA
      =========================================================
    */

    function solicitarEliminarModulo(modulo) {
        if (!permisos.elimina){
            return;
        }        
        setModuloAEliminar(modulo);
    }

    function editarModulo(modulo) {
        if (!permisos.elimina) {
            return;
        }
        setModuloSeleccionado(modulo);
        setMostrarFormulario(true);
    }


    /*
      =========================================================
      SNACKBAR
      =========================================================
    */

    function mostrarSnackbar(message, type = 'success') {
        setSnackbar({message, type});
    }

    useEffect(() => {

        if (!snackbar.message) {
            return;
        }

        const timer = setTimeout(() => {

            setSnackbar({message: '', type: 'success'});

        }, 3000);

        return () => clearTimeout(timer);

    }, [snackbar.message]);


    /*
      =========================================================
      FILTROS
      =========================================================
    */

    // Prepara los filtros de código, nombre y zona para la consulta.
    function obtenerFiltros() {
        const filtros = {};
        const valor = busqueda.trim();

        if (valor !== '') {
            if (!isNaN(valor)) {
                filtros.codigo = Number(valor);
            } else {
                filtros.nombre = valor;
            }
        }

        if (zona !== '') {
            filtros.zona = zona;
        }

        return filtros;
    }

    /*
      =========================================================
      BÚSQUEDA AUTOMÁTICA
      =========================================================
    */

    useEffect(() => {
        const filtros = {};

        const valor = busqueda.trim();

        if (valor !== '') {

            if (!isNaN(valor)) {

                filtros.codigo = Number(valor);

            } else {

                filtros.nombre = valor;
            }
        }

        if (zona !== '') {

            filtros.zona = zona
        }

        cargarModulos(filtros);

    }, [busqueda, zona]);


    // Consulta los registros y actualiza el listado y los mensajes de la página.
    async function cargarModulos(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarModulos(filtros);

            setModulos(resultado.data);

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || 'No fue posible cargar los módulos.');

        } finally {

            setLoading(false);

        }
    }


    /*
      =========================================================
      FORMULARIO
      =========================================================
    */

    function cerrarFormulario() {

        setMostrarFormulario(false);
        setModuloSeleccionado(null);

    }

    // Guarda los cambios del registro seleccionado y actualiza el listado.
    async function actualizarModulo(modulo, data) {
        await actualizarModuloService(modulo.codigo, data);

        cerrarFormulario();

        await cargarModulos(obtenerFiltros());
        mostrarSnackbar('Módulo actualizado correctamente.', 'success');
    }

    //Crea o actualiza el registro y recarga el listado al completar la operación.
    async function guardarModulo(data) {
        if (moduloSeleccionado) {
            if(!permisos.actualiza){
                return;
            }
            await actualizarModulo(moduloSeleccionado, data);
        } else {
            if(!permisos.insercion){
                return;
            }
            await crearModuloService(data);

            cerrarFormulario();

            await cargarModulos(obtenerFiltros());
            mostrarSnackbar('Módulo creado correctamente.', 'success');
        }
    }

    // Elimina el registro confirmado y comunica el resultado de la operación.
    async function confirmarEliminarModulo() {
        if (!moduloAEliminar) return;

        try {
            setEliminando(true);

            await eliminarModuloService(moduloAEliminar.codigo);
            await cargarModulos(obtenerFiltros());

            mostrarSnackbar('Módulo eliminado correctamente.', 'success');
        } catch (error) {
            console.error(error);

            mostrarSnackbar(error.response?.data?.message || 'No fue posible eliminar el módulo.', 'error');
        } finally {
            setEliminando(false);
            setModuloAEliminar(null);
        }
    }


    const hayFiltros = busqueda.trim() !== '' || zona !== '';
    const zonasModulos = [...new Set(modulos.map(modulo => modulo.zona).filter(Boolean))];

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">
                    <h1>Gestión de Módulos</h1>

                    <p>Administración de los módulos disponibles en MoliPlus.</p>
                </div>

                {permisos.insercion &&(
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {setModuloSeleccionado(null); setMostrarFormulario(true);}}
                >
                    <AddIcon />
                    Nuevo Módulo
                </button>
                )}

            </div>

            <div className="filters">

                <div className="search-box">
                    <SearchOutlinedIcon />

                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={busqueda}
                        onChange={(event) => {
                            setBusqueda(event.target.value);
                        }}
                        maxLength={100}
                    />
                </div>

                <div className="filter-field">

                    <select
                        value={zona}
                        onChange={(event) => {
                            setZona(event.target.value);
                        }}
                    >
                        <option value="">
                            Todas las zonas
                        </option>

                        {zonasModulos.map((zonaModulo) => (

                            <option
                                key={zonaModulo}
                                value={zonaModulo}
                            >
                                {zonaModulo}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            <div className={`page-workspace ${mostrarFormulario ? 'form-open' : ''}`}>

            {loading && (
                <div className="state-container loading-state">
                    <CircularProgress
                        size={30}
                        thickness={4}
                    />

                    <div className="state-content">
                        <h2>Cargando módulos</h2>
                        <p>Consultando la información...</p>
                    </div>
                </div>
            )}


            {!loading && error && (
                <div className="state-container error-state">

                    <div className="state-icon error-icon">
                        <ErrorOutlineOutlinedIcon />
                    </div>

                    <div className="state-content">
                        <h2>No fue posible cargar los módulos</h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarTallas(obtenerFiltros())}
                        >
                            Reintentar
                        </button>
                    </div>

                </div>
            )}


            {!loading && !error && modulos.length === 0 && (
                <div className="state-container empty-state">

                    <div className="state-icon">
                        <SearchOffOutlinedIcon />
                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros ? 'No se encontraron módulos' : 'No hay módulos registrados'}
                        </h2>

                        <p>
                            {hayFiltros ? 'Intenta modificar los filtros de búsqueda.' : 'Registra un módulo para comenzar.'}
                        </p>

                    </div>

                </div>
            )}

            {!loading && !error && modulos.length > 0 && (
                <div className="table-section">
                    <ModulosTable
                        modulos={modulos}
                        onEdit={editarModulo}
                        onDelete={solicitarEliminarModulo}
                        puedeActualizar={permisos.actualiza}
                        puedeEliminar={permisos.elimina}
                    />
                </div>
            )}

            {mostrarFormulario && (
                <aside className="form-section">
                    <ModuloForm
                        modulo={moduloSeleccionado}
                        zonas={zonasModulos}
                        onClose={cerrarFormulario}
                        onSubmit={guardarModulo}
                    />
                </aside>
            )}

            </div>

            {moduloAEliminar && (
                <ConfirmModal
                    title="Eliminar módulo"
                    message={`¿Está seguro de que desea eliminar el módulo "${moduloAEliminar.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirm={confirmarEliminarModulo}
                    onCancel={() => setModuloAEliminar(null)}
                    loading={eliminando}
                />
            )}

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
            />

        </section>
    );
}

export default ModulosPage;
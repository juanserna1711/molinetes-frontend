/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Conecta la tabla, el formulario, la confirmación de borrado y los servicios de rendimientos por talla.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

import {
    consultarRendTallas,
    crearRendTalla as crearRendTallaService,
    actualizarRendTalla as actualizarRendTallaService,
    eliminarRendTalla as eliminarRendTallaService
} from '../services/rendtallas.service';

import RendTallasTable from '../components/RendTallasTable';
import RendTallaForm from '../components/RendTallaForm';

import Snackbar from '../components/Snackbar';
import ConfirmModal from '../components/ConfirmModal';

function RendTallasPage() {

    const [rendtallas, setRendTallas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('');

    const [rendtallaSeleccionada, setRendTallaSeleccionada] = useState(null);

    const [rendtallaAEliminar, setRendTallaAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: '',
        type: 'success'
    });


    /*
      =========================================================
      FUNCIONES DE LA TABLA
      =========================================================
    */

    function editarRendTalla(rendtalla) {
        setRendTallaSeleccionada(rendtalla);
        setMostrarFormulario(true);
    }


    function agregarRendTalla(rendtalla) {
        /*
         * La talla no tiene rendimiento.
         *
         * Abrimos el mismo formulario de nuevo rendimiento,
         * pero enviamos la talla seleccionada para que aparezca
         * automáticamente en el selector.
         */
        setRendTallaSeleccionada(rendtalla);
        setMostrarFormulario(true);
    }


    function solicitarEliminarRendTalla(rendtalla) {
        setRendTallaAEliminar(rendtalla);
    }


    /*
      =========================================================
      SNACKBAR
      =========================================================
    */

    function mostrarSnackbar(message, type = 'success') {
        setSnackbar({
            message,
            type
        });
    }


    useEffect(() => {

        if (!snackbar.message) {
            return;
        }

        const timer = setTimeout(() => {
            setSnackbar({
                message: '',
                type: 'success'
            });
        }, 3000);

        return () => clearTimeout(timer);

    }, [snackbar.message]);


    /*
      =========================================================
      FILTROS
      =========================================================
    */

    /*
      Prepara los filtros de búsqueda de la página.
    */
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

        if (estado !== '') {
            filtros.estado = estado;
        }

        return filtros;
    }


    /*
      =========================================================
      CARGA INICIAL
      =========================================================
    */

    useEffect(() => {
        cargarRendTallas();
    }, []);


    /*
      =========================================================
      BÚSQUEDA AUTOMÁTICA
      =========================================================
    */

    useEffect(() => {
        cargarRendTallas(obtenerFiltros());
    }, [busqueda]);


    /*
      Consulta los registros y actualiza el listado y los mensajes de la página.
    */
    async function cargarRendTallas(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarRendTallas(filtros);

            setRendTallas(resultado.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar los rendimientos.'
            );

        } finally {

            setLoading(false);

        }
    }


    function cerrarFormulario() {

        setMostrarFormulario(false);
        setRendTallaSeleccionada(null);

    }

    /*
      Crea o actualiza el registro y recarga el listado al completar la operación.
    */
    async function guardarRendTalla(data, modo) {

        try {

            if (modo === 'editar') {

                await actualizarRendTallaService(
                    data.codTalla,
                    data
                );

                mostrarSnackbar(
                    'Rendimiento actualizado correctamente.',
                    'success'
                );

            } else {

                await crearRendTallaService(data);

                mostrarSnackbar(
                    'Rendimiento creado correctamente.',
                    'success'
                );

            }

            cerrarFormulario();

            await cargarRendTallas(obtenerFiltros());

        } catch (error) {

            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible guardar el rendimiento.',
                'error'
            );

        }
    }

    /*
      Elimina el registro confirmado y comunica el resultado de la operación.
    */
    async function confirmarEliminarRendimiento() {

        if (!rendtallaAEliminar) {
            return;
        }

        try {

            setEliminando(true);

            await eliminarRendTallaService(
                rendtallaAEliminar.codigo
            );

            await cargarRendTallas(obtenerFiltros());

            setRendTallaAEliminar(null);

            mostrarSnackbar(
                'Rendimiento eliminado correctamente.',
                'success'
            );

        } catch (error) {

            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible eliminar el rendimiento.',
                'error'
            );

        } finally {

            setEliminando(false);

        }
    }


    const hayFiltros =
        busqueda.trim() !== '' ||
        estado !== '';

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>
                        Gestión de Rendimiento
                    </h1>

                    <p>
                        Administración de parámetros de rendimiento
                        con la talla asociada.
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        setRendTallaSeleccionada(null);
                        setMostrarFormulario(true);
                    }}
                >

                    <AddIcon />

                    Nuevo Rendimiento

                </button>

            </div>

            <div className="filters">

                <div className="search-box">

                    <SearchOutlinedIcon />

                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={busqueda}
                        onChange={(event) =>
                            setBusqueda(event.target.value)
                        }
                        maxLength={60}
                    />

                </div>


                <select
                    value={estado}
                    onChange={(event) =>
                        setEstado(event.target.value)
                    }
                >

                    <option value="">
                        Todos los estados
                    </option>

                    <option value="A">
                        Activos
                    </option>

                    <option value="I">
                        Inactivos
                    </option>

                </select>

            </div>


            {loading && (
                <div className="state-container loading-state">
                    <CircularProgress
                        size={30}
                        thickness={4}
                    />

                    <div className="state-content">
                        <h2>Cargando rendimientos</h2>
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
                        <h2>No fue posible cargar los rendimientos</h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarRendTallas(obtenerFiltros())}
                        >
                            Reintentar
                        </button>
                    </div>

                </div>
            )}

            {!loading && !error && rendtallas.length === 0 && (
                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">
                        <SearchOffOutlinedIcon />
                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros
                                ? 'No se encontraron tallas'
                                : 'No hay tallas registradas'}
                        </h2>

                        <p>
                            {hayFiltros
                                ? 'No hay tallas que coincidan con los criterios de búsqueda.'
                                : 'Aún no existen tallas registradas en el sistema.'}
                        </p>

                    </div>

                </div>
            )}

            <div
                className={`page-workspace ${
                    mostrarFormulario ? 'form-open' : ''
                }`}
            >
                {!loading &&
                    !error &&
                    rendtallas.length > 0 && (

                        <div className="table-section">

                            <RendTallasTable

                                rendtallas={rendtallas}

                                onEdit={editarRendTalla}

                                onAdd={agregarRendTalla}

                                onDelete={solicitarEliminarRendTalla}

                            />

                        </div>

                    )}


                {mostrarFormulario && (

                    <aside className="form-section">

                        <RendTallaForm

                            rendtallas={rendtallas}

                            rendtalla={rendtallaSeleccionada}

                            onClose={cerrarFormulario}

                            onSubmit={guardarRendTalla}

                        />

                    </aside>

                )}

            </div>

            {rendtallaAEliminar && (

                <ConfirmModal

                    title="Eliminar rendimiento"

                    message={
                        `¿Está seguro de que desea eliminar el rendimiento ` +
                        `asociado a la talla "${rendtallaAEliminar.nombre}"? ` +
                        `Esta acción no se puede deshacer.`
                    }

                    onConfirm={confirmarEliminarRendimiento}

                    onCancel={() =>
                        setRendTallaAEliminar(null)
                    }

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

export default RendTallasPage;
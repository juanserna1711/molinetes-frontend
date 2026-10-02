/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Conecta la tabla, el formulario, la confirmación de borrado y los servicios de molinetes.

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
    consultarMolinetes,
    crearMolinete as crearMolineteService,
    actualizarMolinete as actualizarMolineteService,
    eliminarMolinete as eliminarMolineteService
} from '../services/molinetes.service';
import MolinetesTable from '../components/Molinete/MolinetesTable';
import MolineteForm from '../components/Molinete/MolineteForm';
import ConfirmModal from '../components/ConfirmModal';
import Snackbar from '../components/Snackbar';

function MolinetesPage() {

    const [molinetes, setMolinetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [molineteSeleccionado, setMolineteSeleccionado] = useState(null);// La selección enlaza la fila de la tabla con el formulario; null representa creación.
    const [molineteAEliminar, setMolineteAEliminar] = useState(null);// Retiene el registro hasta que el usuario confirme o cancele la eliminación.
    const [eliminando, setEliminando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});

    /*
      =========================================================
      FUNCIONES DE LA TABLA
      =========================================================
    */

    function solicitarEliminarMolinete(molinete) {
        setMolineteAEliminar(molinete);
    }

    function editarMolinete(molinete) {
        setMolineteSeleccionado(molinete);
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

        // Cada mensaje programa su cierre; la limpieza cancela el temporizador anterior.
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

    /*
      Interpreta texto numérico como código y el resto como nombre.
      La recarga después de una operación reutiliza estos criterios de búsqueda.
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

        cargarMolinetes(filtros);

    }, [busqueda]);

    // Consulta los registros y actualiza el listado y los mensajes de la página.
    async function cargarMolinetes(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarMolinetes(filtros);
            
            setMolinetes(resultado.data);

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || 'No fue posible cargar los molinetes.');

        } finally {

            setLoading(false);

        }
    }

    // Descarta la selección de edición al cerrar para que una nueva creación empiece sin ese registro.
    function cerrarFormulario() {

        setMostrarFormulario(false);
        setMolineteSeleccionado(null);

    }

    // Guarda los cambios del registro seleccionado y actualiza el listado.
    async function actualizarMolinete(molinete, data) {
        await actualizarMolineteService(molinete.codigo, data);

        cerrarFormulario();

        await cargarMolinetes(obtenerFiltros());
        mostrarSnackbar('Molinete actualizado correctamente.', 'success');
    }

    /*
      La selección actual decide entre crear y editar; después se recarga con los filtros vigentes.
      Los errores del servicio quedan disponibles para el formulario que espera esta promesa.
    */
    async function guardarMolinete(data) {
        if (molineteSeleccionado) {
            await actualizarMolinete(molineteSeleccionado, data);
        } else {
            await crearMolineteService(data);
            cerrarFormulario();
            await cargarMolinetes(obtenerFiltros());
            mostrarSnackbar('Molinete creado correctamente.', 'success');
        }
    }

    // Elimina el registro confirmado y comunica el resultado de la operación.
    async function confirmarEliminarMolinete() {

        if (!molineteAEliminar) return;

        try {

            setEliminando(true);
            await eliminarMolineteService(molineteAEliminar.codigo);
            await cargarMolinetes(obtenerFiltros());
            mostrarSnackbar('Molinete eliminado correctamente.', 'success');

        } catch (error) {

            console.error(error);

            mostrarSnackbar(error.response?.data?.message || 'No fue posible eliminar el molinete.', 'error');

        } finally {

            setEliminando(false);
            setMolineteAEliminar(null);

        }
    }
    
    const hayFiltros = busqueda.trim() !== '';

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">
                    <h1>Gestión de Molinetes</h1>

                    <p>Administración de molinetes y su información.</p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <AddIcon />
                    Nuevo Molinete
                </button>

            </div>

            <div className="filters">

                <div className="search-box">
                    <SearchOutlinedIcon />

                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={busqueda}
                        onChange={(event) => {setBusqueda(event.target.value);}}
                        maxLength={60}
                    />
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
                            <h2>Cargando molinetes</h2>
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
                            <h2>No fue posible cargar los molinetes</h2>

                            <p>{error}</p>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() => cargarMolinetes(obtenerFiltros())}
                            >
                                Reintentar
                            </button>
                        </div>

                    </div>
                )}

                {!loading && !error && molinetes.length === 0 && (
                    <div className="state-container empty-state">

                        <div className="state-icon empty-icon">
                            <SearchOffOutlinedIcon />
                        </div>

                        <div className="state-content">

                            <h2>
                                {hayFiltros ? 'No se encontraron molinetes' : 'No hay molinetes registrados'}
                            </h2>

                            <p>
                                {hayFiltros ? 'No hay molinetes que coincidan con los criterios de búsqueda.' : 'Aún no existen molinetes registrados en el sistema.'}
                            </p>

                        </div>

                    </div>
                )}

                {!loading && !error && molinetes.length > 0 && (
                    <div className="table-section">
                        <MolinetesTable
                            molinetes={molinetes}
                            onEdit={editarMolinete}
                            onDelete={solicitarEliminarMolinete}
                        />
                    </div>
                )}

                {mostrarFormulario && (
                    <aside className="form-section">
                        <MolineteForm
                            key={molineteSeleccionado ? `editar-${molineteSeleccionado.codigo}` : 'crear-molinete'}
                            molinete={molineteSeleccionado}
                            onClose={() => {setMostrarFormulario(false); setMolineteSeleccionado(null);}}
                            onSubmit={guardarMolinete}
                        />
                    </aside>
                )}

            </div>

            {molineteAEliminar && (
                <ConfirmModal
                    title="Eliminar molinete"
                    message={`¿Está seguro de que desea eliminar el molinete "${molineteAEliminar.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirm={confirmarEliminarMolinete}
                    onCancel={() => setMolineteAEliminar(null)}
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

export default MolinetesPage;
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

import MolinetesTable from '../components/MolinetesTable';
import MolineteForm from '../components/MolineteForm';

import ConfirmModal from '../components/ConfirmModal';

import Snackbar from '../components/Snackbar';

function MolinetesPage() {

    const [molinetes, setMolinetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [molineteSeleccionado, setMolineteSeleccionado] = useState(null);

    const [molineteAEliminar, setMolineteAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);


    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: '',
        type: 'success'
    });

    function solicitarEliminarMolinete(molinete) {
        setMolineteAEliminar(molinete);
    }

    function editarMolinete(molinete) {
        setMolineteSeleccionado(molinete);
        setMostrarFormulario(true);
    }

    function mostrarSnackbar(message, type = 'success') {
        setSnackbar({
            message,
            type
        });
    }

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

    useEffect(() => {
        cargarMolinetes();
    }, []);

    useEffect(() => {
        cargarMolinetes(obtenerFiltros());
    }, [busqueda]);


    async function cargarMolinetes(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarMolinetes(filtros);
            

            setMolinetes(resultado.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar los molinetes.'
            );

        } finally {

            setLoading(false);

        }
    }

    async function actualizarMolinete(molinete, data) {
        await actualizarMolineteService(molinete.codigo, data);

        setMostrarFormulario(false);
        setMolineteSeleccionado(null);

        await cargarMolinetes();
        mostrarSnackbar(
            'Molinete actualizado correctamente.',
            'success'
        );
    }

    async function guardarMolinete(data) {
        if (molineteSeleccionado) {
            await actualizarMolinete(molineteSeleccionado, data);
        } else {
            await crearMolineteService(data);

            setMostrarFormulario(false);
            await cargarMolinetes();
            mostrarSnackbar(
                'Molinete creado correctamente.',
                'success'
            );
        }
    }

    async function confirmarEliminarMolinete() {
            if (!molineteAEliminar) return;
    
            try {
                setEliminando(true);
    
                await eliminarMolineteService(molineteAEliminar.codigo);
                await cargarMolinetes();
    
                setMolineteAEliminar(null);
    
                mostrarSnackbar(
                    'Molinete eliminado correctamente.',
                    'success'
                );
            } catch (error) {
                console.error(error);
    
                mostrarSnackbar(
                    error.response?.data?.message ||
                    'No fue posible eliminar el molinete.',
                    'error'
                );
            } finally {
                setEliminando(false);
            }
        }
    

    const hayFiltros = busqueda.trim() !== '';


    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">
                    <h1>Gestión de Molinetes</h1>

                    <p>
                        Administración de molinetes y su información.
                    </p>
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
                        onChange={(event) => {
                            setBusqueda(event.target.value);
                        }}
                        maxLength={60}
                    />
                </div>

            </div>

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

                        <p>
                            {error}
                        </p>

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
                            {hayFiltros
                                ? 'No se encontraron molinetes'
                                : 'No hay molinetes registrados'}
                        </h2>

                        <p>
                            {hayFiltros
                                ? 'No hay molinetes que coincidan con los criterios de búsqueda.'
                                : 'Aún no existen molinetes registrados en el sistema.'}
                        </p>

                    </div>

                </div>
            )}

            <div className={`page-workspace ${mostrarFormulario ? 'form-open' : ''}`}>

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
                            molinete={molineteSeleccionado}
                            onClose={() => {
                                setMostrarFormulario(false);
                                setMolineteSeleccionado(null);
                            }}
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
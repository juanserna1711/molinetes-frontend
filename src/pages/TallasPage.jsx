import { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

import {
    consultarTallas,
    crearTalla as crearTallaService,
    actualizarTalla as actualizarTallaService,
    activarTalla as activarTallaService,
    desactivarTalla as desactivarTallaService,
    eliminarTalla as eliminarTallaService
} from '../services/tallas.service';

import TallasTable from '../components/TallasTable';
import TallaForm from '../components/TallaForm';

import ConfirmModal from '../components/ConfirmModal';
import Snackbar from '../components/Snackbar';

function TallasPage() {

    const [tallas, setTallas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('');
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

    const [tallaAEliminar, setTallaAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [operacion, setOperacion] = useState(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: '',
        type: 'success'
    });

    function solicitarEliminarTalla(talla) {
        setTallaAEliminar(talla);
    }

    function editarTalla(talla) {
        setTallaSeleccionada(talla);
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

        if (estado !== '') {
            filtros.estado = estado;
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
        cargarTallas();
    }, []);

    useEffect(() => {
        cargarTallas(obtenerFiltros());
    }, [busqueda, estado]);


    async function cargarTallas(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarTallas(filtros);
            

            setTallas(resultado.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar las tallas.'
            );

        } finally {

            setLoading(false);

        }
    }

    async function actualizarTalla(talla, data) {
        await actualizarTallaService(talla.codigo, data);

        setMostrarFormulario(false);
        setTallaSeleccionada(null);

        await cargarTallas();
        mostrarSnackbar(
            'Talla actualizada correctamente.',
            'success'
        );
    }

    async function guardarTalla(data) {
        if (tallaSeleccionada) {
            await actualizarTalla(tallaSeleccionada, data);
        } else {
            await crearTallaService(data);

            setMostrarFormulario(false);
            await cargarTallas();
            mostrarSnackbar(
                'Talla creada correctamente.',
                'success'
            );
        }
    }

    async function activarTalla(codigo) {
        try {
            setOperacion(`activar-${codigo}`);
            await activarTallaService(codigo);
            await cargarTallas();
                mostrarSnackbar(
                    'Talla activada correctamente.',
                    'success'
                );
        } catch (error) {
            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible activar la talla.',
                'error'
            );
        } finally {
        setOperacion(null);
    }
    }

    async function desactivarTalla(codigo) {
        try {
            setOperacion(`desactivar-${codigo}`);

            await desactivarTallaService(codigo);
            await cargarTallas();

            mostrarSnackbar(
                'Talla desactivada correctamente.',
                'success'
            );
        } catch (error) {
            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible desactivar la talla.',
                'error'
            );
        } finally {
            setOperacion(null);
        }
    }

    async function confirmarEliminarTalla() {
        if (!tallaAEliminar) return;

        try {
            setEliminando(true);

            await eliminarTallaService(tallaAEliminar.codigo);
            await cargarTallas();

            mostrarSnackbar(
                'Talla eliminada correctamente.',
                'success'
            );
        } catch (error) {
            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible eliminar la talla.',
                'error'
            );
        } finally {
            setEliminando(false);
            setTallaAEliminar(null);
        }
    }
    

    const hayFiltros = busqueda.trim() !== '' || estado !== '';


    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">
                    <h1>Gestión de Tallas</h1>

                    <p>
                        Administración de tallas y estado operativo.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <AddIcon />
                    Nueva Talla
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

                <select
                    value={estado}
                    onChange={(event) => {
                        setEstado(event.target.value);
                    }}
                >
                    <option value="">Todos los estados</option>
                    <option value="A">Activos</option>
                    <option value="I">Inactivos</option>
                </select>

            </div>

            {loading && (
                <div className="state-container loading-state">
                    <CircularProgress
                        size={30}
                        thickness={4}
                    />

                    <div className="state-content">
                        <h2>Cargando tallas</h2>
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
                        <h2>No fue posible cargar las tallas</h2>

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

            {!loading && !error && tallas.length === 0 && (
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

            <div className={`page-workspace ${mostrarFormulario ? 'form-open' : ''}`}>

                {!loading && !error && tallas.length > 0 && (
                    <div className="table-section">
                        <TallasTable
                            tallas={tallas}
                            onEdit={editarTalla}
                            onActivate={activarTalla}
                            onDeactivate={desactivarTalla}
                            onDelete={solicitarEliminarTalla}
                            operation={operacion}
                        />
                    </div>
                )}

                {mostrarFormulario && (
                    <aside className="form-section">
                        <TallaForm
                            talla={tallaSeleccionada}
                            onClose={() => {
                                setMostrarFormulario(false);
                                setTallaSeleccionada(null);
                            }}
                            onSubmit={guardarTalla}
                        />
                    </aside>
                )}

            </div>

            {tallaAEliminar && (
                <ConfirmModal
                    title="Eliminar talla"
                    message={`¿Está seguro de que desea eliminar la talla "${tallaAEliminar.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirm={confirmarEliminarTalla}
                    onCancel={() => setTallaAEliminar(null)}
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

export default TallasPage;
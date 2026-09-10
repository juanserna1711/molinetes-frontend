import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

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

import Snackbar from '../components/Snackbar';
import ConfirmModal from '../components/ConfirmModal';

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

    function cerrarSnackbar() {
        setSnackbar({
            message: '',
            type: 'success'
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

    useEffect(() => {
        cargarTallas();
    }, []);

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

        if (estado !== '') {
            filtros.estado = estado;
        }

        cargarTallas(filtros);

    }, [busqueda, estado]);


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

            setTallaAEliminar(null);

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
        }
    }


    return (

        <section className="tallas-page">

            <div className="page-header">

                <h1>
                    Gestión de Tallas y Rendimiento
                </h1>

                <button
                    className="primary-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <Plus size={18} />
                    Nueva Talla
                </button>

            </div>

            <div className="filters">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={busqueda}
                        onChange={(event) => {
                            setBusqueda(event.target.value);
                        }}
                    />

                </div>

                <select
                    value={estado}
                    onChange={(event) => {
                        setEstado(event.target.value);
                    }}
                >
                    <option value="">
                        Todos
                    </option>

                    <option value="A">
                        Activo
                    </option>

                    <option value="I">
                        Inactivo
                    </option>

                </select>

            </div>

            {loading && (
                <div className="message">
                    Cargando tallas...
                </div>
            )}

            {error && (
                <div className="message error">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <TallasTable
                    tallas={tallas}
                    onEdit={editarTalla}
                    onActivate={activarTalla}
                    onDeactivate={desactivarTalla}
                    onDelete={solicitarEliminarTalla}
                    operation={operacion}
                />
            )}

            {mostrarFormulario && (
                <TallaForm
                    talla={tallaSeleccionada}
                    onClose={() => {
                        setMostrarFormulario(false);
                        setTallaSeleccionada(null);
                    }}
                    onSubmit={guardarTalla}
                />
            )}

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
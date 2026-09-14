import { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

import {
    consultarUsuarios,
    crearUsuario as crearUsuarioService,
    actualizarUsuario as actualizarUsuarioService,
    activarUsuario as activarUsuarioService,
    desactivarUsuario as desactivarUsuarioService,
    eliminarUsuario as eliminarUsuarioService
} from '../services/usuarios.service';

import UsuariosTable from '../components/UsuariosTable';
import UsuarioForm from '../components/UsuarioForm';

import ConfirmModal from '../components/ConfirmModal';

import Snackbar from '../components/Snackbar';

function UsuariosPage() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [estado, setEstado] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const [operacion, setOperacion] = useState(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: '',
        type: 'success'
    });

    function solicitarEliminarUsuario(usuario) {
        setUsuarioAEliminar(usuario);
    }

    function editarUsuario(usuario) {
        setUsuarioSeleccionado(usuario);
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
        cargarUsuarios();
    }, []);

    useEffect(() => {
        cargarUsuarios(obtenerFiltros());
    }, [busqueda, estado]);


    async function cargarUsuarios(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarUsuarios(filtros);
            

            setUsuarios(resultado.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar los usuarios.'
            );

        } finally {

            setLoading(false);

        }
    }

    async function actualizarUsuario(usuario, data) {
        await actualizarUsuarioService(usuario.codigo, data);

        setMostrarFormulario(false);
        setUsuarioSeleccionado(null);

        await cargarUsuarios();
        mostrarSnackbar(
            'Usuario actualizado correctamente.',
            'success'
        );
    }

    async function guardarUsuario(data) {
        if (usuarioSeleccionado) {
            await actualizarUsuario(usuarioSeleccionado, data);
        } else {
            await crearUsuarioService(data);

            setMostrarFormulario(false);
            await cargarUsuarios();
            mostrarSnackbar(
                'Usuario creado correctamente.',
                'success'
            );
        }
    }

    async function activarUsuario(codigo) {
        try {
            setOperacion(`activar-${codigo}`);
            await activarUsuarioService(codigo);
            await cargarUsuarios();
                mostrarSnackbar(
                    'Usuario activado correctamente.',
                    'success'
                );
        } catch (error) {
            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible activar el usuario.',
                'error'
            );
        } finally {
        setOperacion(null);
    }
    }

    async function desactivarUsuario(codigo) {
        try {
            setOperacion(`desactivar-${codigo}`);

            await desactivarUsuarioService(codigo);
            await cargarUsuarios();

            mostrarSnackbar(
                'Usuario desactivado correctamente.',
                'success'
            );
        } catch (error) {
            console.error(error);

            mostrarSnackbar(
                error.response?.data?.message ||
                'No fue posible desactivar el usuario.',
                'error'
            );
        } finally {
            setOperacion(null);
        }
    }

    async function confirmarEliminarUsuario() {
            if (!usuarioAEliminar) return;
    
            try {
                setEliminando(true);
    
                await eliminarUsuarioService(usuarioAEliminar.codigo);
                await cargarUsuarios();
    
                setUsuarioAEliminar(null);
    
                mostrarSnackbar(
                    'Usuario eliminado correctamente.',
                    'success'
                );
            } catch (error) {
                console.error(error);
    
                mostrarSnackbar(
                    error.response?.data?.message ||
                    'No fue posible eliminar el usuario.',
                    'error'
                );
            } finally {
                setEliminando(false);
            }
        }
    

    const hayFiltros = busqueda.trim() !== '' || estado !== '';


    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">
                    <h1>Gestión de Usuarios</h1>

                    <p>
                        Administración de usuarios y estado operativo.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <AddIcon />
                    Nuevo Usuario
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
                        <h2>Cargando usuarios</h2>
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
                        <h2>No fue posible cargar los usuarios</h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarUsuarios(obtenerFiltros())}
                        >
                            Reintentar
                        </button>
                    </div>

                </div>
            )}

            {!loading && !error && usuarios.length === 0 && (
                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">
                        <SearchOffOutlinedIcon />
                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros
                                ? 'No se encontraron usuarios'
                                : 'No hay usuarios registrados'}
                        </h2>

                        <p>
                            {hayFiltros
                                ? 'No hay usuarios que coincidan con los criterios de búsqueda.'
                                : 'Aún no existen usuarios registrados en el sistema.'}
                        </p>

                    </div>

                </div>
            )}

            <div className={`page-workspace ${mostrarFormulario ? 'form-open' : ''}`}>

                {!loading && !error && usuarios.length > 0 && (
                    <div className="table-section">
                        <UsuariosTable
                            usuarios={usuarios}
                            onEdit={editarUsuario}
                            onActivate={activarUsuario}
                            onDeactivate={desactivarUsuario}
                            onDelete={solicitarEliminarUsuario}
                            operation={operacion}
                        />
                    </div>
                )}

                {mostrarFormulario && (
                    <aside className="form-section">
                        <UsuarioForm
                            usuario={usuarioSeleccionado}
                            onClose={() => {
                                setMostrarFormulario(false);
                                setUsuarioSeleccionado(null);
                            }}
                            onSubmit={guardarUsuario}
                        />
                    </aside>
                )}

            </div>

            {usuarioAEliminar && (
                <ConfirmModal
                    title="Eliminar usuario"
                    message={`¿Está seguro de que desea eliminar el usuario "${usuarioAEliminar.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirm={confirmarEliminarUsuario}
                    onCancel={() => setUsuarioAEliminar(null)}
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

export default UsuariosPage;
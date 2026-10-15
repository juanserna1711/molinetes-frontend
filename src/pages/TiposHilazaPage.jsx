/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Conecta la tabla, el formulario, la confirmación de borrado y los servicios
  de tipos de hilaza.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import { usePermisos } from '../hooks/usePermisos';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import {
    consultarTiposHilaza,
    crearTipoHilaza as crearTipoHilazaService,
    actualizarTipoHilaza as actualizarTipoHilazaService
} from '../services/tipohilaza.service';
import TiposHilazaTable from '../components/TipoHilaza/TiposHilazaTable';
import TipoHilazaForm from '../components/TipoHilaza/TipoHilazaForm';
import Snackbar from '../components/Snackbar';


function TiposHilazaPage() {

    const [tiposHilaza, setTiposHilaza] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [tipoHilazaSeleccionado, setTipoHilazaSeleccionado] = useState(null);// La selección enlaza la fila de la tabla con el formulario; null representa creación.
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});
    const permisos = usePermisos(4);

    /*
      =========================================================
      FUNCIONES DE LA TABLA
      =========================================================
    */

    function editarTipoHilaza(tipoHilaza) {
        if (!permisos.actualiza){
            return;
        }
        setTipoHilazaSeleccionado(tipoHilaza);
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

    // Prepara los filtros para la consulta.
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

        cargarTiposHilaza(filtros);

    }, [busqueda]);

    // Consulta los registros y actualiza el listado y los mensajes de la página.
    async function cargarTiposHilaza(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarTiposHilaza(filtros);

            setTiposHilaza(resultado.data);

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || 'No fue posible cargar los tipos de hilaza.');

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
        setTipoHilazaSeleccionado(null);

    }

    // Guarda los cambios del registro seleccionado y actualiza el listado.
    async function actualizarTipoHilaza(tipoHilaza, data) {
        await actualizarTipoHilazaService(tipoHilaza.codigo, data);

        cerrarFormulario();

        await cargarTiposHilaza(obtenerFiltros());
        mostrarSnackbar('Tipo de hilaza actualizado correctamente.', 'success');
    }


    //Crea o actualiza el registro y recarga el listado al completar la operación.
    async function guardarTipoHilaza(data) {
        if (tipoHilazaSeleccionado) {
            if (!permisos.actualiza){
                return;
            }
            await actualizarTipoHilaza(tipoHilazaSeleccionado, data);
        } else {
            if (!permisos.insercion){
                return;
            }
            await crearTipoHilazaService(data);

            cerrarFormulario();

            await cargarTiposHilaza(obtenerFiltros());
            mostrarSnackbar('Tipo de hilaza creado correctamente.', 'success');
        }
    }

    const hayFiltros = busqueda.trim() !== '';

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>Gestión de Tipos de Hilaza</h1>

                    <p>Administración de los tipos de hilaza utilizados en el sistema.</p>

                </div>

                {permisos.insercion && (
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <AddIcon />

                    Nuevo Tipo de Hilaza
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
                        <h2>Cargando tipos de hilaza</h2>
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
                        <h2>No fue posible cargar los tipos de hilaza</h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarTiposHilaza(obtenerFiltros())}
                        >
                            Reintentar
                        </button>
                    </div>

                </div>
            )}

            {!loading && !error && tiposHilaza.length === 0 && (
                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">
                        <SearchOffOutlinedIcon />
                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros ? 'No se encontraron tipos de hilaza' : 'No hay tipos de hilaza registrados'}
                        </h2>

                        <p>
                            {hayFiltros ? 'No hay tipos de hilaza que coincidan con los criterios de búsqueda.' : 'Aún no existen tipos de hilaza registrados en el sistema.'}
                        </p>

                    </div>

                </div>
            )}

                {!loading && !error && tiposHilaza.length > 0 && (
                    <div className="table-section">
                        <TiposHilazaTable
                            tiposHilaza={tiposHilaza}
                            onEdit={editarTipoHilaza}
                            puedeActualizar={permisos.actualiza}
                        />
                    </div>
                )}

                {mostrarFormulario && (
                    <aside className="form-section">
                        <TipoHilazaForm
                            key={tipoHilazaSeleccionado ? `editar-${tipoHilazaSeleccionado.codigo}` : 'crear-tipoHilaza'}
                            tipoHilaza={tipoHilazaSeleccionado}
                            onClose={cerrarFormulario}
                            onSubmit={guardarTipoHilaza}
                        />
                    </aside>
                )}

            </div>

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
            />

        </section>
    );
}

export default TiposHilazaPage;
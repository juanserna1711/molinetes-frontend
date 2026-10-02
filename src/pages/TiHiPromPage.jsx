/*=============================================================================
  Nombre responsabilidad: Coordinar la gestión de promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Conecta la tabla, el formulario, los filtros, la confirmación de borrado
  y los servicios de promedios por tipo de hilaza.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import {
    consultarTiHiProm,
    crearTiHiProm as crearTiHiPromService,
    actualizarTiHiProm as actualizarTiHiPromService,
    eliminarTiHiProm as eliminarTiHiPromService
} from '../services/tihiprom.service';
import {consultarTiposHilaza} from '../services/tipohilaza.service';
import {consultarTallas} from '../services/tallas.service';
import TiHiPromTable from '../components/TiHiprom/TiHiPromTable';
import TiHiPromForm from '../components/TiHiprom/TiHiPromForm';
import Snackbar from '../components/Snackbar';
import ConfirmModal from '../components/ConfirmModal';

function TiHiPromPage() {

    const [tihiprom, setTiHiProm] = useState([]);
    const [tiposHilaza, setTiposHilaza] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipoHilazaFiltro, setTipoHilazaFiltro] = useState('');
    const [tallaFiltro, setTallaFiltro] = useState('');
    const [tihipromSeleccionado, setTiHiPromSeleccionado] = useState(null); // null abre creación; un registro inicializa edición.
    const [tihipromAEliminar, setTiHiPromAEliminar] = useState(null); // Conserva la pareja hilaza-talla pendiente de confirmar.
    const [eliminando, setEliminando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});

    /*
      =========================================================
      FUNCIONES DE LA TABLA
      =========================================================
    */

    // La tabla entrega el registro; el formulario hijo recibe la selección y delega el guardado en esta página.
    function editarTiHiProm(registro) {
        setTiHiPromSeleccionado(registro);
        setMostrarFormulario(true);
    }

    function solicitarEliminarTiHiProm(registro) {
        setTiHiPromAEliminar(registro);
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

        // Reemplaza el temporizador al cambiar el mensaje y lo cancela al desmontar el componente.
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
      Omite selecciones vacías y convierte los códigos para las recargas
      posteriores al guardado, borrado o reintento.
    */
    function obtenerFiltros() {

        const filtros = {};

        if (tipoHilazaFiltro !== '') {
            filtros.tipoHilaza = Number(tipoHilazaFiltro);
        }

        if (tallaFiltro !== '') {
            filtros.talla = Number(tallaFiltro);
        }

        return filtros;

    }

    /*
      =========================================================
      CARGAR CATÁLOGOS
      =========================================================
    */

    useEffect(() => {

        async function cargarCatalogosIniciales() {

            try {

                const [respuestaTiposHilaza, respuestaTallas] = await Promise.all([
                    consultarTiposHilaza(), consultarTallas({estado: 'A'})
                ]);

                setTiposHilaza(respuestaTiposHilaza.data);

                // RIB se excluye de las asociaciones editables de TIHIPROM; solo se ofrecen tallas activas.
                setTallas(respuestaTallas.data.filter(talla => talla.nombre.trim().toUpperCase() !== 'RIB'));

            } catch (error) {

                console.error(error);

                setSnackbar({message:'No fue posible cargar los tipos de hilaza y tallas.', type: 'error'});

            }

        }

        cargarCatalogosIniciales();

    }, []);

    /*
      =========================================================
      BÚSQUEDA AUTOMÁTICA
      =========================================================
    */
    useEffect(() => {

        const filtros = {};


        if (tipoHilazaFiltro !== '') {

            filtros.tipoHilaza = tipoHilazaFiltro;

        }


        if (tallaFiltro !== '') {

            filtros.talla = tallaFiltro;

        }


        // La búsqueda automática usa los valores actuales de los selectores sin esperar un botón de consulta.
        cargarTiHiProm(filtros);

    }, [tipoHilazaFiltro, tallaFiltro]);

    // Consulta los registros y actualiza el listado y los mensajes de la página.
    async function cargarTiHiProm(filtros = {}) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarTiHiProm(filtros);

            setTiHiProm(resultado.data);

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || 'No fue posible cargar los promedios por tipo de hilaza.');

        } finally {

            setLoading(false);

        }

    }

    /*
      =========================================================
      FORMULARIO
      =========================================================
    */

    // Limpia la selección para que la siguiente apertura de creación no reutilice el registro editado.
    function cerrarFormulario() {

        setMostrarFormulario(false);
        setTiHiPromSeleccionado(null);

    }

    /*
      El modo enviado por el formulario decide crear o actualizar la pareja hilaza-talla.
      Tras guardar, cierra el panel y recarga respetando los filtros actuales.
    */
    async function guardarTiHiProm(data, modo) {

        try {

            if (modo === 'editar') {

                await actualizarTiHiPromService(data.codTipoHilaza, data.codTalla, data);

                mostrarSnackbar('Promedio por tipo de hilaza actualizado correctamente.', 'success');

            } else {

                await crearTiHiPromService(data);

                mostrarSnackbar('Promedio por tipo de hilaza creado correctamente.', 'success');

            }

            cerrarFormulario();

            await cargarTiHiProm(obtenerFiltros());

        } catch (error) {

            console.error(error);

            // Se relanza para que el formulario pueda mostrar los errores recibidos por campo o de negocio.
            throw error;

        }

    }

    /*
      =========================================================
      ELIMINAR
      =========================================================
    */

    // Elimina el registro confirmado y comunica el resultado de la operación.
    async function confirmarEliminarTiHiProm() {

        if (!tihipromAEliminar) {
            return;
        }

        try {

            setEliminando(true);
            await eliminarTiHiPromService(tihipromAEliminar.codigoTipoHilaza, tihipromAEliminar.codigoTalla);
            await cargarTiHiProm(obtenerFiltros());
            mostrarSnackbar('Promedio por tipo de hilaza eliminado correctamente.', 'success');

        } catch (error) {

            console.error(error);

            mostrarSnackbar(error.response?.data?.message || 'No fue posible eliminar el promedio por tipo de hilaza.', 'error');

        } finally {

            setEliminando(false);
            setTiHiPromAEliminar(null);

        }

    }

    // Distingue una búsqueda sin coincidencias de un catálogo sin registros en el estado vacío.
    const hayFiltros = tipoHilazaFiltro !== '' || tallaFiltro !== '';

    return (

        <section className="page">

            {/* =================================================
                CABECERA
                ================================================= */}

            <div className="page-header">

                <div className="page-header-info">

                    <h1>Promedios por Tipo de Hilaza</h1>

                    <p>Administración de peso, ancho y promedio asociados a cada tipo de hilaza y talla.</p>

                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {setTiHiPromSeleccionado(null); setMostrarFormulario(true);}}
                >

                    <AddIcon />

                    Nuevo Promedio

                </button>

            </div>

            {/* =================================================
                FILTROS
                ================================================= */}

            <div className="filters">

            <div className="filter-field">
            <select
                className="filter-select filter-select-hilaza"
                value={tipoHilazaFiltro}
                onChange={(event) => setTipoHilazaFiltro(event.target.value)}
            >

                <option value="">
                    Todos los tipos de hilaza
                </option>

                {tiposHilaza.map((tipoHilaza) => (

                    <option
                        key={tipoHilaza.codigo}
                        value={tipoHilaza.codigo}
                    >
                        {tipoHilaza.nombre}
                    </option>

                ))}

            </select>
            </div>

            <div className="filter-field">
            <select
                className="filter-select filter-select-talla"
                value={tallaFiltro}
                onChange={(event) => setTallaFiltro(event.target.value)}
            >

                <option value="">
                    Todas las tallas
                </option>

                {tallas.map((talla) => (

                    <option
                        key={talla.codigo}
                        value={talla.codigo}
                    >
                        {talla.nombre}
                    </option>

                ))}

            </select>
            </div>

        </div>

            {/* =================================================
                ÁREA DE TRABAJO
                ================================================= */}

            <div
                className={`page-workspace ${mostrarFormulario ? 'form-open' : ''}`}
            >
                
            {/* =================================================
                LOADING
                ================================================= */}

            {loading && (

                <div className="state-container loading-state">

                    <CircularProgress
                        size={30}
                        thickness={4}
                    />

                    <div className="state-content">

                        <h2>Cargando promedios</h2>

                        <p>Consultando la información...</p>

                    </div>

                </div>

            )}

            {/* =================================================
                ERROR
                ================================================= */}

            {!loading && error && (

                <div className="state-container error-state">

                    <div className="state-icon error-icon">

                        <ErrorOutlineOutlinedIcon />

                    </div>

                    <div className="state-content">

                        <h2>No fue posible cargar los promedios</h2>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarTiHiProm(obtenerFiltros())}
                        >
                            Reintentar
                        </button>

                    </div>

                </div>

            )}

            {/* =================================================
                SIN REGISTROS
                ================================================= */}

            {!loading && !error && tihiprom.length === 0 && (

                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">

                        <SearchOffOutlinedIcon />

                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros ? 'No se encontraron promedios' : 'No hay promedios registrados'}
                        </h2>

                        <p>
                            {hayFiltros ? 'No hay registros que coincidan con los filtros seleccionados.' : 'Aún no existen promedios por tipo de hilaza registrados en el sistema.'}
                        </p>

                    </div>

                </div>

            )}

                {!loading && !error && tihiprom.length > 0 && (

                    <div className="table-section">

                        <TiHiPromTable
                            tihiprom={tihiprom}
                            onEdit={editarTiHiProm}
                            onDelete={solicitarEliminarTiHiProm}
                        />

                    </div>

                )}

                {mostrarFormulario && (

                    <aside className="form-section">

                        <TiHiPromForm
                            key={tihipromSeleccionado ? `editar-${tihipromSeleccionado.codigoTipoHilaza}-${tihipromSeleccionado.codigoTalla}` : 'crear-tihiprom'}
                            tiposHilaza={tiposHilaza}
                            tallas={tallas}
                            tihiprom={tihipromSeleccionado}
                            onClose={cerrarFormulario}
                            onSubmit={guardarTiHiProm}
                        />

                    </aside>

                )}

            </div>

            {/* =================================================
                CONFIRMACIÓN DE ELIMINACIÓN
                ================================================= */}

            {tihipromAEliminar && (

                <ConfirmModal
                    title="Eliminar promedio"
                    message={
                        `¿Está seguro de que desea eliminar la información ` +
                        `del tipo de hilaza "${tihipromAEliminar.nombreTipoHilaza}" ` +
                        `asociada a la talla "${tihipromAEliminar.nombreTalla}"? ` +
                        `Esta acción no se puede deshacer.`
                    }
                    onConfirm={confirmarEliminarTiHiProm}
                    onCancel={() => setTiHiPromAEliminar(null)}
                    loading={eliminando}
                />

            )}

            {/* =================================================
                SNACKBAR
                ================================================= */}

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
            />

        </section>

    );

}

export default TiHiPromPage;
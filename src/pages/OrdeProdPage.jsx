/*=============================================================================
  Nombre responsabilidad: Consultar las órdenes de trabajo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Coordina filtros, paginación y consulta de órdenes
  de trabajo almacenadas en ORDEPROD.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useRef, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import {consultarOrdeProd, consultarDetalleOrdeProd} from '../services/ordeprod.service.js';
import {consultarTiposHilaza} from '../services/tipohilaza.service.js';
import OrdeProdTable from '../components/OrdeProd/OrdeProdTable.jsx';
import {generarOrdenTrabajoPdf} from '../utils/generarOrdenTrabajoPdf.js';
import logoMoliplus from '../assets/logo-moliplus.png';
import logoTextiles from '../assets/logo-textiles-pacifico.png';


// Ajusta el desfase local antes de extraer YYYY-MM-DD para el filtro inicial de fecha.
const obtenerFechaHoy = () => {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset();
    const fechaLocal = new Date(hoy.getTime() - (offset * 60 * 1000));
    return fechaLocal.toISOString().split('T')[0];
};

function OrdeProdPage() {

    const hoy = obtenerFechaHoy();
    const [ordenes, setOrdenes] = useState([]);
    const [tiposHilaza, setTiposHilaza] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ordenFiltro, setOrdenFiltro] = useState('');
    const [tipoHilazaFiltro, setTipoHilazaFiltro] = useState('');
    const [fechaInicio, setFechaInicio] = useState(hoy);
    const [fechaFin, setFechaFin] = useState('');
    const [pagina, setPagina] = useState(1);
    const registrosPagina = 10;
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [imprimiendoOrden, setImprimiendoOrden] = useState(null); // Identifica la fila cuyo PDF está en preparación.

    // Carga los tipos de hilaza disponibles para el filtro.
    useEffect(() => {

        async function cargarTiposHilaza() {

            try {

                const resultado = await consultarTiposHilaza();

                setTiposHilaza(resultado.data || resultado);

            } catch (error) {

                console.error(error);

            }

        }

        cargarTiposHilaza();

    }, []);

    // Prepara los filtros utilizados por la consulta.
    function obtenerFiltros() {

        const filtros = {};

        if (ordenFiltro !== '') {
            filtros.orden = ordenFiltro;
        }

        if (tipoHilazaFiltro !== '') {
            filtros.tipoHilaza = tipoHilazaFiltro;
        }

        if (fechaInicio !== '') {
            filtros.fechaInicio = fechaInicio;
        }

        if (fechaFin !== '') {
            filtros.fechaFin = fechaFin;
        }

        filtros.pagina = pagina;
        filtros.registrosPagina = registrosPagina;

        return filtros;

    }

    // Las referencias permiten distinguir un cambio de filtros de un avance de página sin otro render.
    const ordenAnterior = useRef(ordenFiltro);
    const tipoHilazaAnterior = useRef(tipoHilazaFiltro);
    const fechaInicioAnterior = useRef(fechaInicio);
    const fechaFinAnterior = useRef(fechaFin);

    //Si cambia un filtro fuera de la primera página, actualiza las referencias y vuelve a página 1.
    //El retorno evita consultar con la página anterior; el siguiente efecto carga la nueva búsqueda.
    useEffect(() => {

        const filtrosCambiaron = ordenAnterior.current !== ordenFiltro || tipoHilazaAnterior.current !== tipoHilazaFiltro || fechaInicioAnterior.current !== fechaInicio || fechaFinAnterior.current !== fechaFin;

        if (filtrosCambiaron && pagina !== 1) {

            ordenAnterior.current = ordenFiltro;
            tipoHilazaAnterior.current = tipoHilazaFiltro;
            fechaInicioAnterior.current = fechaInicio;
            fechaFinAnterior.current = fechaFin;

            setPagina(1);

            return;

        }

        ordenAnterior.current = ordenFiltro;
        tipoHilazaAnterior.current = tipoHilazaFiltro;
        fechaInicioAnterior.current = fechaInicio;
        fechaFinAnterior.current = fechaFin;

        const filtros = {};

        if (ordenFiltro !== '') {

            filtros.orden = ordenFiltro;

        }

        if (tipoHilazaFiltro !== '') {

            filtros.tipoHilaza = tipoHilazaFiltro;

        }

        if (fechaInicio !== '') {

            filtros.fechaInicio = fechaInicio;

        }

        if (fechaFin !== '') {

            filtros.fechaFin = fechaFin;

        }

        filtros.pagina = pagina;
        filtros.registrosPagina = registrosPagina;

        async function consultarOrdenes() {

            try {

                setLoading(true);
                setError(null);

                const resultado = await consultarOrdeProd(filtros);

                setOrdenes(resultado.data);
                setTotalRegistros(resultado.totalRegistros);

            } catch (error) {

                console.error(error);

                setError(error.response?.data?.message || 'No fue posible cargar las órdenes de trabajo.');

            } finally {

                setLoading(false);

            }

        }

        consultarOrdenes();

    }, [ordenFiltro, tipoHilazaFiltro, fechaInicio, fechaFin, pagina]);

    //Reintenta la consulta con filtros y página actuales, conservando por separado las filas visibles y el total de registros que calcula el servidor.
    async function cargarOrdenes(
        filtros = obtenerFiltros()
    ) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarOrdeProd(filtros);

            setOrdenes(resultado.data);
            setTotalRegistros(resultado.totalRegistros);

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message ||'No fue posible cargar las órdenes de trabajo.');

        } finally {

            setLoading(false);

        }

    }

    // Obtiene el detalle persistido de la fila seleccionada y lo entrega al generador de PDF.
    // La tabla recibe imprimiendoOrden para representar la operación en curso.
    async function manejarDetalle(registro) {

        try {

            setImprimiendoOrden(registro.codigoOrden);

            const resultado = await consultarDetalleOrdeProd(registro.codigoOrden);

            await generarOrdenTrabajoPdf(
                resultado.data,
                {logoMoliplus, logoTextiles}
            );

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || 'No fue posible consultar la Orden de Trabajo.');

        } finally {

            setImprimiendoOrden(null);

        }

    }

    const hayFiltros = ordenFiltro !== '' || tipoHilazaFiltro !== '' || fechaInicio !== '' || fechaFin !== '';
    // El total del servidor, no el número de filas visibles, determina los controles de paginación.
    const totalPaginas = Math.ceil(totalRegistros /registrosPagina);

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>Órdenes de Trabajo</h1>

                    <p>Consulte las órdenes generadas y vuelva a imprimir su detalle.</p>

                </div>

            </div>

            <div className="filters">

                <div className="filter-field filter-field-small">

                    <label htmlFor="orden">
                        Orden
                    </label>

                    <input
                        id="orden"
                        type="number"
                        min="1"
                        value={ordenFiltro}
                        onChange={(event) => setOrdenFiltro(event.target.value)}
                        placeholder="Número de orden"
                    />

                </div>

                <div className="filter-field filter-field-medium">

                    <label htmlFor="tipo-hilaza">
                        Tipo de hilaza
                    </label>

                    <select
                        id="tipo-hilaza"
                        value={tipoHilazaFiltro}
                        onChange={(event) => setTipoHilazaFiltro(event.target.value)}
                    >

                        <option value="">
                            Todos
                        </option>

                        {tiposHilaza.map((tipo) => (

                            <option
                                key={tipo.codigo}
                                value={tipo.codigo}
                            >
                                {tipo.nombre}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="filter-field">

                    <label htmlFor="fecha-inicio">
                        Fecha inicio
                    </label>

                    <input
                        id="fecha-inicio"
                        type="date"
                        value={fechaInicio}
                        max={fechaFin || undefined}
                        onChange={(event) => setFechaInicio(event.target.value)}
                    />

                </div>

                <div className="filter-field">

                    <label htmlFor="fecha-fin">
                        Fecha fin
                    </label>

                    <input
                        id="fecha-fin"
                        type="date"
                        value={fechaFin}
                        min={fechaInicio || undefined}
                        onChange={(event) => setFechaFin(event.target.value)}
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

                        <h2>Cargando órdenes de trabajo</h2>

                        <p>Consultando las órdenes de trabajo...</p>

                    </div>

                </div>

            )}

            {!loading && error && (

                <div className="state-container error-state">

                    <div className="state-icon error-icon">

                        <ErrorOutlineOutlinedIcon />

                    </div>

                    <div className="state-content">

                        <h2>No fue posible cargar las órdenes de trabajo</h2>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>cargarOrdenes()}
                        >
                            Reintentar
                        </button>

                    </div>

                </div>

            )}

            {!loading && !error && ordenes.length === 0 && (

                    <div className="state-container empty-state">

                        <div className="state-icon empty-icon">

                            <SearchOffOutlinedIcon />

                        </div>

                        <div className="state-content">

                            <h2>{hayFiltros ? 'No se encontraron órdenes' : 'No hay órdenes de trabajo'}</h2>

                            <p>{hayFiltros ? 'No hay órdenes que coincidan con los criterios de búsqueda.' : 'Aún no existen órdenes de trabajo registradas.'}</p>

                        </div>

                    </div>

                )}

            {!loading && !error && ordenes.length > 0 && (

                    <div className="table-section">

                        <OrdeProdTable
                            ordenes={ordenes}
                            imprimiendoOrden={imprimiendoOrden}
                            onDetalle={manejarDetalle}
                        />

                    </div>

                )}

            {!loading && !error && ordenes.length > 0 && totalPaginas > 1 && (

                    <div className="pagination">

                        <span className="pagination-info">
                            Página {pagina} de {totalPaginas}
                        </span>

                        <div className="pagination-controls">

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={pagina === 1}
                                onClick={() => setPagina((actual) => actual - 1)}
                                title="Página anterior"
                                aria-label="Página anterior"
                            >
                                <ChevronLeftOutlinedIcon />
                            </button>

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={pagina === totalPaginas}
                                onClick={() => setPagina((actual) => actual + 1)}
                                title="Página siguiente"
                                aria-label="Página siguiente"
                            >
                                <ChevronRightOutlinedIcon />
                            </button>

                        </div>

                    </div>

                )}

        </section>

    );

}

export default OrdeProdPage;
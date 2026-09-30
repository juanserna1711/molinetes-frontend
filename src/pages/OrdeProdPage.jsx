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
import {
    consultarOrdeProd,
    consultarDetalleOrdeProd
} from '../services/ordeprod.service.js';
import {consultarTiposHilaza} from '../services/tipohilaza.service.js';
import OrdeProdTable from '../components/OrdeProd/OrdeProdTable.jsx';
import {generarOrdenTrabajoPdf} from '../utils/generarOrdenTrabajoPdf.js';
import logoMoliplus from '../assets/logo-moliplus.png';
import logoTextiles from '../assets/logo-textiles-pacifico.png';


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
    const [imprimiendoOrden, setImprimiendoOrden] = useState(null);

    /*
      Carga los tipos de hilaza disponibles para el filtro.
    */
    useEffect(() => {

        async function cargarTiposHilaza() {

            try {

                const resultado = await consultarTiposHilaza();

                setTiposHilaza(
                    resultado.data || resultado
                );

            } catch (error) {

                console.error(error);

            }

        }

        cargarTiposHilaza();

    }, []);

    /*
      Prepara los filtros utilizados por la consulta.
    */
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

    const ordenAnterior = useRef(ordenFiltro);
    const tipoHilazaAnterior = useRef(tipoHilazaFiltro);
    const fechaInicioAnterior = useRef(fechaInicio);
    const fechaFinAnterior = useRef(fechaFin);

    /*
      Reinicia la paginación cuando cambia un filtro y consulta nuevamente las órdenes.
    */
    useEffect(() => {

        const filtrosCambiaron =
            ordenAnterior.current !== ordenFiltro ||
            tipoHilazaAnterior.current !== tipoHilazaFiltro ||
            fechaInicioAnterior.current !== fechaInicio ||
            fechaFinAnterior.current !== fechaFin;


        if (
            filtrosCambiaron &&
            pagina !== 1
        ) {

            ordenAnterior.current =
                ordenFiltro;

            tipoHilazaAnterior.current =
                tipoHilazaFiltro;

            fechaInicioAnterior.current =
                fechaInicio;

            fechaFinAnterior.current =
                fechaFin;


            setPagina(1);

            return;

        }


        ordenAnterior.current =
            ordenFiltro;

        tipoHilazaAnterior.current =
            tipoHilazaFiltro;

        fechaInicioAnterior.current =
            fechaInicio;

        fechaFinAnterior.current =
            fechaFin;


        const filtros = {};


        if (ordenFiltro !== '') {

            filtros.orden =
                ordenFiltro;

        }


        if (tipoHilazaFiltro !== '') {

            filtros.tipoHilaza =
                tipoHilazaFiltro;

        }


        if (fechaInicio !== '') {

            filtros.fechaInicio =
                fechaInicio;

        }


        if (fechaFin !== '') {

            filtros.fechaFin =
                fechaFin;

        }


        filtros.pagina =
            pagina;

        filtros.registrosPagina =
            registrosPagina;


        async function consultarOrdenes() {

            try {

                setLoading(true);

                setError(null);


                const resultado =
                    await consultarOrdeProd(
                        filtros
                    );


                setOrdenes(
                    resultado.data
                );

                setTotalRegistros(
                    resultado.totalRegistros
                );

            } catch (error) {

                console.error(error);


                setError(
                    error.response?.data?.message ||
                    'No fue posible cargar las órdenes de trabajo.'
                );

            } finally {

                setLoading(false);

            }

        }


        consultarOrdenes();

    }, [
        ordenFiltro,
        tipoHilazaFiltro,
        fechaInicio,
        fechaFin,
        pagina
    ]);

    /*
      Consulta las ORDEPROD.
    */
    async function cargarOrdenes(
        filtros = obtenerFiltros()
    ) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarOrdeProd(filtros);

            setOrdenes(resultado.data);
            setTotalRegistros(
                resultado.totalRegistros
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar las órdenes de trabajo.'
            );

        } finally {

            setLoading(false);

        }

    }

    /*
      Consulta la Orden de Trabajo seleccionada y genera su PDF.
    */
    async function manejarDetalle(registro) {

        try {

            setImprimiendoOrden(
                registro.codigoOrden
            );

            const resultado = await consultarDetalleOrdeProd(registro.codigoOrden);

            await generarOrdenTrabajoPdf(
                resultado.data,
                {
                    logoMoliplus,
                    logoTextiles
                }
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible consultar la Orden de Trabajo.'
            );

        } finally {

            setImprimiendoOrden(null);

        }

    }

    const hayFiltros = ordenFiltro !== '' || tipoHilazaFiltro !== '' || fechaInicio !== '' || fechaFin !== '';
    const totalPaginas = Math.ceil(totalRegistros /registrosPagina);

    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>
                        Órdenes de Trabajo
                    </h1>

                    <p>
                        Consulte las órdenes generadas y vuelva a imprimir su detalle.
                    </p>

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
                        onChange={(event) =>
                            setOrdenFiltro(
                                event.target.value
                            )
                        }
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
                        onChange={(event) =>
                            setTipoHilazaFiltro(
                                event.target.value
                            )
                        }
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
                        onChange={(event) =>
                            setFechaInicio(
                                event.target.value
                            )
                        }
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
                        onChange={(event) =>
                            setFechaFin(
                                event.target.value
                            )
                        }
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

                        <h2>
                            Cargando órdenes de trabajo
                        </h2>

                        <p>
                            Consultando las órdenes de trabajo...
                        </p>

                    </div>

                </div>

            )}

            {!loading && error && (

                <div className="state-container error-state">

                    <div className="state-icon error-icon">

                        <ErrorOutlineOutlinedIcon />

                    </div>

                    <div className="state-content">

                        <h2>
                            No fue posible cargar las órdenes de trabajo
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                cargarOrdenes()
                            }
                        >
                            Reintentar
                        </button>

                    </div>

                </div>

            )}

            {!loading &&
                !error &&
                ordenes.length === 0 && (

                    <div className="state-container empty-state">

                        <div className="state-icon empty-icon">

                            <SearchOffOutlinedIcon />

                        </div>

                        <div className="state-content">

                            <h2>
                                {hayFiltros
                                    ? 'No se encontraron órdenes'
                                    : 'No hay órdenes de trabajo'}
                            </h2>

                            <p>
                                {hayFiltros
                                    ? 'No hay órdenes que coincidan con los criterios de búsqueda.'
                                    : 'Aún no existen órdenes de trabajo registradas.'}
                            </p>

                        </div>

                    </div>

                )}

            {!loading &&
                !error &&
                ordenes.length > 0 && (

                    <div className="table-section">

                        <OrdeProdTable
                            ordenes={ordenes}
                            imprimiendoOrden={imprimiendoOrden}
                            onDetalle={manejarDetalle}
                        />

                    </div>

                )}

            {!loading &&
                !error &&
                ordenes.length > 0 &&
                totalPaginas > 1 && (

                    <div className="pagination">

                        <span className="pagination-info">
                            Página {pagina} de {totalPaginas}
                        </span>

                        <div className="pagination-controls">

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={pagina === 1}
                                onClick={() =>
                                    setPagina(
                                        (actual) =>
                                            actual - 1
                                    )
                                }
                                title="Página anterior"
                                aria-label="Página anterior"
                            >
                                <ChevronLeftOutlinedIcon />
                            </button>

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={
                                    pagina === totalPaginas
                                }
                                onClick={() =>
                                    setPagina(
                                        (actual) =>
                                            actual + 1
                                    )
                                }
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
/*=============================================================================
  Nombre responsabilidad: Consultar el historial paginado TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Coordina filtros, paginación y carga del detalle mediante tigimoli.service.

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
    consultarTigimoli,
    consultarDetalleTigimoli
} from '../services/tigimoli.service';

import { consultarMolinetes } from '../services/molinetes.service';

import TigimoliTable from '../components/TigimoliTable';


function TigimoliPage() {

    const [tigimoli, setTigimoli] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [molinetes, setMolinetes] = useState([]);
    const [molinetesSeleccionados, setMolinetesSeleccionados] = useState([]);
    const [selectorMolinetesAbierto, setSelectorMolinetesAbierto] = useState(false);
    const selectorMolinetesRef = useRef(null);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const [pagina, setPagina] = useState(1);
    const registrosPagina = 10;
    const [totalRegistros, setTotalRegistros] = useState(0);

    const [detalleTigimoli, setDetalleTigimoli] = useState({});
    const [filaExpandida, setFilaExpandida] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);


    /*
      =========================================================
      FILTROS
      =========================================================
    */

      /*
        Carga los molinetes disponibles para el filtro.
        */
        useEffect(() => {

            async function cargarMolinetes() {

                try {

                    const resultado = await consultarMolinetes();

                    setMolinetes(resultado.data);

                } catch (error) {

                    console.error(error);

                    setError(
                        error.response?.data?.message ||
                        'No fue posible cargar los molinetes.'
                    );

                }

            }

            cargarMolinetes();

        }, []);

    /*
    Cierra el selector de molinetes al hacer clic fuera de él.
    */
    useEffect(() => {

        function manejarClickFuera(event) {

            if (
                selectorMolinetesRef.current &&
                !selectorMolinetesRef.current.contains(event.target)
            ) {
                setSelectorMolinetesAbierto(false);
            }

        }

        document.addEventListener('mousedown', manejarClickFuera);

        return () => {
            document.removeEventListener(
                'mousedown',
                manejarClickFuera
            );
        };

    }, []);

    /*
      Prepara los filtros de búsqueda de la página.
    */
    function obtenerFiltros() {

        const filtros = {};

        if (molinetesSeleccionados.length > 0) {
            filtros.molinetes =
                molinetesSeleccionados.join(',');
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

    /*
      =========================================================
      CONTROL DE CAMBIOS DE FILTROS Y PAGINACIÓN
      =========================================================
    */

    const molinetesAnteriores = useRef(molinetesSeleccionados);
    const fechaInicioAnterior = useRef(fechaInicio);
    const fechaFinAnterior = useRef(fechaFin);

    useEffect(() => {

        const filtrosCambiaron =
            molinetesAnteriores.current !== molinetesSeleccionados ||
            fechaInicioAnterior.current !== fechaInicio ||
            fechaFinAnterior.current !== fechaFin;

        if (filtrosCambiaron && pagina !== 1) {

            molinetesAnteriores.current = molinetesSeleccionados;
            fechaInicioAnterior.current = fechaInicio;
            fechaFinAnterior.current = fechaFin;

            setPagina(1);

            return;
        }

        molinetesAnteriores.current = molinetesSeleccionados;
        fechaInicioAnterior.current = fechaInicio;
        fechaFinAnterior.current = fechaFin;

        cargarTigimoli();

    }, [
        molinetesSeleccionados,
        fechaInicio,
        fechaFin,
        pagina
    ]);

    /*
      =========================================================
       CAMBIAR MOLINETE
      =========================================================
    */
    

    function cambiarMolinete(codigo) {

        setMolinetesSeleccionados((actuales) => {

            if (actuales.includes(codigo)) {
                return actuales.filter(
                    (item) => item !== codigo
                );
            }

            return [
                ...actuales,
                codigo
            ];

        });

    }
    /*
      =========================================================
      CONSULTAR TIGIMOLI
      =========================================================
    */
    
    /*
      Consulta los registros y actualiza el listado y los mensajes de la página.
    */
    async function cargarTigimoli(filtros = obtenerFiltros()) {

        try {

            setLoading(true);
            setError(null);

            const resultado = await consultarTigimoli(filtros);

            setTigimoli(resultado.data);
            setTotalRegistros(resultado.totalRegistros);

            setFilaExpandida(null);
            setDetalleTigimoli({});

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar el historial TIGIMOLI.'
            );

        } finally {

            setLoading(false);

        }
    }


    /*
      =========================================================
      CONSULTAR DETALLE
      =========================================================
    */

    /*
      Abre o cierra el detalle del registro y lo consulta cuando aún no está cargado.
    */
    async function manejarDetalle(registro) {

        const clave =
            `${registro.codigoMoli}-${registro.fechaGeneracion}`;

        if (filaExpandida === clave) {

            setFilaExpandida(null);

            return;
        }

        setFilaExpandida(clave);

        if (detalleTigimoli[clave]) {
            return;
        }

        try {

            setLoadingDetalle(true);

            const resultado = await consultarDetalleTigimoli({
                codigo: registro.codigoMoli,
                fecha: registro.fechaGeneracion
            });

            setDetalleTigimoli((actual) => ({
                ...actual,
                [clave]: resultado.data
            }));

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible cargar el detalle TIGIMOLI.'
            );

        } finally {

            setLoadingDetalle(false);

        }
    }


    const hayFiltros =
        molinetesSeleccionados.length > 0 ||
        fechaInicio !== '' ||
        fechaFin !== '';


    const totalPaginas =
        Math.ceil(totalRegistros / registrosPagina);


    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>
                        Consulta Tiempos de Giro
                    </h1>

                    <p>
                        Consulta del historial de tiempos de giro por molinete.
                    </p>

                </div>

            </div>


            <div className="filters tigimoli-filters">

                <div className="tigimoli-filter-field">

                    <label htmlFor="fecha-inicio">
                        Fecha inicio
                    </label>

                    <input
                        id="fecha-inicio"
                        type="date"
                        value={fechaInicio}
                        max={fechaFin || undefined}
                        onChange={(event) => {
                            setFechaInicio(event.target.value);
                        }}
                    />

                </div>


                <div className="tigimoli-filter-field">

                    <label htmlFor="fecha-fin">
                        Fecha fin
                    </label>

                    <input
                        id="fecha-fin"
                        type="date"
                        value={fechaFin}
                        min={fechaInicio || undefined}
                        onChange={(event) => {
                            setFechaFin(event.target.value);
                        }}
                    />

                </div>


                <div className="tigimoli-filter-field molinete-filter">

                        <label>
                            Molinetes
                        </label>

                        <div
                            className="molinete-select"
                            ref={selectorMolinetesRef}
                        >

                        <button
                            type="button"
                            className={`molinete-select-button ${
                                selectorMolinetesAbierto ? 'open' : ''
                            }`}
                            onClick={() => {
                                setSelectorMolinetesAbierto(
                                    (actual) => !actual
                                );
                            }}
                        >
                            <span>
                                {molinetesSeleccionados.length === 0
                                    ? 'Todos los molinetes'
                                    : molinetesSeleccionados.length === 1
                                        ? '1 molinete seleccionado'
                                        : `${molinetesSeleccionados.length} molinetes seleccionados`}
                            </span>

                            <span className="molinete-select-arrow">
                                ▾
                            </span>
                        </button>


                        {selectorMolinetesAbierto && (

                            <div className="molinete-select-dropdown">

                                {molinetes.map((molinete) => (

                                    <label
                                        key={molinete.codigo}
                                        className="molinete-select-option"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                molinetesSeleccionados.includes(
                                                    molinete.codigo
                                                )
                                            }
                                            onChange={() => {
                                                cambiarMolinete(
                                                    molinete.codigo
                                                );
                                            }}
                                        />

                                        <span>
                                            {molinete.nombre}
                                        </span>

                                    </label>

                                ))}

                            </div>

                        )}

                    </div>

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
                            Cargando historial
                        </h2>

                        <p>
                            Consultando la información...
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
                            No fue posible cargar el historial
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => cargarTigimoli()}
                        >
                            Reintentar
                        </button>

                    </div>

                </div>

            )}


            {!loading && !error && tigimoli.length === 0 && (

                <div className="state-container empty-state">

                    <div className="state-icon empty-icon">

                        <SearchOffOutlinedIcon />

                    </div>

                    <div className="state-content">

                        <h2>
                            {hayFiltros
                                ? 'No se encontraron registros'
                                : 'No hay historial TIGIMOLI'}
                        </h2>

                        <p>
                            {hayFiltros
                                ? 'No hay registros que coincidan con los criterios de búsqueda.'
                                : 'Aún no existen registros TIGIMOLI en el sistema.'}
                        </p>

                    </div>

                </div>

            )}


            {!loading && !error && tigimoli.length > 0 && (

                <div className="table-section">

                    <TigimoliTable
                        tigimoli={tigimoli}
                        filaExpandida={filaExpandida}
                        detalleTigimoli={detalleTigimoli}
                        loadingDetalle={loadingDetalle}
                        onDetalle={manejarDetalle}
                    />

                </div>

            )}


            {!loading &&
                !error &&
                tigimoli.length > 0 &&
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
                                onClick={() => {
                                    setPagina((actual) => actual - 1);
                                }}
                                title="Página anterior"
                                aria-label="Página anterior"
                            >
                                <ChevronLeftOutlinedIcon />
                            </button>


                            <button
                                type="button"
                                className="pagination-button"
                                disabled={pagina === totalPaginas}
                                onClick={() => {
                                    setPagina((actual) => actual + 1);
                                }}
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


export default TigimoliPage;
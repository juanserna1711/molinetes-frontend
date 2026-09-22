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
import { useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import {
    consultarTigimoli,
    consultarDetalleTigimoli
} from '../services/tigimoli.service';

import TigimoliTable from '../components/TigimoliTable';


function TigimoliPage() {
    const navigate = useNavigate();

    const [tigimoli, setTigimoli] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [fecha, setFecha] = useState('');

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
      Prepara los filtros de búsqueda de la página.
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

        if (fecha !== '') {
            filtros.fecha = fecha;
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

    const busquedaAnterior = useRef(busqueda);
    const fechaAnterior = useRef(fecha);

    useEffect(() => {

        const filtrosCambiaron =
            busquedaAnterior.current !== busqueda ||
            fechaAnterior.current !== fecha;


        /*
        * Si cambió un filtro y estamos en otra página,
        * primero regresamos a la página 1.
        *
        * La consulta se hará cuando pagina cambie a 1.
        */
        if (filtrosCambiaron && pagina !== 1) {

            busquedaAnterior.current = busqueda;
            fechaAnterior.current = fecha;

            setPagina(1);

            return;
        }


        busquedaAnterior.current = busqueda;
        fechaAnterior.current = fecha;

        cargarTigimoli();

    }, [
        busqueda,
        fecha,
        pagina
    ]);
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
        busqueda.trim() !== '' ||
        fecha !== '';


    const totalPaginas =
        Math.ceil(totalRegistros / registrosPagina);


    return (

        <section className="page">

            <div className="page-header">

                <div className="page-header-info">

                    <h1>
                        Historial Tiempos de Giro
                    </h1>

                    <p>
                        Consulta del historial de tiempos de giro por molinete.
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        navigate('/nuevo-tigimoli'); 
                    }}
                >
                    <AddIcon />
                    Nuevo Tiempo de giro
                </button>

            </div>


            <div className="filters">

                <div className="search-box">

                    <SearchOutlinedIcon />

                    <input
                        type="text"
                        placeholder="Buscar por código o nombre del molinete..."
                        value={busqueda}
                        onChange={(event) => {
                            setBusqueda(event.target.value);
                        }}
                        maxLength={60}
                    />

                </div>


                <div className="date-filter">

                    <input
                        type="date"
                        value={fecha}
                        onChange={(event) => {
                            setFecha(event.target.value);
                        }}
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
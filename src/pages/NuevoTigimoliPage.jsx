/*=============================================================================
  Nombre responsabilidad: Preparar la programación TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Carga molinetes, tipos de hilaza y rendimientos, administra la selección
  de tallas, distribución de rollos y cálculo por molinete, y permite
  generar la respectiva Orden de Trabajo.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 25/Septiembre/2026
  Descripcion:
  Se agrega selección del tipo de hilaza,
  registro de TIGIMOLI y ORDEPROD, gráfico de tiempos de giro y acciones
  de limpiar, guardar e imprimir.
=============================================================================*/

import { useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import NuevoTigimoliHilazaTallas from '../components/NuevoTigimoli/NuevoTigimoliHilazaTallas.jsx';
import NuevoTigimoliDistribucion from '../components/NuevoTigimoli/NuevoTigimoliDistribucion.jsx';
import { consultarMolinetes } from '../services/molinetes.service.js';
import { consultarRendTallas } from '../services/rendtallas.service.js';
import { consultarTiposHilaza } from '../services/tipohilaza.service.js';
import { consultarDetalleOrdeProd } from '../services/ordeprod.service.js';
import { generarOrdenTrabajoPdf } from '../utils/generarOrdenTrabajoPdf.js';
import { consultarTiHiProm } from '../services/tihiprom.service.js';
import { crearTigimoli } from '../services/tigimoli.service.js';
import logoMoliplus from '../assets/logo-moliplus.png';
import logoTextiles from '../assets/logo-textiles-pacifico.png';

function NuevoTigimoliPage() {

    const [molinetes, setMolinetes] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [tiposHilaza, setTiposHilaza] = useState([]);
    const [tipoHilazaSeleccionado, setTipoHilazaSeleccionado] = useState('');
    const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);
    const [distribucion, setDistribucion] = useState({}); // Rollos por código de molinete y talla, aún sin persistir.
    const [molinetesHabilitados, setMolinetesHabilitados] = useState([]);
    const [rpmProgramacion, setRpmProgramacion] = useState({});
    const [codigoOrden, setCodigoOrden] = useState(null); // Vincula la programación guardada con su impresión.
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false); // Evita editar la programación mientras se envía la orden.
    const [snackbar, setSnackbar] = useState({message: '', type: 'success'});

    /* =========================================================
       SNACKBAR
       ========================================================= */
    function mostrarSnackbar(message, type = 'success') {

        setSnackbar({message, type});

    }

    /* =========================================================
       CARGAR DATOS
       ========================================================= */

    useEffect(() => {

        async function cargarDatos() {

            try {

                setLoading(true);

                const [respuestaMolinetes,respuestaTiposHilaza] = await Promise.all([consultarMolinetes(), consultarTiposHilaza()]);
                const datosMolinetes = respuestaMolinetes.data || respuestaMolinetes;
                const datosTiposHilaza = respuestaTiposHilaza.data || respuestaTiposHilaza;

                setMolinetes(datosMolinetes);
                setTiposHilaza(datosTiposHilaza);

                // Inicialmente todos los molinetes quedan habilitados para la programación.
                setMolinetesHabilitados(
                    datosMolinetes.map((molinete) => molinete.codigo)
                );

                // Inicializa el RPM de programación con el valor configurado actualmente en MOLINETE.
                setRpmProgramacion(Object.fromEntries(datosMolinetes.map((molinete) => [molinete.codigo,molinete.rpm])));

            } catch (error) {

                console.error(error);
                mostrarSnackbar('No fue posible cargar la información de la programación.', 'error');

            } finally {
                setLoading(false);
            }

        }

        cargarDatos();

    }, []);

    /* =========================================================
       ORDEN GUARDADA
       ========================================================= */

    // Cualquier cambio posterior a guardar invalida la orden actualmente habilitada para impresión.
    function invalidarOrdenGuardada() {

        if (codigoOrden !== null) {
            setCodigoOrden(null);
        }

    }

    /* =========================================================
       TIPO DE HILAZA
       ========================================================= */

    //Reconstruye las tallas disponibles para la hilaza y descarta selecciones y rollos anteriores al completar la carga. No actualiza RENDTALL desde aquí.
    async function cambiarTipoHilaza(valor) {

        if (guardando) {
            return;
        }

        setTipoHilazaSeleccionado(valor);
        setCodigoOrden(null);

        if (!valor) {

            setTallas([]);
            setTallasSeleccionadas([]);
            setDistribucion({});

            return;
        }

        try {

            // Consulta los datos base de RENDTALL y los parámetros asociados al tipo de hilaza para calcular la programación en memoria.
            const [respuestaTallas, respuestaAsociaciones] = await Promise.all([consultarRendTallas({estado: 'A'}), consultarTiHiProm({tipoHilaza: Number(valor)})]);
            const datosTallas = respuestaTallas.data || respuestaTallas;
            const asociaciones = respuestaAsociaciones.data || respuestaAsociaciones;

            // Permite combinar el rendimiento base con la asociación TIHIPROM por código de talla.
            const asociacionesPorTalla = new Map(asociaciones.map((registro) => [registro.codigoTalla, registro]));
            const tallasCalculadas = datosTallas.map((talla) => {

                const esRib = talla.nombre ?.trim().toUpperCase() === 'RIB';

                let ancho;
                let pesoCalculo;

                // RIB usa sus medidas base; las demás tallas usan ancho y promedio de la hilaza.
                if (esRib) {

                    ancho = Number(talla.ancho);
                    pesoCalculo = Number(talla.peso);

                } else {

                    const asociacion = asociacionesPorTalla.get(talla.codigo);

                    if (!asociacion) {
                        return talla;
                    }

                    ancho = Number(asociacion.ancho);
                    pesoCalculo = Number(asociacion.promedio);

                }

                const pesoRollo = Number(talla.pesoRollo);
                // Convierte ancho y peso en rendimiento, y el peso del rollo en metros para la vista previa.
                const rendimiento = ancho > 0 && pesoCalculo > 0 && pesoRollo > 0 ? 1000 / ((ancho * 2 / 100) * pesoCalculo) : 0;
                const metrosRollo = pesoRollo * rendimiento;

                return {...talla, rendimiento, metrosRollo};
            });

            const codigosTallasAsociadas = new Set(asociaciones.map((registro) => registro.codigoTalla));

            //RIB es independiente del tipo de hilaza, por lo que siempre permanece disponible. Las demás tallas deben estar asociadas al tipo de hilaza seleccionado en TIHIPROM.
            const tallasFiltradas = tallasCalculadas.filter((talla) => {

                        const esRib = talla.nombre?.trim().toUpperCase() === 'RIB';

                        return (esRib || codigosTallasAsociadas.has(talla.codigo));

                    });


            setTallas(tallasFiltradas);
            // El cambio de hilaza invalida la distribución previamente calculada.
            setTallasSeleccionadas([]);
            setDistribucion({});
            mostrarSnackbar('Tipo de hilaza seleccionado correctamente.', 'success');

        } catch (error) {

            console.error(error);

            setTipoHilazaSeleccionado('');

            mostrarSnackbar(error.response?.data?.message || 'No fue posible cargar la información del tipo de hilaza.','error');

        }
    }

    /* =========================================================
       TALLAS
       ========================================================= */

    function cambiarTalla(codigoTalla) {

        if (!tipoHilazaSeleccionado || guardando) {
            return;
        }

        invalidarOrdenGuardada();

        const tallaSeleccionada = tallasSeleccionadas.includes(codigoTalla);

        if (tallaSeleccionada) {

            setTallasSeleccionadas((actuales) => actuales.filter((codigo) => codigo !== codigoTalla));

            // Al retirar una talla también elimina su distribución de todos los molinetes.
            setDistribucion((actual) => {

                const nuevaDistribucion = {};

                Object.entries(actual).forEach(([codigoMolinete, distribucionMolinete]) => {

                        const nuevaDistribucionMolinete = {...distribucionMolinete};

                        delete nuevaDistribucionMolinete[codigoTalla];

                        nuevaDistribucion[codigoMolinete] = nuevaDistribucionMolinete;

                    });

                return nuevaDistribucion;

            });

            return;
        }

        setTallasSeleccionadas((actuales) => [...actuales, codigoTalla]);

    }


    // Conserva el orden del catálogo y limita cálculos y columnas a las tallas seleccionadas.
    const tallasProgramacion = useMemo(() => {

        return tallas.filter((talla) => tallasSeleccionadas.includes(talla.codigo));

    }, [tallas, tallasSeleccionadas]);

    /* =========================================================
       MOLINETES
       ========================================================= */

    // Cambia la participación del molinete sin borrar sus rollos; el guardado excluye los deshabilitados.
    function cambiarMolinete(codigoMolinete) {
        if (!tipoHilazaSeleccionado || guardando) {return;}

        invalidarOrdenGuardada();

        setMolinetesHabilitados((actuales) => {
            if (actuales.includes(codigoMolinete)) {
                return actuales.filter((codigo) => codigo !== codigoMolinete);
            }
            return [...actuales, codigoMolinete];

        });

    }

    //Actualiza el RPM utilizado por todos los molinetes de la programación, ya que tecnológicamente trabajan con una misma velocidad.
    function cambiarRpm(valor) {

        if (!tipoHilazaSeleccionado || guardando) {
            return;
        }

        invalidarOrdenGuardada();
        setRpmProgramacion(Object.fromEntries(molinetes.map((molinete) => [molinete.codigo, valor])));

    }


    /* =========================================================
       DISTRIBUCIÓN
       ========================================================= */

    // Actualiza una celda conservando el resto de la distribución y desvincula la orden anterior.
    function cambiarDistribucion(codigoMolinete, codigoTalla, cantidad) {
        if (!tipoHilazaSeleccionado || guardando) {return;}

        invalidarOrdenGuardada();

        setDistribucion((actual) => ({...actual, [codigoMolinete]: {...(actual[codigoMolinete] || {}), [codigoTalla]: cantidad}}));

    }

    /* =========================================================
       RESULTADOS POR MOLINETE
       ========================================================= */

      //Resume solo rollos positivos de las tallas seleccionadas para cada molinete.
      //Estos totales alimentan la tabla y el gráfico; no se incluyen en el payload.
    const resultadosMolinetes = useMemo(() => {

        const resultados = {};

        molinetes.forEach((molinete) => {

            let totalRollos = 0;
            let totalMetros = 0;
            let cantidadTallas = 0;

            const distribucionMolinete = distribucion[molinete.codigo] || {};

            tallasProgramacion.forEach((talla) => {

                const rollos = Number(distribucionMolinete[talla.codigo] || 0);

                if (rollos > 0) {

                    cantidadTallas += 1;
                    totalRollos += rollos;
                    totalMetros += rollos * Number(talla.metrosRollo || 0);

                }

            });

            // ?? conserva un cero explícito; solo usa la RPM del catálogo ante null o undefined.
            const rpm = Number(rpmProgramacion[molinete.codigo] ?? molinete.rpm ?? 0);
            const perimetro = Number(molinete.perimetro || 0);
            // El avance RPM × perímetro / 100 permite expresar el tiempo estimado en minutos.
            const tiempoGiro = rpm > 0 && perimetro > 0 && totalMetros > 0 ? totalMetros/((rpm * perimetro) / 100) : 0;

            resultados[molinete.codigo] = {
                totalRollos,
                totalMetros,
                cantidadTallas,
                tiempoGiro
            };

        });

        return resultados;

    }, [molinetes,tallasProgramacion,distribucion,rpmProgramacion]);


    /* =========================================================
       GRÁFICO
       ========================================================= */

    // El gráfico muestra únicamente molinetes habilitados con tiempo calculado positivo.
    const datosGrafica = useMemo(() => {

        return molinetes.filter((molinete) => molinetesHabilitados.includes(molinete.codigo)).map((molinete) => ({
                codigo: molinete.codigo,
                nombre: molinete.nombre,
                tiempoGiro: resultadosMolinetes[molinete.codigo] ?.tiempoGiro || 0})).filter((molinete) => molinete.tiempoGiro > 0);

    }, [molinetes,molinetesHabilitados,resultadosMolinetes]);


    // La referencia mínima de uno evita una escala nula al dimensionar las barras visuales.
    const tiempoMaximoGrafica = useMemo(() => {

        return Math.max(...datosGrafica.map((molinete) => molinete.tiempoGiro), 1);

    }, [datosGrafica]);


    /* =========================================================
       GUARDAR
       ========================================================= */

    // Valida selección, detalles con rollos y RPM antes de registrar la orden mediante el servicio.
    async function guardarProgramacion() {

        if (!tipoHilazaSeleccionado) {

            mostrarSnackbar('Debe seleccionar un tipo de hilaza.', 'warning');

            return;

        }

        if (tallasSeleccionadas.length === 0) {

            mostrarSnackbar('Debe seleccionar al menos una talla.', 'warning');

            return;

        }

        const codigosMolinetes = [];
        const codigosTallas = [];
        const cantidadesRollos = [];
        const rpmsMolinetes = [];

          //Cada índice de las cuatro listas representa un mismo detalle molinete-talla.
          //Solo se envían molinetes habilitados con rollos positivos; Oracle calcula sus resultados.
        molinetes.forEach((molinete) => {

            if (!molinetesHabilitados.includes(molinete.codigo)) {
                return;
            }

            // ?? conserva un cero explícito; solo usa la RPM del catálogo ante null o undefined.
            const rpm = Number(rpmProgramacion[molinete.codigo] ?? molinete.rpm ?? 0);

            tallasProgramacion.forEach((talla) => {

                const rollos = Number(distribucion[molinete.codigo]?.[talla.codigo] || 0);

                if (rollos > 0) {
                    codigosMolinetes.push(molinete.codigo);
                    codigosTallas.push(talla.codigo);
                    cantidadesRollos.push(rollos);
                    rpmsMolinetes.push(rpm);
                }

            });

        });

        if (codigosMolinetes.length === 0) {

            mostrarSnackbar('Debe ingresar rollos en al menos una combinación.', 'warning');

            return;

        }

        const rpmInvalido = rpmsMolinetes.some((rpm) => !Number.isFinite(rpm) || rpm <= 0);

        if (rpmInvalido) {

            mostrarSnackbar('Los RPM utilizados deben ser mayores a cero.', 'warning');

            return;

        }

        try {

            setGuardando(true);

            const response = await crearTigimoli({
                codigosMolinetes,
                codigosTallas,
                cantidadesRollos,
                rpmsMolinetes,
                codTipoHilaza: Number(tipoHilazaSeleccionado),
                usuario: 4
            });

            setCodigoOrden(response.codigoOrden);

            mostrarSnackbar(`Orden de Trabajo #${response.codigoOrden} generada correctamente.`, 'success');

        } catch (error) {

            console.error(error);

            mostrarSnackbar(error.response?.data?.message || 'No fue posible generar la Orden de Trabajo.', 'error');

        } finally {

            setGuardando(false);

        }

    }

    /* =========================================================
       IMPRIMIR
       ========================================================= */

    // Consulta el detalle persistido por codigoOrden para que el PDF represente la orden guardada.
    async function imprimirOrden() {

        if (!codigoOrden) {return;}

        try {

            const response = await consultarDetalleOrdeProd(codigoOrden);

            await generarOrdenTrabajoPdf(response.data,{logoMoliplus,logoTextiles});

        } catch (error) {

            console.error(error);

            mostrarSnackbar(error.response?.data?.message ||'No fue posible generar la Orden de Trabajo.','error');

        }

    }

    /* =========================================================
       FORMATO
       ========================================================= */

    function formatearNumero(valor) {

        return Number(valor || 0).toLocaleString('es-CO',{minimumFractionDigits: 1, maximumFractionDigits: 1});

    }

    /* =========================================================
       LIMPIAR
       ========================================================= */

    // Descarta el borrador y la referencia de impresión, restaurando habilitación y RPM del catálogo.
    function limpiarProgramacion() {

        if (guardando) {
            return;
        }

        setTipoHilazaSeleccionado('');
        setTallasSeleccionadas([]);
        setDistribucion({});
        setMolinetesHabilitados(molinetes.map((molinete) => molinete.codigo));
        setRpmProgramacion(Object.fromEntries(molinetes.map((molinete) => [molinete.codigo, molinete.rpm])));

        setCodigoOrden(null);

    }

    // El padre controla la edición y entrega selecciones, resultados y callbacks a los dos componentes hijos.
    const programacionHabilitada = Boolean(tipoHilazaSeleccionado) && !guardando;


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="nuevo-tigimoli-page">

                <div className="nuevo-tigimoli-loading">

                    <PrecisionManufacturingOutlinedIcon />

                    <strong>
                        Cargando información...
                    </strong>

                    <span>
                        Consultando molinetes, tallas y tipos de hilaza.
                    </span>

                </div>

            </div>

        );

    }

    return (

        <div className="page">

            {/* =================================================
                CABECERA
                ================================================= */}

            <header className="page-header">

                <div className="page-header-info">

                    <h1>Registrar Cálculo</h1>

                    <p>Distribuya la producción entre los molinetes disponibles.</p>

                </div>

                <div className="nuevo-tigimoli-date">

                    <CalendarTodayOutlinedIcon />

                    <span>
                        {new Date().toLocaleDateString('es-CO')}
                    </span>

                </div>

            </header>


            {/* =================================================
                TIPO DE HILAZA Y TALLAS
                ================================================= */}

            <NuevoTigimoliHilazaTallas
                tiposHilaza={tiposHilaza}
                tipoHilazaSeleccionado={tipoHilazaSeleccionado}
                onCambiarTipoHilaza={cambiarTipoHilaza}
                tallas={tallas}
                tallasSeleccionadas={tallasSeleccionadas}
                onCambiarTalla={cambiarTalla}
                programacionHabilitada={programacionHabilitada}
            />

            {/* =================================================
                DISTRIBUCIÓN
                ================================================= */}
            <div
                className={!programacionHabilitada ? 'nuevo-tigimoli-block disabled' : 'nuevo-tigimoli-block'}
            >

            <NuevoTigimoliDistribucion
                molinetes={molinetes}
                tallas={tallasProgramacion}
                distribucion={distribucion}
                molinetesHabilitados={molinetesHabilitados}
                rpmProgramacion={rpmProgramacion}
                resultadosMolinetes={resultadosMolinetes}
                onCambiarMolinete={cambiarMolinete}
                onCambiarDistribucion={cambiarDistribucion}
                onCambiarRpm={cambiarRpm}
                formatearNumero={formatearNumero}
            />

            </div>

            {/* =================================================
                GRÁFICO
                ================================================= */}

            {datosGrafica.length > 0 && (

                <section className="nuevo-tigimoli-chart">

                    <div className="nuevo-tigimoli-chart-title">

                        <BarChartOutlinedIcon />

                        <div>
                            <h2>Tiempo de giro por molinete</h2>

                            <p>Comparación del tiempo estimado de la programación actual.</p>
                        </div>

                    </div>

                    <div className="nuevo-tigimoli-chart-content">

                        {datosGrafica.map((molinete) => {

                            const porcentaje =(molinete.tiempoGiro/tiempoMaximoGrafica) * 100;

                            return (

                                <div
                                    key={molinete.codigo}
                                    className="nuevo-tigimoli-chart-item"
                                >

                                    <span className="nuevo-tigimoli-chart-label">
                                        {molinete.nombre}
                                    </span>

                                    <div className="nuevo-tigimoli-chart-track">

                                        <div
                                            className="nuevo-tigimoli-chart-bar"
                                            style={{height:`${Math.max(porcentaje,5)}%`}}
                                        />

                                    </div>

                                    <strong>
                                        {formatearNumero(molinete.tiempoGiro)} min
                                    </strong>

                                </div>

                            );

                        })}

                    </div>

                </section>

            )}

            {/* =================================================
                ORDEN GENERADA
                ================================================= */}

            {codigoOrden && (

                <div className="nuevo-tigimoli-order-result">

                    Orden de Trabajo generada:

                    <strong>
                        #{codigoOrden}
                    </strong>

                </div>

            )}

            {/* =================================================
                ACCIONES
                ================================================= */}

            <footer className="nuevo-tigimoli-actions">

                <button
                    type="button"
                    className="secondary-action"
                    onClick={limpiarProgramacion}
                    disabled={guardando}
                >
                    <CleaningServicesOutlinedIcon />

                    Limpiar datos
                </button>

                <div className="nuevo-tigimoli-actions-main">

                    <button
                        type="button"
                        className="primary-action"
                        onClick={guardarProgramacion}
                        disabled={guardando || !tipoHilazaSeleccionado || Boolean(codigoOrden)}
                    >

                        {guardando ? (

                                <>
                                    <CircularProgress
                                        size={16}
                                        thickness={4}
                                    />

                                    Guardando...
                                </>

                            ) : codigoOrden ? (

                                <>
                                    <SaveOutlinedIcon />
                                    Guardado
                                </>

                            ) : (

                                <>
                                    <SaveOutlinedIcon />
                                    Guardar
                                </>

                            )}

                    </button>

                    <button
                        type="button"
                        className="secondary-action"
                        onClick={imprimirOrden}
                        disabled={!codigoOrden || guardando}
                    >
                        <PrintOutlinedIcon />

                        Imprimir
                    </button>

                </div>

            </footer>

            {/* =================================================
                SNACKBAR
                ================================================= */}

            <Snackbar
                open={Boolean(snackbar.message)}
                autoHideDuration={3000}
                onClose={() => setSnackbar({message: '', type: 'success'})}
                anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}
            >

                <Alert
                    severity={snackbar.type}
                    variant="filled"
                    onClose={() => setSnackbar({message: '', type: 'success'})}
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </div>

    );

}

export default NuevoTigimoliPage;
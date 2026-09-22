/*=============================================================================
  Nombre responsabilidad: Preparar y registrar un cálculo TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Carga molinetes y rendimientos en paralelo, administra la selección y calcula la vista previa.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useEffect, useMemo, useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import NuevoTigimoliForm from '../components/NuevoTigimoliForm';
import NuevoTigimoliResultados from '../components/NuevoTigimoliResultados';

import { consultarMolinetes } from '../services/molinetes.service.js';
import { consultarRendTallas } from '../services/rendtallas.service.js';
import { crearTigimoli } from '../services/tigimoli.service.js';


function NuevoTigimoliPage() {

    const [molinetes, setMolinetes] = useState([]);
    const [tallas, setTallas] = useState([]);

    const [molinetesSeleccionados, setMolinetesSeleccionados] = useState([]);
    const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);

    const [calculo, setCalculo] = useState({});
    const [erroresTallas, setErroresTallas] = useState({});

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: '',
        type: 'success'
    });


    /*
     * Temporalmente se utiliza el usuario 1.
     * Posteriormente vendrá de la sesión.
     */
    const usuario = 1;


    /* =========================================================
       SNACKBAR
       ========================================================= */

    function mostrarSnackbar(message, type = 'success') {

        setSnackbar({
            message,
            type
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


    /* =========================================================
       CARGAR MOLINETES Y TALLAS
       ========================================================= */

    useEffect(() => {

        /*
          Carga los molinetes y rendimientos disponibles para preparar el cálculo.
        */
        async function cargarDatos() {

            try {

                setLoading(true);

                const [
                    respuestaMolinetes,
                    respuestaTallas
                ] = await Promise.all([
                    consultarMolinetes(),
                    consultarRendTallas()
                ]);

                setMolinetes(
                    respuestaMolinetes.data || respuestaMolinetes
                );

                setTallas(
                    respuestaTallas.data || respuestaTallas
                );

            } catch (error) {

                console.error(error);

                mostrarSnackbar(
                    'No fue posible cargar molinetes y tallas.',
                    'error'
                );

            } finally {

                setLoading(false);

            }

        }

        cargarDatos();

    }, []);


    /* =========================================================
       MOLINETES
       ========================================================= */

    /*
      Agrega o retira un molinete de la selección.
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


    /* =========================================================
       TALLAS
       ========================================================= */

    /*
      Actualiza la selección de tallas y retira sus cantidades y errores al desmarcarlas.
    */
    function cambiarTalla(codigo) {

        setTallasSeleccionadas((actuales) => {

            if (actuales.includes(codigo)) {

                setCalculo((actual) => {

                    const nuevoCalculo = {
                        ...actual
                    };

                    delete nuevoCalculo[codigo];

                    return nuevoCalculo;

                });

                setErroresTallas((actual) => {

                    const nuevosErrores = {
                        ...actual
                    };

                    delete nuevosErrores[codigo];

                    return nuevosErrores;

                });

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


    /* =========================================================
       ROLLOS
       ========================================================= */

    /*
      Actualiza la cantidad de rollos de una talla y limpia su error.
    */
    function cambiarRollos(codigoTalla, cantidad) {

        const valor = Number(cantidad);

        setCalculo((actual) => ({
            ...actual,
            [codigoTalla]:
                cantidad === ''
                    ? ''
                    : Math.max(0, valor || 0)
        }));

        setErroresTallas((actual) => ({
            ...actual,
            [codigoTalla]: false
        }));

    }


    /*
      Aumenta en uno la cantidad de rollos de la talla.
    */
    function agregarRollo(codigoTalla) {

        const actual = Number(
            calculo[codigoTalla] || 0
        );

        cambiarRollos(
            codigoTalla,
            actual + 1
        );

    }


    /* =========================================================
       MOLINETES SELECCIONADOS
       ========================================================= */

    const molinetesCalculo = useMemo(() => {

        return molinetes.filter(
            (molinete) =>
                molinetesSeleccionados.includes(
                    molinete.codigo
                )
        );

    }, [
        molinetes,
        molinetesSeleccionados
    ]);


    /* =========================================================
       TALLAS SELECCIONADAS
       ========================================================= */

    const tallasCalculo = useMemo(() => {

        return tallas.filter(
            (talla) =>
                tallasSeleccionadas.includes(
                    talla.codigo
                )
        );

    }, [
        tallas,
        tallasSeleccionadas
    ]);


    /* =========================================================
       DETALLE DE CALCULO
       ========================================================= */

    /*
      Calcula los metros por talla a partir de sus rollos y obtiene los totales.
    */
    const Calculo = useMemo(() => {

        return tallasCalculo.map((talla) => {

            const rollos =
                calculo[talla.codigo] ?? '';

            const metrosRollo = Number(
                talla.metrosRollo || 0
            );

            return {
                ...talla,
                rollos,
                metrosRollo,
                metros:
                    Number(rollos || 0) *
                    metrosRollo
            };

        });

    }, [
        tallasCalculo,
        calculo
    ]);


    /* =========================================================
       TOTAL ROLLOS
       ========================================================= */

    const totalRollos = useMemo(() => {

        return Calculo.reduce(
            (total, item) =>
                total + Number(item.rollos || 0),
            0
        );

    }, [
        Calculo
    ]);


    /* =========================================================
       TOTAL METROS
       ========================================================= */

    const totalMetros = useMemo(() => {

        return Calculo.reduce(
            (total, item) =>
                total + Number(item.metros || 0),
            0
        );

    }, [
        Calculo
    ]);


    /* =========================================================
       CALCULO VÁLIDA
       ========================================================= */

    /*
      Permite guardar cuando la selección y las cantidades de rollos son válidas.
    */
    const calculoValido =
        molinetesSeleccionados.length > 0 &&
        tallasSeleccionadas.length > 0 &&
        Calculo.length > 0 &&
        Calculo.every(
            (talla) =>
                Number(talla.rollos) > 0
        );


    /* =========================================================
       TIEMPO DE GIRO POR MOLINETE
       ========================================================= */

    /*
      Calcula el tiempo de giro en minutos según los metros, las RPM y el perímetro del molinete.
    */
    function calcularTiempoGiro(molinete) {

        const rpm = Number(
            molinete.rpm || 0
        );

        const perimetro = Number(
            molinete.perimetro || 0
        );

        if (
            rpm <= 0 ||
            perimetro <= 0 ||
            totalMetros <= 0
        ) {
            return 0;
        }

        return totalMetros /
            ((rpm * perimetro) / 100);

    }


    /* =========================================================
       FORMATO DE NÚMEROS
       ========================================================= */

    /*
      Presenta los números en formato local con un decimal.
    */
    function formatearNumero(valor) {

        return Number(
            valor || 0
        ).toLocaleString(
            'es-CO',
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        );

    }


    /* =========================================================
       VALIDAR CALCULO
       ========================================================= */

    /*
      Comprueba que haya molinetes, tallas y cantidades de rollos positivas.
    */
    function validarCalculo() {

        const nuevosErrores = {};

        Calculo.forEach((talla) => {

            if (
                talla.rollos === '' ||
                Number(talla.rollos) <= 0
            ) {

                nuevosErrores[talla.codigo] = true;

            }

        });

        setErroresTallas(nuevosErrores);


        if (
            molinetesSeleccionados.length === 0
        ) {

            mostrarSnackbar(
                'Debe seleccionar al menos un molinete.',
                'error'
            );

            return false;

        }


        if (
            tallasSeleccionadas.length === 0
        ) {

            mostrarSnackbar(
                'Debe seleccionar al menos una talla.',
                'error'
            );

            return false;

        }


        if (
            Object.keys(nuevosErrores).length > 0
        ) {

            mostrarSnackbar(
                'Debe ingresar una cantidad de rollos mayor que cero para cada talla seleccionada.',
                'error'
            );

            return false;

        }


        return true;

    }


    /* =========================================================
       GUARDAR CALCULO
       ========================================================= */

    /*
      Registra el cálculo para las combinaciones de molinetes y tallas seleccionadas.
    */
    async function guardarCalculo() {

        if (!validarCalculo()) {
            return;
        }

        try {

            setGuardando(true);

            const codigosMolinetes = [];
            const codigosTallas = [];
            const cantidadesRollos = [];

            for (const molinete of molinetesCalculo) {

                for (const talla of Calculo) {

                    codigosMolinetes.push(
                        molinete.codigo
                    );

                    codigosTallas.push(
                        talla.codigo
                    );

                    cantidadesRollos.push(
                        Number(talla.rollos)
                    );

                }

            }

            await crearTigimoli({
                codigosMolinetes,
                codigosTallas,
                cantidadesRollos,
                usuario
            });

            mostrarSnackbar(
                'El cálculo fue registrado correctamente.',
                'success'
            );

            limpiarCalculo();

        } catch (error) {

            console.error(error);

            mostrarSnackbar(
                error?.response?.data?.message ||
                'No fue posible registrar el cálculo.',
                'error'
            );

        } finally {

            setGuardando(false);

        }

    }


    /* =========================================================
       LIMPIAR
       ========================================================= */

    /*
      Limpia la selección, las cantidades y los errores del cálculo.
    */
    function limpiarCalculo() {

        setMolinetesSeleccionados([]);
        setTallasSeleccionadas([]);
        setCalculo({});
        setErroresTallas({});

    }


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
                        Consultando molinetes y tallas.
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

                    <h1>
                        Registrar Calculo
                    </h1>

                    <p>
                        Seleccione los molinetes y las tallas
                        que harán parte del calculo.
                    </p>

                </div>


                <div className="nuevo-tigimoli-date">

                    <CalendarTodayOutlinedIcon />

                    <span>
                        {new Date().toLocaleDateString(
                            'es-CO'
                        )}
                    </span>

                </div>

            </header>

            <NuevoTigimoliForm
                molinetes={molinetes}
                tallas={tallas}
                molinetesSeleccionados={molinetesSeleccionados}
                tallasSeleccionadas={tallasSeleccionadas}
                Calculo={Calculo}
                erroresTallas={erroresTallas}
                totalRollos={totalRollos}
                totalMetros={totalMetros}
                onCambiarMolinete={cambiarMolinete}
                onCambiarTalla={cambiarTalla}
                onCambiarRollos={cambiarRollos}
                onAgregarRollo={agregarRollo}
                formatearNumero={formatearNumero}
            />

            <NuevoTigimoliResultados
                molinetesCalculo={molinetesCalculo}
                totalMetros={totalMetros}
                calcularTiempoGiro={calcularTiempoGiro}
                formatearNumero={formatearNumero}
            />


            {/* =================================================
                ACCIONES
                ================================================= */}

            <footer className="nuevo-tigimoli-actions">

                <button
                    type="button"
                    className="secondary-action"
                    onClick={limpiarCalculo}
                    disabled={guardando}
                >
                    Limpiar datos
                </button>


                <button
                    type="button"
                    className="primary-action"
                    onClick={guardarCalculo}
                    disabled={
                        guardando ||
                        !calculoValido
                    }
                >

                    <SaveOutlinedIcon />

                    {guardando
                        ? 'Guardando...'
                        : 'Guardar Calculo'}

                </button>

            </footer>


            {/* =================================================
                SNACKBAR
                ================================================= */}

            <Snackbar
                open={Boolean(snackbar.message)}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({
                        message: '',
                        type: 'success'
                    })
                }
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >

                <Alert
                    severity={snackbar.type}
                    variant="filled"
                    onClose={() =>
                        setSnackbar({
                            message: '',
                            type: 'success'
                        })
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </div>

    );

}


export default NuevoTigimoliPage;
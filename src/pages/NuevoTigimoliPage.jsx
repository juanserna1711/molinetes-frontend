import { useEffect, useMemo, useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import '../styles/nuevoTigimoli.css';

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

    async function guardarCalculo() {

        if (!validarCalculo()) {
            return;
        }


        try {

            setGuardando(true);


            for (
                const molinete
                of molinetesCalculo
            ) {

                for (
                    const talla
                    of Calculo
                ) {

                    await crearTigimoli({

                        codMoli:
                            molinete.codigo,

                        codTalla:
                            talla.codigo,

                        rollos:
                            Number(talla.rollos),

                        usuario

                    });

                }

            }


            mostrarSnackbar(
                'El Calculo fue registrada correctamente.',
                'success'
            );


            limpiarCalculo();


        } catch (error) {

            console.error(error);

            mostrarSnackbar(
                error?.response?.data?.message ||
                'No fue posible registrar el calculo.',
                'error'
            );

        } finally {

            setGuardando(false);

        }

    }


    /* =========================================================
       LIMPIAR
       ========================================================= */

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

        <div className="nuevo-tigimoli-page">


            {/* =================================================
                CABECERA
                ================================================= */}

            <header className="nuevo-tigimoli-header">

                <div>

                    <span className="nuevo-tigimoli-overline">
                        CONFIGURACIÓN
                    </span>

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


            {/* =================================================
                01. MOLINETES
                ================================================= */}

            <section className="nuevo-tigimoli-section">

                <div className="nuevo-tigimoli-section-header">

                    <div>

                        <span className="section-overline">
                            01 · MOLINETES
                        </span>

                        <h2>
                            Seleccione los molinetes
                        </h2>

                        <p>
                            La configuración seleccionada se aplicará
                            a cada molinete.
                        </p>

                    </div>


                    <span className="selection-counter">

                        {molinetesSeleccionados.length}
                        {' '}
                        seleccionados

                    </span>

                </div>


                <div className="molinetes-selector">

                    {molinetes.map((molinete) => {

                        const seleccionado =
                            molinetesSeleccionados.includes(
                                molinete.codigo
                            );

                        return (

                            <label
                                key={molinete.codigo}
                                className={`molinete-card ${
                                    seleccionado
                                        ? 'selected'
                                        : ''
                                }`}
                            >

                                <input
                                    type="checkbox"
                                    checked={seleccionado}
                                    onChange={() =>
                                        cambiarMolinete(
                                            molinete.codigo
                                        )
                                    }
                                />


                                <span className="molinete-check">
                                    <span />
                                </span>


                                <span className="molinete-card-icon">

                                    <PrecisionManufacturingOutlinedIcon />

                                </span>


                                <span className="molinete-card-info">

                                    <strong>
                                        {molinete.nombre}
                                    </strong>

                                    <span>
                                        {molinete.rpm}
                                        {' '}RPM
                                        {' · '}
                                        {molinete.perimetro}
                                        {' '}cm
                                    </span>

                                </span>

                            </label>

                        );

                    })}

                </div>

            </section>


            {/* =================================================
                02. CALCULO
                ================================================= */}

            <section className="nuevo-tigimoli-section">

                <div className="nuevo-tigimoli-section-header">

                    <div>

                        <span className="section-overline">
                            02 · CALCULO
                        </span>

                        <h2>
                            Configuración de tallas
                        </h2>

                        <p>
                            Seleccione las tallas y registre la
                            cantidad de rollos para cada una.
                        </p>

                    </div>

                </div>


                <div className="calculo-config-grid">


                    {/* =================================================
                        TALLAS
                        ================================================= */}

                    <div className="tallas-panel">

                        <span className="panel-label">
                            Tallas a utilizar
                        </span>


                        <div className="tallas-selector">

                            {tallas.map((talla) => {

                                const seleccionada =
                                    tallasSeleccionadas.includes(
                                        talla.codigo
                                    );

                                return (

                                    <button
                                        key={talla.codigo}
                                        type="button"
                                        className={`talla-option ${
                                            seleccionada
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            cambiarTalla(
                                                talla.codigo
                                            )
                                        }
                                    >

                                        {talla.nombre}

                                    </button>

                                );

                            })}

                        </div>

                    </div>


                    {/* =================================================
                        TABLA
                        ================================================= */}

                    <div className="calculo-table-panel">

                        <span className="panel-label">
                            Detalle del Calculo
                        </span>


                        {Calculo.length === 0 ? (

                            <div className="empty-calculo">

                                Seleccione las tallas que harán
                                parte del Calculo.

                            </div>

                        ) : (

                            <div className="calculo-table-wrapper">

                                <table className="calculo-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Talla
                                            </th>

                                            <th>
                                                Rollos
                                            </th>

                                            <th>
                                                Metros
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {Calculo.map(
                                            (talla) => (

                                                <tr
                                                    key={
                                                        talla.codigo
                                                    }
                                                >

                                                    <td className="calculo-size">

                                                        {talla.nombre}

                                                    </td>


                                                    <td>

                                                        <div className="rollos-field">

                                                            <div className="rollos-input">

                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="9999"
                                                                    value={talla.rollos}
                                                                    className={
                                                                        erroresTallas[talla.codigo]
                                                                            ? 'input-error'
                                                                            : ''
                                                                    }
                                                                    onChange={(event) => {
                                                                        const valor = event.target.value;

                                                                        if (valor.length <= 4) {
                                                                            cambiarRollos(
                                                                                talla.codigo,
                                                                                valor
                                                                            );
                                                                        }
                                                                    }}
                                                                />


                                                                <button
                                                                    type="button"
                                                                    title="Agregar rollo"
                                                                    onClick={() =>
                                                                        agregarRollo(
                                                                            talla.codigo
                                                                        )
                                                                    }
                                                                >

                                                                    <AddOutlinedIcon />

                                                                </button>

                                                            </div>


                                                            {erroresTallas[
                                                                talla.codigo
                                                            ] && (

                                                                <span className="field-error">
                                                                    Ingrese una cantidad mayor que 0
                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>


                                                    <td className="calculo-meters">

                                                        {formatearNumero(
                                                            talla.metros
                                                        )}
                                                        {' '}m

                                                    </td>

                                                </tr>

                                            )
                                        )}


                                        <tr className="calculo-total-row">

                                            <td>
                                                Total
                                            </td>

                                            <td>
                                                {totalRollos}
                                            </td>

                                            <td>
                                                {formatearNumero(
                                                    totalMetros
                                                )}
                                                {' '}m
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                03. RESULTADOS
                ================================================= */}

            <section className="nuevo-tigimoli-section">

                <div className="nuevo-tigimoli-section-header">

                    <div>

                        <span className="section-overline">
                            03 · RESULTADO
                        </span>

                        <h2>
                            Calculo por molinete
                        </h2>

                        <p>
                            El tiempo de giro se calcula individualmente
                            según el RPM y perímetro de cada molinete.
                        </p>

                    </div>

                </div>


                {molinetesCalculo.length === 0 ? (

                    <div className="empty-results">

                        <PrecisionManufacturingOutlinedIcon />

                        <strong>
                            Seleccione uno o varios molinetes
                        </strong>

                        <span>
                            Aquí aparecerá el cálculo correspondiente
                            a cada molinete.
                        </span>

                    </div>

                ) : (

                    <div className="result-molinetes-grid">

                        {molinetesCalculo.map(
                            (molinete) => {

                                const tiempoGiro =
                                    calcularTiempoGiro(
                                        molinete
                                    );

                                return (

                                    <article
                                        key={
                                            molinete.codigo
                                        }
                                        className={`molinete-result-card ${
                                            molinetesCalculo.length === 1
                                                ? 'single'
                                                : ''
                                        }`}
                                    >


                                        {/* CABECERA */}

                                        <div className="result-card-header">

                                            <div className="result-molinete-title">

                                                <span className="result-molinete-icon">

                                                    <PrecisionManufacturingOutlinedIcon />

                                                </span>


                                                <div>

                                                    <span>
                                                        MOLINETE
                                                    </span>

                                                    <h3>
                                                        {molinete.nombre}
                                                    </h3>

                                                </div>

                                            </div>

                                        </div>


                                        {/* DATOS */}

                                        <div className="result-machine-data">


                                            <div>

                                                <span>
                                                    RPM
                                                </span>

                                                <strong>
                                                    {molinete.rpm}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Perímetro
                                                </span>

                                                <strong>
                                                    {molinete.perimetro}
                                                    {' '}cm
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Total metros
                                                </span>

                                                <strong>
                                                    {formatearNumero(
                                                        totalMetros
                                                    )}
                                                    {' '}m
                                                </strong>

                                            </div>


                                        </div>


                                        {/* TIEMPO */}

                                        <div className="result-time-box">

                                            <AccessTimeOutlinedIcon />

                                            <div>

                                                <span>
                                                    Tiempo de giro
                                                </span>

                                                <strong>
                                                    {formatearNumero(
                                                        tiempoGiro
                                                    )}
                                                    {' '}min
                                                </strong>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


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
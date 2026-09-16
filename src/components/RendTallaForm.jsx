import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

function RendTallaForm({
    onClose,
    onSubmit,
    rendtalla,
    rendtallas
}) {

    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /*
     * Si rendtalla tiene información de rendimiento,
     * estamos editando.
     *
     * Si rendtalla existe pero no tiene rendimiento,
     * estamos agregando uno nuevo.
     *
     * Si rendtalla es null, el formulario inicia vacío.
     */
    const tieneRendimientoInicial =
        rendtalla?.ancho !== null &&
        rendtalla?.ancho !== undefined;

    const [modo, setModo] = useState(
        tieneRendimientoInicial ? 'editar' : 'crear'
    );

    const [formData, setFormData] = useState({
        codTalla: rendtalla?.codigo ?? '',
        anchoRendtall: rendtalla?.ancho ?? '',
        pesoRendtall: rendtalla?.pesoM2 ?? '',
        rolloRendtall: rendtalla?.pesoRollo ?? '',
        usuarioRendtall: 2
    });


    // =========================================================
    // CÁLCULOS
    // =========================================================

    const ancho = Number(formData.anchoRendtall);
    const peso = Number(formData.pesoRendtall);
    const rollo = Number(formData.rolloRendtall);

    const rendimiento =
        ancho > 0 && peso > 0
            ? 1000 / ((ancho * 2 / 100) * peso)
            : 0;

    const metrosRollo =
        rendimiento > 0 && rollo > 0
            ? rollo * rendimiento
            : 0;


    // =========================================================
    // CARGAR FORMULARIO CUANDO CAMBIA LA TALLA
    // =========================================================

    useEffect(() => {

        const tieneRendimiento =
            rendtalla?.ancho !== null &&
            rendtalla?.ancho !== undefined;

        setModo(
            tieneRendimiento ? 'editar' : 'crear'
        );

        setFormData({
            codTalla: rendtalla?.codigo ?? '',
            anchoRendtall: rendtalla?.ancho ?? '',
            pesoRendtall: rendtalla?.pesoM2 ?? '',
            rolloRendtall: rendtalla?.pesoRollo ?? '',
            usuarioRendtall: 2
        });

        setError(null);
        setFieldErrors({});

    }, [rendtalla]);


    // =========================================================
    // SELECCIONAR TALLA
    // =========================================================

    function handleTallaChange(event) {

        const codigo = event.target.value;

        if (!codigo) {

            setFormData({
                codTalla: '',
                anchoRendtall: '',
                pesoRendtall: '',
                rolloRendtall: '',
                usuarioRendtall: 2
            });

            setModo('crear');
            setFieldErrors({});
            setError(null);

            return;
        }

        const tallaSeleccionada = rendtallas.find(
            (talla) =>
                String(talla.codigo) === String(codigo)
        );

        if (!tallaSeleccionada) {
            return;
        }

        const tieneRendimiento =
            tallaSeleccionada.ancho !== null &&
            tallaSeleccionada.ancho !== undefined;

        setFormData({
            codTalla: tallaSeleccionada.codigo,
            anchoRendtall: tallaSeleccionada.ancho ?? '',
            pesoRendtall: tallaSeleccionada.pesoM2 ?? '',
            rolloRendtall: tallaSeleccionada.pesoRollo ?? '',
            usuarioRendtall: 2
        });

        setModo(
            tieneRendimiento ? 'editar' : 'crear'
        );

        setFieldErrors({});
        setError(null);
    }


    // =========================================================
    // CAMBIAR CAMPOS
    // =========================================================

    function handleChange(event) {

        const { name, value } = event.target;

        /*
         * Los campos de rendimiento solamente permiten
         * números y máximo 4 caracteres.
         */
        if (
            ['anchoRendtall', 'pesoRendtall', 'rolloRendtall']
                .includes(name) &&
            value.length > 4
        ) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setFieldErrors(prev => ({
            ...prev,
            [name]: null
        }));

        setError(null);
    }


    // =========================================================
    // ENVIAR FORMULARIO
    // =========================================================

    async function handleSubmit(event) {

        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const data = {
            codTalla: Number(formData.codTalla),
            anchoRendtall: Number(formData.anchoRendtall),
            pesoRendtall: Number(formData.pesoRendtall),
            rolloRendtall: Number(formData.rolloRendtall),
            usuarioRendtall: Number(formData.usuarioRendtall)
        };

        try {

            setLoading(true);
            setError(null);
            setFieldErrors({});

            /*
             * Mandamos también el modo a la página.
             *
             * La página decide si llama:
             * crearRendTalla()
             * o
             * actualizarRendTalla()
             */
            await onSubmit(data, modo);

        } catch (error) {

            console.error(error);

            const mensaje =
                error.response?.data?.message ||
                'No fue posible guardar el rendimiento x talla.';

            const campo =
                error.response?.data?.field;

            if (campo) {

                setFieldErrors({
                    [campo]: mensaje
                });

                setError(null);

            } else {

                setError(mensaje);

            }

        } finally {

            setLoading(false);

        }
    }


    // =========================================================
    // VALIDACIONES
    // =========================================================

    function validarFormulario() {

        const errores = {};

        if (!formData.codTalla) {
            errores.codTalla = 'Selecciona una talla.';
        }

        if (!formData.anchoRendtall) {
            errores.anchoRendtall = 'Completa este campo.';
        }

        if (!formData.pesoRendtall) {
            errores.pesoRendtall = 'Completa este campo.';
        }

        if (!formData.rolloRendtall) {
            errores.rolloRendtall = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="form-panel">

            <div className="form-header">

                <h2>
                    {modo === 'editar'
                        ? 'Editar Rendimiento'
                        : 'Nuevo Rendimiento'
                    }
                </h2>

                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    title="Cerrar"
                >
                    <CloseOutlinedIcon />
                </button>

            </div>


            <form onSubmit={handleSubmit}>

                {/* =================================================
                    TALLA
                ================================================= */}

                <div className="form-group">

                    <label>
                        Talla
                    </label>

                    <select
                        name="codTalla"
                        value={formData.codTalla}
                        onChange={handleTallaChange}
                        disabled={Boolean(rendtalla)}
                        className={
                            fieldErrors.codTalla
                                ? 'input-error'
                                : ''
                        }
                    >

                        <option value="">
                            Seleccione una talla
                        </option>

                        {rendtallas.map((talla) => (

                            <option
                                key={talla.codigo}
                                value={talla.codigo}
                            >
                                {talla.nombre}
                            </option>

                        ))}

                    </select>

                    {fieldErrors.codTalla && (
                        <span className="field-error">
                            {fieldErrors.codTalla}
                        </span>
                    )}

                </div>


                {/* =================================================
                    ANCHO
                ================================================= */}

                <div className="form-group">

                    <label>
                        Ancho
                    </label>

                    <input
                        type="number"
                        step="1"
                        name="anchoRendtall"
                        value={formData.anchoRendtall}
                        onChange={handleChange}
                        className={
                            fieldErrors.anchoRendtall
                                ? 'input-error'
                                : ''
                        }
                    />

                    {fieldErrors.anchoRendtall && (
                        <span className="field-error">
                            {fieldErrors.anchoRendtall}
                        </span>
                    )}

                </div>


                {/* =================================================
                    PESO/M2
                ================================================= */}

                <div className="form-group">

                    <label>
                        Peso/M2
                    </label>

                    <input
                        type="number"
                        step="1"
                        name="pesoRendtall"
                        value={formData.pesoRendtall}
                        onChange={handleChange}
                        className={
                            fieldErrors.pesoRendtall
                                ? 'input-error'
                                : ''
                        }
                    />

                    {fieldErrors.pesoRendtall && (
                        <span className="field-error">
                            {fieldErrors.pesoRendtall}
                        </span>
                    )}

                </div>


                {/* =================================================
                    PESO/ROLLO
                ================================================= */}

                <div className="form-group">

                    <label>
                        Peso/Rollo
                    </label>

                    <input
                        type="number"
                        step="1"
                        name="rolloRendtall"
                        value={formData.rolloRendtall}
                        onChange={handleChange}
                        className={
                            fieldErrors.rolloRendtall
                                ? 'input-error'
                                : ''
                        }
                    />

                    {fieldErrors.rolloRendtall && (
                        <span className="field-error">
                            {fieldErrors.rolloRendtall}
                        </span>
                    )}

                </div>


                {/* =================================================
                    RENDIMIENTO
                ================================================= */}

                <div className="form-group calculated-group">

                    <label>
                        Rendimiento
                    </label>

                    <input
                        type="text"
                        value={
                            rendimiento > 0
                                ? rendimiento.toFixed(1)
                                : ''
                        }
                        readOnly
                    />

                </div>


                {/* =================================================
                    METROS/ROLLO
                ================================================= */}

                <div className="form-group calculated-group">

                    <label>
                        Metros/Rollo
                    </label>

                    <input
                        type="text"
                        value={
                            metrosRollo > 0
                                ? metrosRollo.toFixed(1)
                                : ''
                        }
                        readOnly
                    />

                </div>


                {/* =================================================
                    ERROR GENERAL
                ================================================= */}

                {error && (

                    <div
                        className="form-error"
                        role="alert"
                    >

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">

                            <span className="form-error-title">
                                No fue posible guardar el rendimiento x talla
                            </span>

                            <span className="form-error-message">
                                {error}
                            </span>

                        </div>

                    </div>

                )}


                {/* =================================================
                    BOTONES
                ================================================= */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="save-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <CircularProgress
                                    size={16}
                                    thickness={4}
                                />

                                Guardando...
                            </>

                        ) : (

                            modo === 'editar'
                                ? 'Actualizar'
                                : 'Guardar'

                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default RendTallaForm;
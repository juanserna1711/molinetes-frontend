/*=============================================================================
  Nombre responsabilidad: Capturar promedios por tipo de hilaza y talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Selecciona un tipo de hilaza y una talla y permite crear o editar
  su información de peso y ancho.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { consultarTiHiProm } from '../../services/tihiprom.service';

function TiHiPromForm({ onClose, onSubmit, tihiprom, tiposHilaza, tallas }) {

    const [combinacionDuplicada, setCombinacionDuplicada] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    /*
      Si tihiprom existe estamos editando.
      Si tihiprom es null estamos creando un nuevo registro.
    */
    const modo = tihiprom ? 'editar' : 'crear';
    const [formData, setFormData] = useState({
        codTipoHilaza: tihiprom?.codigoTipoHilaza ?? '',
        codTalla: tihiprom?.codigoTalla ?? '',
        pesoTiHiProm: tihiprom?.peso ?? '',
        anchoTiHiProm: tihiprom?.ancho ?? '',
        usuarioTiHiProm: 4
    });

    // Comprueba la pareja hilaza-talla tras 500 ms; en edición conserva la identidad del registro.
    useEffect(() => {

        const codTipoHilaza = formData.codTipoHilaza;
        const codTalla = formData.codTalla;

        if (!codTipoHilaza ||!codTalla || modo === 'editar') {
            return;
        }

        const temporizador = setTimeout(async () => {

            try {

                const response = await consultarTiHiProm({
                    tipoHilaza: Number(codTipoHilaza),
                    talla: Number(codTalla)
                });

                const existe = response.data?.length > 0;

                setCombinacionDuplicada(existe);

            } catch (error) {

                console.error('Error verificando combinación:', error);

            }

        }, 500);


        return () => clearTimeout(temporizador);

    }, [formData.codTipoHilaza, formData.codTalla, modo]);

    // Actualiza los datos del formulario y limpia los errores del campo.
    function handleChange(event) {

        const { name, value } = event.target;

        // Limita peso y ancho a cuatro caracteres; el tipo y las restricciones de captura están en los inputs.
        if (['pesoTiHiProm', 'anchoTiHiProm'].includes(name) && value.length > 4) {
            return;
        }

        if (['codTipoHilaza', 'codTalla'].includes(name)) {
            setCombinacionDuplicada(false);
        }

        setFormData(prev => ({...prev, [name]: value}));
        setFieldErrors(prev => ({...prev, [name]: null}));
        setError(null);
    }

    // Valida el formulario, solicita el guardado y muestra los errores recibidos.
    async function handleSubmit(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        if (combinacionDuplicada) {
            return;
        }

        // Convierte identificadores, medidas y usuario antes de delegar en la página según modo.
        const data = {
            codTipoHilaza: Number(formData.codTipoHilaza),
            codTalla: Number(formData.codTalla),
            pesoTiHiProm: Number(formData.pesoTiHiProm),
            anchoTiHiProm: Number(formData.anchoTiHiProm),
            usuarioTiHiProm: Number(formData.usuarioTiHiProm)
        };

        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            await onSubmit(data, modo);//Mandamos también el modo a la página.
            //La página decide si llama: crearTiHiProm() o actualizarTiHiProm()

        } catch (error) {

            console.error(error);

            const mensaje = error.response?.data?.message || 'No fue posible guardar el promedio por tipo de hilaza.';

            const campo = error.response?.data?.field;

            // Los errores con field se asocian al control; el resto se muestra como error del formulario.
            if (campo) {
                
                setFieldErrors({[campo]: mensaje});
                setError(null);

            } else {

                setError(mensaje);

            }
        } finally {
            setLoading(false);
        }
    }
    // Comprueba los campos obligatorios e identifica los errores de captura.
    function validarFormulario() {

        const errores = {};

        if (!formData.codTipoHilaza) {
            errores.codTipoHilaza = 'Selecciona un tipo de hilaza.';
        }

        if (!formData.codTalla) {
            errores.codTalla = 'Selecciona una talla.';
        }


        if (!formData.pesoTiHiProm) {
            errores.pesoTiHiProm = 'Completa este campo.';
        }

        if (!formData.anchoTiHiProm) {
            errores.anchoTiHiProm = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }
    return (

        <div className="form-panel">

            <div className="form-header">

                <h2>{modo === 'editar' ? 'Editar Promedio': 'Nuevo Promedio'}</h2>

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

                <div className="form-group">

                    <label>Tipo de Hilaza</label>

                    <select
                        name="codTipoHilaza"
                        value={formData.codTipoHilaza}
                        onChange={handleChange}
                        disabled={modo === 'editar'}
                        className={`${modo === 'editar' ? 'input-readonly' : ''} ${combinacionDuplicada || fieldErrors.codTipoHilaza ? 'input-error' : ''}`}
                    >

                        <option value=""> Seleccione </option>

                        {tiposHilaza.map((tipoHilaza) => (

                            <option
                                key={tipoHilaza.codigo}
                                value={tipoHilaza.codigo}
                            >
                                {tipoHilaza.nombre}
                            </option>
                        ))}
                    </select>


                    {fieldErrors.codTipoHilaza && !combinacionDuplicada && (
                        <span className="field-error">
                            {fieldErrors.codTipoHilaza}
                        </span>
                    )}
                </div>

                <div className="form-group">

                    <label>Talla</label>

                    <select
                        name="codTalla"
                        value={formData.codTalla}
                        onChange={handleChange}
                        disabled={modo === 'editar'}
                        className={`${modo === 'editar' ? 'input-readonly' : ''} ${combinacionDuplicada || fieldErrors.codTalla ? 'input-error' : ''}`}
                    >

                        <option value="">Seleccione</option>

                        {tallas.map((talla) => (

                            <option
                                key={talla.codigo}
                                value={talla.codigo}
                            >
                                {talla.nombre}
                            </option>

                        ))}

                    </select>

                    {(combinacionDuplicada || fieldErrors.codTalla) && (

                        <span className="field-error">
                            {combinacionDuplicada ? 'El tipo de hilaza ya tiene información asociada para esta talla.' : fieldErrors.codTalla}
                        </span>

                    )}

                </div>

                <div className="form-group">

                    <label>Peso</label>

                    <input
                        type="number"
                        min="1"
                        step="1"
                        name="pesoTiHiProm"
                        value={formData.pesoTiHiProm}
                        onChange={handleChange}
                        onKeyDown={(event) => {
                            if (['-', '+', 'e', 'E', '.', ','].includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        className={fieldErrors.pesoTiHiProm ? 'input-error' : ''}
                    />

                    {fieldErrors.pesoTiHiProm && (
                        <span className="field-error">
                            {fieldErrors.pesoTiHiProm}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Ancho
                    </label>


                    <input
                        type="number"
                        min="1"
                        step="1"
                        name="anchoTiHiProm"
                        value={formData.anchoTiHiProm}
                        onChange={handleChange}
                        onKeyDown={(event) => {
                            if (['-', '+', 'e', 'E', '.', ','].includes(event.key)) {
                                event.preventDefault();
                            }

                        }}
                        className={fieldErrors.anchoTiHiProm ? 'input-error' : ''}
                    />

                    {fieldErrors.anchoTiHiProm && (
                        <span className="field-error">
                            {fieldErrors.anchoTiHiProm}
                        </span>

                    )}

                </div>

                {error && (

                    <div
                        className="form-error"
                        role="alert"
                    >

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">

                            <span className="form-error-title">
                                No fue posible guardar el promedio
                            </span>

                            <span className="form-error-message">
                                {error}
                            </span>

                        </div>

                    </div>

                )}

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
                        disabled={loading || combinacionDuplicada}
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

                            modo === 'editar' ? 'Actualizar' : 'Guardar'

                        )}

                    </button>

                </div>

            </form>

        </div>

    );

}

export default TiHiPromForm;
/*=============================================================================
  Nombre responsabilidad: Capturar los datos de talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Gestiona el formulario de creación/edición y sus errores de campo y de envío.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { consultarTallas } from '../services/tallas.service';

function TallaForm({ onClose, onSubmit, talla }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        codTalla: talla?.codigo ?? '',
        nomTalla: talla?.nombre ?? '',
        estaTalla: talla?.estado ?? 'A'
    });

    useEffect(() => {

        const codigo = formData.codTalla;

        if (!codigo || talla) {
            setCodigoDuplicado(false);
            return;
        }

        const temporizador = setTimeout(async () => {

            try {

                const response = await consultarTallas({
                    codigo: Number(codigo)
                });

                const existe = response.data?.length > 0;

                setCodigoDuplicado(existe);

            } catch (error) {

                console.error('Error verificando código:', error);

            }

        }, 500);

        return () => clearTimeout(temporizador);

    }, [formData.codTalla, talla]);

    useEffect(() => {
        setFormData({
            codTalla: talla?.codigo ?? '',
            nomTalla: talla?.nombre?.toUpperCase() ?? '',
            estaTalla: talla?.estado ?? 'A'
        });

        setError(null);
        setFieldErrors({});
        setCodigoDuplicado(false);
    }, [talla]);


    /*
      Actualiza los datos del formulario y limpia los errores del campo.
    */
    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codTalla' && value.length > 3) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'nomTalla'
                ? value.toUpperCase()
                : value
        }));

        setFieldErrors(prev => ({
            ...prev,
            [name]: null
        }));

        setError(null);
    }
    
    /*
      Valida el formulario, solicita el guardado y muestra los errores recibidos.
    */
    async function handleSubmit(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        if (codigoDuplicado) {
            return;
        }


        const data = {
            ...formData,
            codTalla: Number(formData.codTalla)
        };

        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            await onSubmit(data);

        } catch (error) {

            console.error(error);

            const mensaje =
                error.response?.data?.message ||
                'No fue posible guardar la talla.';

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
    /*
      Comprueba los campos obligatorios e identifica los errores de captura.
    */
    function validarFormulario() {

        const errores = {};

        if (!formData.codTalla) {
            errores.codTalla = 'Completa este campo.';
        }

        if (!formData.nomTalla.trim()) {
            errores.nomTalla = 'Completa este campo.';
        }

        if (!formData.estaTalla) {
            errores.estaTalla = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }
    return (

        <div className="form-panel">

            <div className="form-header">

            <h2>{talla ? 'Editar Talla' : 'Crear Talla'}</h2>

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

                    <label>
                        Código Talla
                    </label>

                    <input
                        type="number"
                        name="codTalla"
                        value={formData.codTalla}
                        onChange={handleChange}
                        min={1}
                        max={999}
                        disabled={Boolean(talla)}
                        className={`
                            ${talla ? 'input-readonly' : ''}
                            ${codigoDuplicado || fieldErrors.codTalla ? 'input-error' : ''}
                        `}
                    />

                    {(codigoDuplicado || fieldErrors.codTalla) && (
                        <span className="field-error">
                            {codigoDuplicado
                                ? 'El código de talla ya existe.'
                                : fieldErrors.codTalla}
                        </span>
                    )}
                </div>

                <div className="form-group">

                    <label>
                        Nombre Talla
                    </label>

                    <input
                        type="text"
                        name="nomTalla"
                        value={formData.nomTalla}
                        onChange={handleChange}
                        maxLength={60}
                        className={fieldErrors.nomTalla ? 'input-error' : ''}
                    />

                    {fieldErrors.nomTalla && (
                        <span className="field-error">
                            {fieldErrors.nomTalla}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        name="estaTalla"
                        value={formData.estaTalla}
                        onChange={handleChange}
                        className={fieldErrors.estaTalla ? 'input-error' : ''}
                    >
                        <option value="A">
                            Activo
                        </option>

                        <option value="I">
                            Inactivo
                        </option>
                    </select>

                    {fieldErrors.estaTalla && (
                        <span className="field-error">
                            {fieldErrors.estaTalla}
                        </span>
                    )}

                </div>

                {error && (
                    <div className="form-error" role="alert">

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">
                            <span className="form-error-title">
                                No fue posible guardar la talla
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
                        disabled={loading || codigoDuplicado}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={16} thickness={4} />
                                Guardando...
                            </>
                        ) : (
                            talla ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default TallaForm;
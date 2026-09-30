/*=============================================================================
  Nombre responsabilidad: Capturar los datos de tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

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
import { consultarTiposHilaza } from '../../services/tipohilaza.service';

function TipoHilazaForm({ onClose, onSubmit, tipoHilaza }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        codTipoHilaza: tipoHilaza?.codigo ?? '',
        nomTipoHilaza: tipoHilaza?.nombre.toUpperCase() ?? ''
    });

    useEffect(() => {

        const codigo = formData.codTipoHilaza;

        if (!codigo || tipoHilaza) {
            return;
        }

        const temporizador = setTimeout(async () => {

            try {

                const response = await consultarTiposHilaza({
                        codigo: Number(codigo)
                    });

                const existe = response.data?.length > 0;

                setCodigoDuplicado(existe);

            } catch (error) {

                console.error(
                    'Error verificando código:',
                    error
                );

            }

        }, 500);

        return () => clearTimeout(temporizador);

    }, [formData.codTipoHilaza, tipoHilaza]);

    /*
      Actualiza los datos del formulario y limpia los errores del campo.
    */
    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codTipoHilaza' && value.length > 3) {
            return;
        }

        if (name === 'codHilaza') {
            setCodigoDuplicado(false);
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'nomTipoHilaza'
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
            codTipoHilaza:
                Number(formData.codTipoHilaza)
        };

        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            await onSubmit(data);

        } catch (error) {

            console.error(error);

            const mensaje = error.response?.data?.message || 'No fue posible guardar el tipo de hilaza.';
            const campo = error.response?.data?.field;

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

        if (!formData.codTipoHilaza) {
            errores.codTipoHilaza =
                'Completa este campo.';
        }

        if (!formData.nomTipoHilaza.trim()) {
            errores.nomTipoHilaza =
                'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;

    }


    return (

        <div className="form-panel">

            <div className="form-header">

                <h2>{tipoHilaza ? 'Editar Tipo de Hilaza' : 'Crear Tipo de Hilaza'}</h2>

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

                    <label>Código Tipo de Hilaza</label>

                    <input
                        type="number"
                        name="codTipoHilaza"
                        value={formData.codTipoHilaza}
                        onChange={handleChange}
                        min={1}
                        max={999}
                        disabled={Boolean(tipoHilaza)}
                        className={`${tipoHilaza ? 'input-readonly' : ''} ${codigoDuplicado || fieldErrors.codTipoHilaza ? 'input-error' : ''}`}
                    />

                    {(codigoDuplicado || fieldErrors.codTipoHilaza) && (

                        <span className="field-error">
                            {codigoDuplicado ? 'El código de tipo de hilaza ya existe.' : fieldErrors.codTipoHilaza}
                        </span>
                    )}
                </div>

                <div className="form-group">

                    <label>Nombre Tipo de Hilaza</label>

                    <input
                        type="text"
                        name="nomTipoHilaza"
                        value={formData.nomTipoHilaza}
                        onChange={handleChange}
                        maxLength={60}
                        className={fieldErrors.nomTipoHilaza ? 'input-error' : ''}
                    />

                    {fieldErrors.nomTipoHilaza && (
                        <span className="field-error">
                            {fieldErrors.nomTipoHilaza}
                        </span>
                    )}

                </div>


                {error && (

                    <div className="form-error" role="alert">
                        
                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">
                            <span className="form-error-title">
                                No fue posible guardar el tipo de hilaza
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

                            tipoHilaza ? 'Actualizar' : 'Guardar'

                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default TipoHilazaForm;
/*=============================================================================
  Nombre responsabilidad: Capturar los datos de molinete

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

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
import { consultarMolinetes } from '../services/molinetes.service';

function MolineteForm({ onClose, onSubmit, molinete }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        codMolinete: molinete?.codigo ?? '',
        nomMolinete: molinete?.nombre ?? '',
        rpmMolinete: molinete?.rpm ?? '',
        periMolinete: molinete?.perimetro ?? ''
    });

    useEffect(() => {
    
            const codigo = formData.codMolinete;
    
            if (!codigo || molinete) {
                setCodigoDuplicado(false);
                return;
            }
    
            const temporizador = setTimeout(async () => {
    
                try {
    
                    const response = await consultarMolinetes({
                        codigo: Number(codigo)
                    });
    
                    const existe = response.data?.length > 0;
    
                    setCodigoDuplicado(existe);
    
                } catch (error) {
    
                    console.error('Error verificando código:', error);
    
                }
    
            }, 500);
    
            return () => clearTimeout(temporizador);
    
    }, [formData.codMolinete, molinete]);

    useEffect(() => {
        setFormData({
            codMolinete: molinete?.codigo ?? '',
            nomMolinete: molinete?.nombre.toUpperCase() ?? '',
            rpmMolinete: molinete?.rpm ?? '',
            periMolinete: molinete?.perimetro ?? ''
        });

        setError(null);
        setFieldErrors({});
        setCodigoDuplicado(false);
    }, [molinete]);


    /*
      Actualiza los datos del formulario y limpia los errores del campo.
    */
    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codMolinete' && value.length > 3) {
            return;
        }
        if (
            ['rpmMolinete', 'periMolinete'].includes(name) &&
            value.length > 3
        ) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'nomMolinete'
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
            codMolinete: Number(formData.codMolinete)
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
                'No fue posible guardar el molinete.';

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

        if (!formData.codMolinete) {
            errores.codMolinete = 'Completa este campo.';
        }

        if (!formData.nomMolinete.trim()) {
            errores.nomMolinete = 'Completa este campo.';
        }

        if (!formData.rpmMolinete) {
            errores.rpmMolinete = 'Completa este campo.';
        }

        if (!formData.periMolinete) {
            errores.periMolinete = 'Completa este campo.';
        }


        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }
    return (

        <div className="form-panel">

            <div className="form-header">

            <h2>{molinete ? 'Editar Molinete' : 'Crear Molinete'}</h2>

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
                        Código Molinete
                    </label>

                <input
                    type="number"
                    name="codMolinete"
                    value={formData.codMolinete}
                    onChange={handleChange}
                    min={1}
                    max={999}
                    disabled={Boolean(molinete)}
                    className={`${molinete ? 'input-readonly' : ''} ${codigoDuplicado || fieldErrors.codMolinete ? 'input-error' : ''}`}
                />
                    {(codigoDuplicado || fieldErrors.codMolinete) && (
                        <span className="field-error">
                            {codigoDuplicado
                                ? 'El código de molinete ya existe.'
                                : fieldErrors.codMolinete}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Nombre Molinete
                    </label>

                    <input
                        type="text"
                        name="nomMolinete"
                        value={formData.nomMolinete}
                        onChange={handleChange}
                        maxLength={60}
                        className={fieldErrors.nomMolinete ? 'input-error' : ''}
                    />

                    {fieldErrors.nomMolinete && (
                        <span className="field-error">
                            {fieldErrors.nomMolinete}
                        </span>
                    )}


                </div>

                <div className="form-group">

                    <label>
                        RPM
                    </label>

                    <input
                        type="number"
                        step="any"
                        name="rpmMolinete"
                        value={formData.rpmMolinete}
                        onChange={handleChange}
                        className={fieldErrors.rpmMolinete ? 'input-error' : ''}
                    />

                    {fieldErrors.rpmMolinete && (
                        <span className="field-error">
                            {fieldErrors.rpmMolinete}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Perímetro
                    </label>

                    <input
                        type="number"
                        step="any"
                        name="periMolinete"
                        value={formData.periMolinete}
                        onChange={handleChange}
                        className={fieldErrors.periMolinete ? 'input-error' : ''}
                    />
                    {fieldErrors.periMolinete && (
                        <span className="field-error">
                            {fieldErrors.periMolinete}
                        </span>
                    )}

                </div>

                {error && (
                    <div className="form-error" role="alert">

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">
                            <span className="form-error-title">
                                No fue posible guardar el molinete
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
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={16} thickness={4} />
                                Guardando...
                            </>
                        ) : (
                            molinete ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default MolineteForm;
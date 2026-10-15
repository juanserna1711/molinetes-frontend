/*=============================================================================
  Nombre responsabilidad: Capturar los datos del módulo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

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
import { consultarModulos } from '../../services/modulos.service';

function ModuloForm({ onClose, onSubmit, modulo, zonas=[] }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        codModulo: modulo?.codigo ?? '',
        archModulo: modulo?.archivo ?? '',
        nomModulo: modulo?.nombre?.toUpperCase() ?? '',
        zonaModulo: modulo?.zona.toUpperCase() ?? '',
        ordeModulo: modulo?.orden ?? ''
    });


    // Espera 500 ms para consultar duplicados al crear; en edición el código original no se vuelve a comprobar.
    useEffect(() => {

        const codigo = formData.codModulo;

        if (!codigo || modulo) {
            return;
        }

        const temporizador = setTimeout(async () => {

            try {

                const response = await consultarModulos({
                    codigo: Number(codigo)
                });

                const existe = response.data?.length > 0;

                setCodigoDuplicado(existe);

            } catch (error) {

                console.error('Error verificando código:', error);

            }

        }, 500);

        return () => clearTimeout(temporizador);

    }, [formData.codModulo, modulo]);


    // Actualiza los datos del formulario y limpia los errores del campo.
    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codModulo' && value.length > 4) {
            return;
        }

        if (name === 'ordeModulo' && value.length > 4) {
            return;
        }

        if (name === 'codModulo') {
            setCodigoDuplicado(false);
        }

        let nuevoValor = value;

        if (name === 'nomModulo' || name === 'zonaModulo') {
            nuevoValor = value.toUpperCase();
        }

        setFormData(prev => ({...prev, [name]: nuevoValor}));
        setFieldErrors(prev => ({...prev, [name]: null}));
        setError(null);
    }


    // Valida el formulario, solicita el guardado y muestra los errores recibidos.
    async function handleSubmit(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        if (codigoDuplicado) {
            return;
        }

        // Convierte el identificador a número antes de delegar la persistencia en la página mediante onSubmit.
        const data = {...formData, codModulo: Number(formData.codModulo), ordeModulo: Number(formData.ordeModulo)};

        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            await onSubmit(data);

        } catch (error) {

            console.error(error);

            const mensaje = error.response?.data?.message || 'No fue posible guardar el módulo.';
            const campo = error.response?.data?.field;

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

        if (!formData.codModulo) {
            errores.codModulo = 'Completa este campo.';
        }

        if (!formData.archModulo.trim()) {
            errores.archModulo = 'Completa este campo.';
        }

        if (!formData.nomModulo.trim()) {
            errores.nomModulo = 'Completa este campo.';
        }

        if (!formData.zonaModulo) {
            errores.zonaModulo = 'Completa este campo.';
        }

        if (!formData.ordeModulo) {
            errores.ordeModulo = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }


    return (

        <div className="form-panel">

            <div className="form-header">

                <h2>{modulo ? 'Editar Módulo' : 'Crear Módulo'}</h2>

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
                        Código Módulo
                    </label>

                    <input
                        type="number"
                        name="codModulo"
                        value={formData.codModulo}
                        onChange={handleChange}
                        min={1}
                        max={9999}
                        disabled={Boolean(modulo)}
                        className={`${modulo ? 'input-readonly' : ''} ${codigoDuplicado || fieldErrors.codModulo ? 'input-error' : ''}`}
                    />

                    {(codigoDuplicado || fieldErrors.codModulo) && (
                        <span className="field-error">
                            {codigoDuplicado ? 'El código de módulo ya existe.' : fieldErrors.codModulo}
                        </span>
                    )}

                </div>


                <div className="form-group">

                    <label>Archivo</label>

                    <input
                        type="text"
                        name="archModulo"
                        value={formData.archModulo}
                        onChange={handleChange}
                        maxLength={60}
                        className={fieldErrors.archModulo ? 'input-error' : ''}
                    />

                    {fieldErrors.archModulo && (
                        <span className="field-error">
                            {fieldErrors.archModulo}
                        </span>
                    )}

                </div>


                <div className="form-group">

                    <label>Nombre Módulo</label>

                    <input
                        type="text"
                        name="nomModulo"
                        value={formData.nomModulo}
                        onChange={handleChange}
                        maxLength={100}
                        className={fieldErrors.nomModulo ? 'input-error' : ''}
                    />

                    {fieldErrors.nomModulo && (

                        <span className="field-error">
                            {fieldErrors.nomModulo}
                        </span>

                    )}

                </div>


                <div className="form-group">

                    <label>Zona</label>

                    <input
                        type="text"
                        name="zonaModulo"
                        value={formData.zonaModulo}
                        onChange={handleChange}
                        maxLength={100}
                        list="zonas-modulo"
                        className={fieldErrors.zonaModulo ? 'input-error' : ''}
                    />

                    <datalist id="zonas-modulo">
                        {zonas.map((zona) => (
                            <option
                                key={zona}
                                value={zona}
                            />
                        ))}
                    </datalist>

                    {fieldErrors.zonaModulo && (
                        <span className="field-error">
                            {fieldErrors.zonaModulo}
                        </span>
                    )}

                </div>


                <div className="form-group">

                    <label>Orden</label>

                    <input
                        type="number"
                        name="ordeModulo"
                        value={formData.ordeModulo}
                        onChange={handleChange}
                        min={1}
                        max={9999}
                        className={fieldErrors.ordeModulo ? 'input-error' : ''}
                    />

                    {fieldErrors.ordeModulo && (
                        <span className="field-error">
                            {fieldErrors.ordeModulo}
                        </span>
                    )}

                </div>


                {error && (
                    <div className="form-error" role="alert">

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">
                            <span className="form-error-title">
                                No fue posible guardar el módulo
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
                                <CircularProgress size={16} thickness={4}/>
                                Guardando...
                            </>
                        ) : (
                            modulo ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default ModuloForm;
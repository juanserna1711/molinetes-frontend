import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { consultarRendTallas } from '../services/rendtallas.service';

function RendTallaForm({ onClose, onSubmit, rendtalla }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        codTalla: rendtalla?.codigo ?? '',
        nomTalla: rendtalla?.nombre ?? '',
        estaTalla: rendtalla?.estado ?? 'A',
        anchoRendtall: rendtalla?.ancho ?? '',
        pesoRendtall: rendtalla?.pesoM2 ?? '',
        rolloRendtall: rendtalla?.pesoRollo ?? '',
        usuarioRendtall: 2
    });

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

    useEffect(() => {
    
            const codigo = formData.codTalla;
    
            if (!codigo || rendtalla) {
                setCodigoDuplicado(false);
                return;
            }
    
            const temporizador = setTimeout(async () => {
    
                try {
    
                    const response = await consultarRendTallas({
                        codigo: Number(codigo)
                    });
    
                    const existe = response.data?.length > 0;
    
                    setCodigoDuplicado(existe);
    
                } catch (error) {
    
                    console.error('Error verificando código:', error);
    
                }
    
            }, 500);
    
            return () => clearTimeout(temporizador);
    
    }, [formData.codTalla, rendtalla]);

    useEffect(() => {
        setFormData({
            codTalla: rendtalla?.codigo ?? '',
            nomTalla: rendtalla?.nombre.toUpperCase() ?? '',
            estaTalla: rendtalla?.estado ?? 'A',
            anchoRendtall: rendtalla?.ancho ?? '',
            pesoRendtall: rendtalla?.pesoM2 ?? '',
            rolloRendtall: rendtalla?.pesoRollo ?? '',
            usuarioRendtall: 2
        });

        setError(null);
        setFieldErrors({});
        setCodigoDuplicado(false);
    }, [rendtalla]);

    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codTalla' && value.length > 3) {
            return;
        }

        if (
            ['anchoRendtall', 'pesoRendtall', 'rolloRendtall'].includes(name) &&
            value.length > 4
        ) {
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

            await onSubmit(data);

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

    function validarFormulario() {

        const errores = {};

        if (!formData.codTalla) {
            errores.codTalla = 'Completa este campo.';
        }

        if (!formData.nomTalla.trim()) {
            errores.nomTalla = 'Completa este campo.';
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

        if (!formData.estaTalla) {
            errores.estaTalla = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }
    return (

        <div className="form-panel">

            <div className="form-header">

            <h2>{rendtalla ? 'Editar Talla' : 'Crear Talla'}</h2>

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
                        disabled={Boolean(rendtalla)}
                        className={`${rendtalla ? 'input-readonly' : ''} ${codigoDuplicado || fieldErrors.codTalla ? 'input-error' : ''}`}
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
                        Ancho
                    </label>

                    <input
                        type="number"
                        step="1"
                        name="anchoRendtall"
                        value={formData.anchoRendtall}
                        onChange={handleChange}
                        className={fieldErrors.anchoRendtall ? 'input-error' : ''}
                    />

                    {fieldErrors.anchoRendtall && (
                        <span className="field-error">
                            {fieldErrors.anchoRendtall}
                        </span>
                    )}

                </div>

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
                        className={fieldErrors.pesoRendtall ? 'input-error' : ''}
                    />
                    {fieldErrors.pesoRendtall && (
                        <span className="field-error">
                            {fieldErrors.pesoRendtall}
                        </span>
                    )}

                </div>

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
                        className={fieldErrors.rolloRendtall ? 'input-error' : ''}
                    />
                    {fieldErrors.rolloRendtall && (
                        <span className="field-error">
                            {fieldErrors.rolloRendtall}
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

                <div className="form-group calculated-group">

                    <label>Rendimiento</label>

                    <input
                        type="text"
                        value={rendimiento > 0 ? rendimiento.toFixed(1) : ''}
                        readOnly
                        className={fieldErrors.rendimiento ? 'input-error' : ''}
                    />
                    {fieldErrors.rendimiento && (
                        <span className="field-error">
                            {fieldErrors.rendimiento}
                        </span>
                    )}

                </div>

                <div className="form-group calculated-group">

                    <label>Metros/Rollo</label>

                    <input
                        type="text"
                        value={metrosRollo > 0 ? metrosRollo.toFixed(1) : ''}
                        readOnly
                        className={fieldErrors.metrosRollo ? 'input-error' : ''}
                    />
                    {fieldErrors.metrosRollo && (
                        <span className="field-error">
                            {fieldErrors.metrosRollo}
                        </span>
                    )}

                </div>

                {error && (
                    <div className="form-error" role="alert">

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
                            rendtalla ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default RendTallaForm;
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { consultarUsuarios } from '../services/usuarios.service';

function UsuarioForm({ onClose, onSubmit, usuario }) {

    const [codigoDuplicado, setCodigoDuplicado] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        codUsuario: usuario?.codigo ?? '',
        nomUsuario: usuario?.nombre ?? '',
        passUsuario: usuario?.password ?? '',
        estaUsuario: usuario?.estado ?? 'A'
    });
    
    useEffect(() => {

        const codigo = formData.codUsuario;

        if (!codigo || usuario) {
            setCodigoDuplicado(false);
            return;
        }

        const temporizador = setTimeout(async () => {

            try {

                const response = await consultarUsuarios({
                    codigo: Number(codigo)
                });

                const existe = response.data?.length > 0;

                setCodigoDuplicado(existe);

            } catch (error) {

                console.error('Error verificando código:', error);

            }

        }, 500);

        return () => clearTimeout(temporizador);

    }, [formData.codUsuario, usuario]);

    useEffect(() => {
        setFormData({
            codUsuario: usuario?.codigo ?? '',
            nomUsuario: usuario?.nombre.toUpperCase() ?? '',
            passUsuario: usuario?.password ?? '',
            estaUsuario: usuario?.estado ?? 'A'
        });

        setError(null);
        setFieldErrors({});
        setCodigoDuplicado(false);
    }, [usuario]);


    function handleChange(event) {

        const { name, value } = event.target;

        if (name === 'codUsuario' && value.length > 3) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'nomUsuario'
                ? value.toUpperCase()
                : value
        }));
        
        setFieldErrors(prev => ({
            ...prev,
            [name]: null
        }));
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
            codUsuario: Number(formData.codUsuario)
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
    function validarFormulario() {

        const errores = {};

        if (!formData.codUsuario) {
            errores.codUsuario = 'Completa este campo.';
        }

        if (!formData.nomUsuario.trim()) {
            errores.nomUsuario = 'Completa este campo.';
        }
        
        if (!formData.passUsuario.trim()) {
            errores.passUsuario = 'Completa este campo.';
        }

        if (!formData.estaUsuario) {
            errores.estaUsuario = 'Completa este campo.';
        }

        setFieldErrors(errores);

        return Object.keys(errores).length === 0;
    }
    return (

        <div className="form-panel">

            <div className="form-header">

            <h2>{usuario ? 'Editar Usuario' : 'Crear Usuario'}</h2>

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
                        Código Usuario
                    </label>

                <input
                    type="number"
                    name="codUsuario"
                    value={formData.codUsuario}
                    onChange={handleChange}
                    min={1}
                    max={999}
                    disabled={Boolean(usuario)}
                    className={`${usuario ? 'input-readonly' : ''} ${codigoDuplicado || fieldErrors.codUsuario ? 'input-error' : ''}`}
                />

                    {(codigoDuplicado || fieldErrors.codUsuario) && (
                        <span className="field-error">
                            {codigoDuplicado
                                ? 'El código de usuario ya existe.'
                                : fieldErrors.codUsuario}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Nombre Usuario
                    </label>

                    <input
                        type="text"
                        name="nomUsuario"
                        value={formData.nomUsuario}
                        onChange={handleChange}
                        maxLength={60}
                        className={fieldErrors.nomUsuario ? 'input-error' : ''}
                    />
                    
                    {fieldErrors.nomUsuario && (
                        <span className="field-error">
                            {fieldErrors.nomUsuario}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Contraseña Usuario
                    </label>

                    <input
                        type="text"
                        name="passUsuario"
                        value={formData.passUsuario}
                        onChange={handleChange}
                        maxLength={30}
                        className={fieldErrors.passUsuario ? 'input-error' : ''}
                    />

                    {fieldErrors.passUsuario && (
                        <span className="field-error">
                            {fieldErrors.passUsuario}
                        </span>
                    )}

                </div>

                <div className="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        name="estaUsuario"
                        value={formData.estaUsuario}
                        onChange={handleChange}
                        className={fieldErrors.estaUsuario ? 'input-error' : ''}
                    >
                        <option value="A">
                            Activo
                        </option>

                        <option value="I">
                            Inactivo
                        </option>

                    </select>

                    
                    {fieldErrors.estaUsuario && (
                        <span className="field-error">
                            {fieldErrors.estaUsuario}
                        </span>
                    )}

                </div>

                {error && (
                    <div className="form-error" role="alert">

                        <ErrorOutlineOutlinedIcon />

                        <div className="form-error-content">
                            <span className="form-error-title">
                                No fue posible guardar el usuario
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
                            usuario ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}

export default UsuarioForm;
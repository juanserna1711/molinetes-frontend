import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

function UsuarioForm({ onClose, onSubmit, usuario }) {

    const [formData, setFormData] = useState({
        codUsuario: usuario?.codigo ?? '',
        nomUsuario: usuario?.nombre ?? '',
        passUsuario: usuario?.password ?? '',
        estaUsuario: usuario?.estado ?? 'A'
    });

    useEffect(() => {
        setFormData({
            codUsuario: usuario?.codigo ?? '',
            nomUsuario: usuario?.nombre ?? '',
            passUsuario: usuario?.password ?? '',
            estaUsuario: usuario?.estado ?? 'A'
        });

        setError(null);
    }, [usuario]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const data = {
            ...formData,
            codUsuario: Number(formData.codUsuario)
        };

        try {
            setLoading(true);
            setError(null);

            await onSubmit(data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible guardar el usuario.'
            );
        } finally {
            setLoading(false);
        }
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
                    required
                    disabled={Boolean(usuario)}
                    className={usuario ? 'input-readonly' : ''}
                />

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
                        required
                    />

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
                        required
                    />

                </div>

                <div className="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        name="estaUsuario"
                        value={formData.estaUsuario}
                        onChange={handleChange}
                    >
                        <option value="A">
                            Activo
                        </option>

                        <option value="I">
                            Inactivo
                        </option>

                    </select>

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
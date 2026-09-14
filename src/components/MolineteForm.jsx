import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

function MolineteForm({ onClose, onSubmit, molinete }) {

    const [formData, setFormData] = useState({
        codMolinete: molinete?.codigo ?? '',
        nomMolinete: molinete?.nombre ?? '',
        rpmMolinete: molinete?.rpm ?? '',
        periMolinete: molinete?.perimetro ?? ''
    });

    useEffect(() => {
        setFormData({
            codMolinete: molinete?.codigo ?? '',
            nomMolinete: molinete?.nombre ?? '',
            rpmMolinete: molinete?.rpm ?? '',
            periMolinete: molinete?.perimetro ?? ''
        });

        setError(null);
    }, [molinete]);

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
            codMolinete: Number(formData.codMolinete)
        };

        try {
            setLoading(true);
            setError(null);

            await onSubmit(data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible guardar el molinete.'
            );
        } finally {
            setLoading(false);
        }
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
                    required
                    disabled={Boolean(molinete)}
                    className={molinete ? 'input-readonly' : ''}
                />

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
                        required
                    />

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
                        required
                    />

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
                        required
                    />

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
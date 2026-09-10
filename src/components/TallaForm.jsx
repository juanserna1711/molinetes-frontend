import { X } from 'lucide-react';
import { useState } from 'react';

function TallaForm({ onClose, onSubmit, talla }) {

    const [formData, setFormData] = useState({
        codTalla: talla?.codigo ?? '',
        nomTalla: talla?.nombre ?? '',
        estaTalla: talla?.estado ?? 'A',
        anchoRendtall: talla?.ancho ?? '',
        pesoRendtall: talla?.pesoM2 ?? '',
        rolloRendtall: talla?.pesoRollo ?? '',
        usuarioRendtall: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
            codTalla: Number(formData.codTalla),
            anchoRendtall: Number(formData.anchoRendtall),
            pesoRendtall: Number(formData.pesoRendtall),
            rolloRendtall: Number(formData.rolloRendtall),
            usuarioRendtall: Number(formData.usuarioRendtall)
        };

        try {
            setLoading(true);
            setError(null);

            await onSubmit(data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'No fue posible guardar la talla.'
            );
        } finally {
            setLoading(false);
        }
    }
    return (

        <div className="form-panel">

            <div className="form-header">

            <h2>{talla ? 'Editar Talla' : 'Crear Talla'}</h2>

                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                >
                    <X size={18} />
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
                    required
                    disabled={Boolean(talla)}
                />

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
                        required
                    />

                </div>

                <div className="form-group">

                    <label>
                        Ancho
                    </label>

                    <input
                        type="number"
                        step="any"
                        name="anchoRendtall"
                        value={formData.anchoRendtall}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>
                        Peso/M2
                    </label>

                    <input
                        type="number"
                        step="any"
                        name="pesoRendtall"
                        value={formData.pesoRendtall}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>
                        Peso/Rollo
                    </label>

                    <input
                        type="number"
                        step="any"
                        name="rolloRendtall"
                        value={formData.rolloRendtall}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        name="estaTalla"
                        value={formData.estaTalla}
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

                <div className="form-group">
                <label>Rendimiento</label>
                    <input
                        type="text"
                        value={rendimiento > 0 ? rendimiento.toFixed(1) : ''}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>Metros/Rollo</label>
                    <input
                        type="text"
                        value={metrosRollo > 0 ? metrosRollo.toFixed(1) : ''}
                        readOnly
                    />
                </div>

                {error && (
                    <div className="form-error">
                        {error}
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
                        {loading
                            ? 'Guardando...'
                            : talla
                                ? 'Actualizar'
                                : 'Guardar'
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TallaForm;
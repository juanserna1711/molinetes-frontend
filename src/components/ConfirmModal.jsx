import { AlertTriangle } from 'lucide-react';

function ConfirmModal({ title, message, onConfirm, onCancel, loading = false }) {
    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <div className="confirm-icon">
                    <AlertTriangle size={24} />
                </div>

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirm-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
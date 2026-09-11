import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CircularProgress from '@mui/material/CircularProgress';

function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
    loading = false
}) {
    return (
        <div className="modal-overlay">
            <div className="confirm-modal" role="dialog" aria-modal="true">
                <div className="confirm-icon">
                    <WarningAmberOutlinedIcon />
                </div>

                <div className="confirm-content">
                    <h2>{title}</h2>
                    <p>{message}</p>
                </div>

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
                        {loading ? (
                            <>
                                <CircularProgress size={16} thickness={4} />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
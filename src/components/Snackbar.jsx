import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function Snackbar({ message, type = 'success' }) {
    if (!message) {
        return null;
    }

    const isSuccess = type === 'success';

    return (
        <div className={`snackbar snackbar-${type}`} role="alert">
            {isSuccess ? (
                <CheckCircleOutlineOutlinedIcon />
            ) : (
                <ErrorOutlineOutlinedIcon />
            )}

            <span>{message}</span>
        </div>
    );
}

export default Snackbar;
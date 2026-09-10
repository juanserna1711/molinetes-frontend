import { CheckCircle, AlertCircle } from 'lucide-react';

function Snackbar({ message, type = 'success' }) {

    if (!message) {
        return null;
    }

    return (
        <div className={`snackbar ${type}`}>

            {type === 'success' ? (
                <CheckCircle size={20} />
            ) : (
                <AlertCircle size={20} />
            )}

            <span>
                {message}
            </span>

        </div>
    );
}

export default Snackbar;
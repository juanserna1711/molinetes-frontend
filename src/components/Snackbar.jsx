/*=============================================================================
  Nombre responsabilidad: Mostrar notificaciones de operación

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Presenta un aviso de éxito o error; devuelve null cuando no hay mensaje.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

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
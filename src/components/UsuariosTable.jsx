import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function UsuariosTable({
    usuarios,
    onEdit,
    onActivate,
    onDeactivate,
    onDelete,
    operation
}) {
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Usuario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {usuarios.map((usuario) => {

                        const estaActivo = usuario.estado === 'A';

                        const operacionEstado = estaActivo
                            ? `desactivar-${usuario.codigo}`
                            : `activar-${usuario.codigo}`;

                        const procesandoEstado =
                            operation === operacionEstado;

                        return (
                            <tr key={usuario.codigo}>

                                <td className="codigo-cell">
                                    {usuario.codigo}
                                </td>

                                <td className="name">
                                    {usuario.nombre}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        className={`status-button ${
                                            estaActivo
                                                ? 'status-active'
                                                : 'status-inactive'
                                        }`}
                                        onClick={() => {
                                            if (estaActivo) {
                                                onDeactivate(usuario.codigo);
                                            } else {
                                                onActivate(usuario.codigo);
                                            }
                                        }}
                                        disabled={procesandoEstado}
                                        title={
                                            estaActivo
                                                ? 'Desactivar usuario'
                                                : 'Activar usuario'
                                        }
                                    >

                                        {estaActivo ? (
                                            <CheckCircleOutlineOutlinedIcon />
                                        ) : (
                                            <RadioButtonUncheckedIcon />
                                        )}

                                        <span>
                                            {estaActivo
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>

                                    </button>

                                </td>

                                <td>

                                    <div className="actions">

                                        <button
                                            type="button"
                                            className="table-action edit"
                                            onClick={() => onEdit(usuario)}
                                            title="Editar"
                                        >
                                            <EditOutlinedIcon />
                                        </button>

                                        <button
                                            type="button"
                                            className="table-action delete"
                                            onClick={() => onDelete(usuario)}
                                            title="Eliminar"
                                        >
                                            <DeleteOutlinedIcon />
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        );
                    })}

                </tbody>

            </table>

        </div>
    );
}

export default UsuariosTable;
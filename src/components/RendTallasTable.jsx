import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function formatearFecha(fecha) {
    if (!fecha) return '-';

    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(new Date(fecha));
}

function RendTallasTable({
    rendtallas,
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
                        <th>Nombre Talla</th>
                        <th>Ancho (in)</th>
                        <th>Peso/M2 (g)</th>
                        <th>Peso/Rollo (kg)</th>
                        <th>Metros/Rollo (m)</th>
                        <th>Rendimiento</th>
                        <th>Fecha generación</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {rendtallas.map((rendtalla) => {

                        const estaActiva = rendtalla.estado === 'A';

                        const operacionEstado = estaActiva
                            ? `desactivar-${rendtalla.codigo}`
                            : `activar-${rendtalla.codigo}`;

                        const procesandoEstado =
                            operation === operacionEstado;

                        return (
                            <tr key={rendtalla.codigo}>

                                <td className="codigo-cell">
                                    {rendtalla.codigo}
                                </td>

                                <td className="name">
                                    {rendtalla.nombre}
                                </td>

                                <td>
                                    {rendtalla.ancho}
                                </td>

                                <td>
                                    {rendtalla.pesoM2}
                                </td>

                                <td>
                                    {rendtalla.pesoRollo}
                                </td>

                                <td>
                                    {rendtalla.metrosRollo}
                                </td>

                                <td>
                                    {rendtalla.rendimiento}
                                </td>

                                <td className="date-cell">
                                    {formatearFecha(rendtalla.fechaGeneracion)}
                                </td>

                                <td className="user-cell">
                                    {rendtalla.usuario || '-'}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        className={`status-button ${
                                            estaActiva
                                                ? 'status-active'
                                                : 'status-inactive'
                                        }`}
                                        onClick={() => {
                                            if (estaActiva) {
                                                onDeactivate(rendtalla.codigo);
                                            } else {
                                                onActivate(rendtalla.codigo);
                                            }
                                        }}
                                        disabled={procesandoEstado}
                                        title={
                                            estaActiva
                                                ? 'Desactivar talla'
                                                : 'Activar talla'
                                        }
                                    >

                                        {estaActiva ? (
                                            <CheckCircleOutlineOutlinedIcon />
                                        ) : (
                                            <RadioButtonUncheckedIcon />
                                        )}

                                        <span>
                                            {estaActiva
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
                                            onClick={() => onEdit(rendtalla)}
                                            title="Editar"
                                        >
                                            <EditOutlinedIcon />
                                        </button>

                                        <button
                                            type="button"
                                            className="table-action delete"
                                            onClick={() => onDelete(rendtalla)}
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

export default RendTallasTable;
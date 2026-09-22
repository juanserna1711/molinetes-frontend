/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza los registros de tallas y permite solicitar edición, cambio de estado o eliminación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function TallasTable({
    tallas,
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
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {tallas.map((talla) => {

                        const estaActiva = talla.estado === 'A';

                        const operacionEstado = estaActiva
                            ? `desactivar-${talla.codigo}`
                            : `activar-${talla.codigo}`;

                        const procesandoEstado =
                            operation === operacionEstado;

                        return (
                            <tr key={talla.codigo}>

                                <td className="codigo-cell">
                                    {talla.codigo}
                                </td>

                                <td className="talla-name">
                                    {talla.nombre}
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
                                                onDeactivate(talla.codigo);
                                            } else {
                                                onActivate(talla.codigo);
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
                                            onClick={() => onEdit(talla)}
                                            title="Editar"
                                        >
                                            <EditOutlinedIcon />
                                        </button>

                                        <button
                                            type="button"
                                            className="table-action delete"
                                            onClick={() => onDelete(talla)}
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

export default TallasTable;
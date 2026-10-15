/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza los registros de tallas y permite solicitar edición, cambio de estado.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// operation combina acción y código para bloquear el cambio de estado de la fila que procesa la página.
function TallasTable({
    tallas,
    onEdit,
    onActivate,
    onDeactivate,
    operation,
    puedeActualizar
}) {
    const mostrarAcciones = puedeActualizar;
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Talla</th>
                        <th>Estado</th>
                        {mostrarAcciones && (<th>Acciones</th>)}
                    </tr>
                </thead>

                <tbody>

                    {tallas.map((talla) => {

                        const estaActiva = talla.estado === 'A';
                        const operacionEstado = estaActiva ? `desactivar-${talla.codigo}` : `activar-${talla.codigo}`;
                        const procesandoEstado = operation === operacionEstado;

                        return (
                            <tr key={talla.codigo}>

                                <td className="codigo-cell">
                                    {talla.codigo}
                                </td>

                                <td className="name">
                                    {talla.nombre}
                                </td>

                                <td>

                                    {puedeActualizar ? (
                                        <button
                                            type="button"
                                            className={`status-button ${estaActiva ? 'status-active' : 'status-inactive'}`}
                                            onClick={() => {
                                                if (estaActiva) {
                                                    onDeactivate(talla.codigo);
                                                } else {
                                                    onActivate(talla.codigo);
                                                }
                                            }}
                                            disabled={procesandoEstado}
                                            title={estaActiva ? 'Desactivar talla' : 'Activar talla'}
                                        >

                                            {estaActiva ? (<CheckCircleOutlineOutlinedIcon />) : (<RadioButtonUncheckedIcon />)}

                                            <span>
                                                {estaActiva ? 'Activo' : 'Inactivo'}
                                            </span>

                                        </button>

                                    ) : (

                                        <span
                                            className={`status-button status-readonly ${estaActiva ? 'status-active' : 'status-inactive'}`}
                                            title="Estado de la talla"
                                        >

                                            {estaActiva ? (<CheckCircleOutlineOutlinedIcon />) : (<RadioButtonUncheckedIcon />)}

                                            <span>
                                                {estaActiva ? 'Activo' : 'Inactivo'}
                                            </span>

                                        </span>

                                    )}

                                </td>

                                {mostrarAcciones && (
                                <td>

                                    <div className="actions">

                                        {puedeActualizar && (
                                        <button
                                            type="button"
                                            className="table-action edit"
                                            onClick={() => onEdit(talla)}
                                            title="Editar"
                                        >
                                            <EditOutlinedIcon />
                                        </button>
                                        )}

                                    </div>

                                </td>
                                )}

                            </tr>
                        );
                    })}

                </tbody>

            </table>

        </div>
    );
}

export default TallasTable;
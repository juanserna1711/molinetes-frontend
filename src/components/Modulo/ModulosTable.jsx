/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Renderiza los registros de módulos y permite solicitar edición o eliminación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function ModulosTable({
    modulos,
    onEdit,
    onDelete,
    puedeActualizar,
    puedeEliminar
}) {
    const mostrarAcciones = puedeActualizar || puedeEliminar;
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Módulo</th>
                        <th>Archivo</th>
                        <th>Zona</th>
                        <th>Orden</th>
                        {mostrarAcciones && (<th>Acciones</th>)}
                    </tr>
                </thead>

                <tbody>

                    {modulos.map((modulo) => (

                        <tr key={modulo.codigo}>

                            <td className="codigo-cell">
                                {modulo.codigo}
                            </td>

                            <td className="name">
                                {modulo.nombre}
                            </td>

                            <td>
                                {modulo.archivo}
                            </td>

                            <td>
                                {modulo.zona}
                            </td>

                            <td>
                                {modulo.orden}
                            </td>

                            {mostrarAcciones && (
                            <td>

                                <div className="actions">

                                    {puedeActualizar && (
                                    <button
                                        type="button"
                                        className="table-action edit"
                                        onClick={() => onEdit(modulo)}
                                        title="Editar"
                                    >
                                        <EditOutlinedIcon />
                                    </button>
                                    )}

                                    {puedeEliminar && (
                                    <button
                                        type="button"
                                        className="table-action delete"
                                        onClick={() => onDelete(modulo)}
                                        title="Eliminar"
                                    >
                                        <DeleteOutlinedIcon />
                                    </button>
                                    )}

                                </div>

                            </td>
                            )}
                            
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ModulosTable;
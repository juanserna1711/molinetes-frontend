/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza los registros de tipos de hilaza y permite solicitar edición
  o eliminación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

// Entrega el registro completo a la página para editarlo o solicitar confirmación de eliminación.
function TiposHilazaTable({tiposHilaza, onEdit, onDelete}) {

    return (

        <div className="table-container">

            <table className="table">

                <thead>

                    <tr>
                        <th>Código</th>
                        <th>Nombre Tipo de Hilaza</th>
                        <th>Acciones</th>
                    </tr>

                </thead>

                <tbody>

                    {tiposHilaza.map((tipoHilaza) => (

                        <tr key={tipoHilaza.codigo}>

                            <td className="codigo-cell">
                                {tipoHilaza.codigo}
                            </td>

                            <td className="name">
                                {tipoHilaza.nombre}
                            </td>

                            <td>

                                <div className="actions">

                                    <button
                                        type="button"
                                        className="table-action edit"
                                        onClick={() => onEdit(tipoHilaza)}
                                        title="Editar"
                                    >
                                        <EditOutlinedIcon />
                                    </button>

                                    <button
                                        type="button"
                                        className="table-action delete"
                                        onClick={() => onDelete(tipoHilaza)}
                                        title="Eliminar"
                                    >
                                        <DeleteOutlinedIcon />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default TiposHilazaTable;
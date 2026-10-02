/*=============================================================================
  Nombre responsabilidad: Presentar promedios asociados a tipos de hilaza y tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Muestra el tipo de hilaza, la talla, el peso, el ancho,
  el promedio y la fecha de generación de cada registro.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {formatearFecha} from '../../utils/formatters';

// La pareja hilaza-talla identifica cada fila; los callbacks reciben el registro con ambos códigos.
function TiHiPromTable({tihiprom, onEdit, onDelete}) {
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Tipo Hilaza</th>
                        <th>Talla</th>
                        <th>Peso</th>
                        <th>Ancho</th>
                        <th>Promedio</th>
                        <th>Fecha Generación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {tihiprom.map((registro) => (

                        <tr key={`${registro.codigoTipoHilaza}-${registro.codigoTalla}`}>

                            <td className="name">
                                {registro.nombreTipoHilaza}
                            </td>

                            <td className="name">
                                {registro.nombreTalla}
                            </td>

                            <td>
                                {registro.peso}
                            </td>

                            <td>
                                {registro.ancho}
                            </td>

                            <td className="calculated-cell">

                                <span className="calculated-value">
                                    {registro.promedio}
                                </span>

                            </td>

                            <td className="date-cell">
                                {formatearFecha(registro.fechaGeneracion)}
                            </td>

                            <td>

                                <div className="actions">

                                    <button
                                        type="button"
                                        className="table-action edit"
                                        onClick={() => onEdit(registro)}
                                        title="Editar promedio"
                                    >
                                        <EditOutlinedIcon />
                                    </button>

                                    <button
                                        type="button"
                                        className="table-action delete"
                                        onClick={() => onDelete(registro)}
                                        title="Eliminar promedio"
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


export default TiHiPromTable;
/*=============================================================================
  Nombre responsabilidad: Mostrar historial de órdenes de trabajo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Presenta las órdenes de trabajo consultadas y permite acceder
  al detalle de cada orden.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { formatearFecha } from '../../utils/formatters';


function OrdeProdTable({
    ordenes,
    imprimiendoOrden,
    onDetalle
}) {
    return (

        <div className="table-container">

            <table className="table">

                <thead>

                    <tr>
                        <th>Orden</th>
                        <th>Tipo de Hilaza</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Molinetes</th>
                        <th>Acciones</th>
                    </tr>

                </thead>

                <tbody>

                    {ordenes.map((orden) => (

                        <tr
                            key={orden.codigoOrden}
                        >

                            <td>
                                #{orden.codigoOrden}
                            </td>

                            <td>
                                {orden.nombreTipoHilaza}
                            </td>

                            <td>
                                {formatearFecha(orden.fechaGeneracion)}
                            </td>

                            <td>
                                {orden.nombreUsuario}
                            </td>

                            <td>
                                {orden.cantidadMolinetes}
                            </td>

                            <td>

                                <div className="actions">
                                <button
                                    type="button"
                                    className="table-action view"
                                    onClick={() => onDetalle(orden)}
                                    disabled={imprimiendoOrden === orden.codigoOrden}
                                    title="Ver detalle"
                                    aria-label="Ver detalle"
                                >

                                    {imprimiendoOrden === orden.codigoOrden ? (

                                        <CircularProgress
                                            size={18}
                                            thickness={4}
                                        />

                                    ) : (

                                        <VisibilityOutlinedIcon />

                                    )}

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

export default OrdeProdTable;
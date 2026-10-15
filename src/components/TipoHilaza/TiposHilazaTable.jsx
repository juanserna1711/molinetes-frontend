/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza los registros de tipos de hilaza y permite solicitar edición.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

function TiposHilazaTable({
    tiposHilaza, 
    onEdit,
    puedeActualizar
}) {
    const mostrarAcciones = puedeActualizar;
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Tipo de Hilaza</th>
                        {mostrarAcciones && (<th>Acciones</th>)}
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

                            {mostrarAcciones && (
                            <td>

                                <div className="actions">

                                    {puedeActualizar && (
                                    <button
                                        type="button"
                                        className="table-action edit"
                                        onClick={() => onEdit(tipoHilaza)}
                                        title="Editar"
                                    >
                                        <EditOutlinedIcon />
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

export default TiposHilazaTable;
/*=============================================================================
  Nombre responsabilidad: Presentar el catálogo de molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza código, nombre, RPM y perímetro, con acciones delegadas a la página.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// Los callbacks reciben la fila completa para que la página abra edición o confirme el borrado.
function MolinetesTable({
    molinetes, 
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
                        <th>Nombre Molinete</th>
                        <th>RPM</th>
                        <th>Perimetro</th>
                        {mostrarAcciones && (<th>Acciones</th>)}
                    </tr>
                </thead>

                <tbody>

                    {molinetes.map((molinete) => {

                        return (
                            <tr key={molinete.codigo}>

                                <td className="codigo-cell">
                                    {molinete.codigo}
                                </td>

                                <td className="name">
                                    {molinete.nombre}
                                </td>

                                <td>
                                    {molinete.rpm}
                                </td>

                                <td>
                                    {molinete.perimetro}
                                </td>

                                {mostrarAcciones && (
                                <td>

                                    <div className="actions">

                                        {puedeActualizar && (
                                        <button
                                            type="button"
                                            className="table-action edit"
                                            onClick={() => onEdit(molinete)}
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

export default MolinetesTable;
/*=============================================================================
  Nombre responsabilidad: Presentar rendimientos asociados a tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Muestra parámetros textiles, resultados y fecha de generación de cada talla.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

/*
  Presenta la fecha y hora en formato local; muestra un guion si no hay fecha.
*/
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
    onAdd,
    onDelete
}) {
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Nombre Talla</th>
                        <th>Ancho</th>
                        <th>Peso/M2</th>
                        <th>Peso/Rollo</th>
                        <th>Metros</th>
                        <th>Rendimiento</th>
                        <th>Fecha generación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {rendtallas.map((rendtalla) => {

                        /*
                         * Una TALLA puede existir sin información
                         * de RENDTALL.
                         *
                         * Si ancho es null, significa que todavía
                         * no tiene rendimiento asociado.
                         */
                        const tieneRendimiento =
                            rendtalla.ancho !== null &&
                            rendtalla.ancho !== undefined;

                        return (
                            <tr key={rendtalla.codigo}>

                                <td className="name">
                                    {rendtalla.nombre}
                                </td>

                                <td>
                                    {tieneRendimiento
                                        ? rendtalla.ancho
                                        : '-'
                                    }
                                </td>

                                <td>
                                    {tieneRendimiento
                                        ? rendtalla.pesoM2
                                        : '-'
                                    }
                                </td>

                                <td>
                                    {tieneRendimiento
                                        ? rendtalla.pesoRollo
                                        : '-'
                                    }
                                </td>

                                <td className="calculated-cell">

                                    {tieneRendimiento ? (

                                        <span className="calculated-value">
                                            {rendtalla.metrosRollo}
                                        </span>

                                    ) : (
                                        '-'
                                    )}

                                </td>

                                <td className="calculated-cell">

                                    {tieneRendimiento ? (

                                        <span className="calculated-value">
                                            {rendtalla.rendimiento}
                                        </span>

                                    ) : (
                                        '-'
                                    )}

                                </td>

                                <td className="date-cell">

                                    {tieneRendimiento
                                        ? formatearFecha(
                                            rendtalla.fechaGeneracion
                                        )
                                        : '-'
                                    }

                                </td>

                                <td>

                                    <div className="actions">

                                        {tieneRendimiento ? (

                                            <>
                                                <button
                                                    type="button"
                                                    className="table-action edit"
                                                    onClick={() =>
                                                        onEdit(rendtalla)
                                                    }
                                                    title="Editar rendimiento"
                                                >
                                                    <EditOutlinedIcon />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="table-action delete"
                                                    onClick={() =>
                                                        onDelete(rendtalla)
                                                    }
                                                    title="Eliminar rendimiento"
                                                >
                                                    <DeleteOutlinedIcon />
                                                </button>
                                            </>

                                        ) : (

                                            <button
                                                type="button"
                                                className="table-action add"
                                                onClick={() =>
                                                    onAdd(rendtalla)
                                                }
                                                title="Agregar rendimiento"
                                            >
                                                <AddOutlinedIcon />
                                            </button>

                                        )}

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
import { Pencil, Trash2, Check, X } from 'lucide-react';

function TallasTable({ tallas, onEdit, onActivate, onDeactivate, onDelete, operation }) {

    return (
        <div className="table-container">

            <table className="tallas-table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Talla</th>
                        <th>Ancho (in)</th>
                        <th>Peso/M2 (g)</th>
                        <th>Peso/Rollo (kg)</th>
                        <th>Metros/Rollo (m)</th>
                        <th>Rendimiento</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {tallas.map((talla) => (

                        <tr key={talla.codigo}>

                            <td>
                                {talla.codigo}
                            </td>

                            <td className="talla-name">
                                {talla.nombre}
                            </td>

                            <td>
                                {talla.ancho}
                            </td>

                            <td>
                                {talla.pesoM2}
                            </td>

                            <td>
                                {talla.pesoRollo}
                            </td>

                            <td>
                                {talla.metrosRollo}
                            </td>

                            <td>
                                {talla.rendimiento}
                            </td>

                            <td>

                                <span
                                    className={
                                        talla.estado === 'A'
                                            ? 'status active'
                                            : 'status inactive'
                                    }
                                >
                                    {talla.estado === 'A'
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </span>

                            </td>

                            <td>

                                <div className="actions">

                                    <button
                                        type="button"
                                        onClick={() => onEdit(talla)}
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    {talla.estado === 'A' ? (

                                        <button
                                            type="button"
                                            onClick={() => onDeactivate(talla.codigo)}
                                            title="Desactivar"
                                            disabled={operation === `desactivar-${talla.codigo}`}
                                        >
                                            <X size={16} />
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() => onActivate(talla.codigo)}
                                            title="Activar"
                                            disabled={operation === `activar-${talla.codigo}`}
                                        >
                                            <Check size={16} />
                                        </button>

                                    )}

                                        <button
                                            type="button"
                                            className="action-button"
                                            title="Eliminar"
                                            onClick={() => onDelete(talla)}
                                        >
                                        <Trash2 size={16} />
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

export default TallasTable;
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function MolinetesTable({
    molinetes,
    onEdit,
    onDelete
}) {
    return (
        <div className="table-container">

            <table className="table">

                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre Molinete</th>
                        <th>RPM</th>
                        <th>Perimetro</th>
                        <th>Acciones</th>
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

                                <td className="name">
                                    {molinete.rpm}
                                </td>

                                <td className="name">
                                    {molinete.perimetro}
                                </td>

                                <td>

                                    <div className="actions">

                                        <button
                                            type="button"
                                            className="table-action edit"
                                            onClick={() => onEdit(molinete)}
                                            title="Editar"
                                        >
                                            <EditOutlinedIcon />
                                        </button>

                                        <button
                                            type="button"
                                            className="table-action delete"
                                            onClick={() => onDelete(molinete)}
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

export default MolinetesTable;
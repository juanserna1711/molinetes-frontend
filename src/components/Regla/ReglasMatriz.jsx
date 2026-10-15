/*=============================================================================
  Nombre responsabilidad: Presentar la matriz de permisos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 09/Octubre/2026

  Descripcion responsabilidad:
  Renderiza las reglas de acceso por usuario y módulo, permitiendo consultar
  y modificar los permisos de consulta, inserción, actualización, eliminación
  y reporte según la autorización del usuario.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 13/Octubre/2026
  Descripcion:
  Se adapta la matriz para guardar cada permiso inmediatamente después
  de modificarlo y bloquear temporalmente la regla mientras se actualiza.
=============================================================================*/

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

function ReglasMatriz({
    reglas,
    reglasActualizando,
    onCambiarPermiso,
    puedeActualizar
}) {

    // Determina si el permiso recibido se encuentra activo.
    function permisoActivo(valor) {

        return String(valor).toUpperCase() === 'A';
    }

    return (

        <section className="reglas-matrix">

            <div className="table-container reglas-matrix-wrapper">

                <table className="table reglas-matrix-table">

                    <thead>

                        <tr>

                            <th className="reglas-user-column">
                                Usuario
                            </th>

                            <th className="reglas-module-column">
                                Módulo
                            </th>

                            <th className="reglas-permission-column">
                                Consultar
                            </th>

                            <th className="reglas-permission-column">
                                Insertar
                            </th>

                            <th className="reglas-permission-column">
                                Actualizar
                            </th>

                            <th className="reglas-permission-column">
                                Eliminar
                            </th>

                            <th className="reglas-permission-column">
                                Reporte
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {reglas.map((regla) => {

                            const actualizando = reglasActualizando.includes(regla.codigo);

                            const bloqueada = !puedeActualizar || actualizando;

                            return (

                                <tr
                                    key={regla.codigo}
                                    className={actualizando ? 'reglas-row updating' : 'reglas-row'}
                                >

                                    <td className="reglas-user-cell">

                                        <strong>
                                            {regla.nombreUsuario}
                                        </strong>

                                        <span>
                                            Código {regla.codigoUsuario}
                                        </span>

                                    </td>

                                    <td className="reglas-module-cell">

                                        <strong>
                                            {regla.nombreModulo}
                                        </strong>

                                        <span>
                                            {regla.zonaModulo}
                                        </span>

                                    </td>

                                    <td className="reglas-permission-cell">

                                        <label
                                            className={permisoActivo(regla.consulta) ? 'reglas-check active' : 'reglas-check'}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={permisoActivo(regla.consulta)}
                                                onChange={() => {onCambiarPermiso(regla.codigo, 'consulta');}}
                                                disabled={bloqueada}
                                            />

                                            <span className="reglas-check-box">
                                                <CheckOutlinedIcon />
                                            </span>

                                        </label>

                                    </td>

                                    <td className="reglas-permission-cell">

                                        <label
                                            className={permisoActivo(regla.insercion) ? 'reglas-check active' : 'reglas-check'}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={permisoActivo(regla.insercion)}
                                                onChange={() => {onCambiarPermiso(regla.codigo, 'insercion');}}
                                                disabled={bloqueada}
                                            />

                                            <span className="reglas-check-box">
                                                <CheckOutlinedIcon />
                                            </span>

                                        </label>

                                    </td>

                                    <td className="reglas-permission-cell">

                                        <label
                                            className={permisoActivo(regla.actualiza) ? 'reglas-check active' : 'reglas-check'}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={permisoActivo(regla.actualiza)}
                                                onChange={() => {onCambiarPermiso(regla.codigo, 'actualiza');}}
                                                disabled={bloqueada}
                                            />

                                            <span className="reglas-check-box">
                                                <CheckOutlinedIcon />
                                            </span>

                                        </label>

                                    </td>

                                    <td className="reglas-permission-cell">

                                        <label
                                            className={permisoActivo(regla.elimina) ? 'reglas-check active' : 'reglas-check'}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={permisoActivo(regla.elimina)}
                                                onChange={() => {onCambiarPermiso(regla.codigo, 'elimina');}}
                                                disabled={bloqueada}
                                            />

                                            <span className="reglas-check-box">
                                                <CheckOutlinedIcon />
                                            </span>

                                        </label>

                                    </td>

                                    <td className="reglas-permission-cell">

                                        <label
                                            className={permisoActivo(regla.reporte) ? 'reglas-check active' : 'reglas-check'}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={permisoActivo(regla.reporte)}
                                                onChange={() => {onCambiarPermiso(regla.codigo, 'reporte');}}
                                                disabled={bloqueada}
                                            />

                                            <span className="reglas-check-box">
                                                <CheckOutlinedIcon />
                                            </span>

                                        </label>

                                    </td>

                                </tr>

                            );
                        })}

                    </tbody>

                </table>

            </div>

        </section>
    );
}

export default ReglasMatriz;
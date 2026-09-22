/*=============================================================================
  Nombre responsabilidad: Presentar el historial y su detalle por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Renderiza los tiempos por molinete y expande el detalle solicitado desde TigimoliPage.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Fragment } from 'react';

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import CircularProgress from '@mui/material/CircularProgress';


function TigimoliTable({
    tigimoli,
    filaExpandida,
    detalleTigimoli,
    loadingDetalle,
    onDetalle
}) {

    return (

        <div className="table-container">

            <table className="table">

                <thead>

                    <tr>

                        <th>Nombre Molinete</th>
                        <th>Fecha Generación</th>
                        <th>Tallas</th>
                        <th>Rollos</th>
                        <th>Total Metros</th>
                        <th>Tiempo de Giro</th>
                        <th>Detalle</th>

                    </tr>

                </thead>


                <tbody>

                    {tigimoli.map((registro) => {

                        const clave =
                            `${registro.codigoMoli}-${registro.fechaGeneracion}`;

                        const expandida =
                            filaExpandida === clave;

                        const detalle =
                            detalleTigimoli[clave] || [];


                        return (

                            <Fragment key={clave}>

                                {/* =================================================
                                    REGISTRO PRINCIPAL
                                   ================================================= */}

                                <tr
                                    className={
                                        expandida
                                            ? 'tigimoli-row-expanded'
                                            : ''
                                    }
                                >

                                    <td className="name">
                                        {registro.nombreMolinete}
                                    </td>


                                    <td className="date-cell">
                                        {new Date(
                                            registro.fechaGeneracion
                                        ).toLocaleString('es-CO')}
                                    </td>


                                    <td>
                                        {registro.cantidadTallas}
                                    </td>


                                    <td>
                                        {registro.cantidadRollos}
                                    </td>


                                    <td className="total-metros-cell">
                                        {Number(
                                            registro.totalMetros
                                        ).toFixed(1)}
                                    </td>


                                    <td>

                                        <span
                                            className="calculated-value"
                                            title="Tiempo total de giro"
                                        >

                                            {Number(
                                                registro.tiempoGiro
                                            ).toFixed(1)}
                                            {' '}min

                                        </span>

                                    </td>


                                    <td className="detail-action-cell">

                                        <button
                                            type="button"
                                            className={`table-action ${
                                                expandida
                                                    ? 'expanded'
                                                    : ''
                                            }`}
                                            title={
                                                expandida
                                                    ? 'Ocultar detalle'
                                                    : 'Ver detalle'
                                            }
                                            aria-label={
                                                expandida
                                                    ? 'Ocultar detalle'
                                                    : 'Ver detalle'
                                            }
                                            onClick={() => {
                                                onDetalle(registro);
                                            }}
                                        >

                                            {expandida
                                                ? (
                                                    <ExpandLessOutlinedIcon />
                                                )
                                                : (
                                                    <ExpandMoreOutlinedIcon />
                                                )}

                                        </button>

                                    </td>

                                </tr>


                                {/* =================================================
                                    DETALLE
                                   ================================================= */}

                                {expandida && (

                                    <tr className="tigimoli-detail-row">

                                        <td
                                            colSpan="7"
                                            className="tigimoli-detail-cell"
                                        >

                                            <div className="tigimoli-detail-container">


                                                <div className="tigimoli-detail-header">

                                                    <span>
                                                        DETALLE DE CALCULO
                                                    </span>

                                                </div>


                                                {loadingDetalle && (

                                                    <div className="tigimoli-detail-loading">

                                                        <CircularProgress
                                                            size={22}
                                                            thickness={4}
                                                        />

                                                        <span>
                                                            Cargando detalle...
                                                        </span>

                                                    </div>

                                                )}


                                                {!loadingDetalle &&
                                                    detalle.length > 0 && (

                                                        <div className="tigimoli-detail-table-wrapper">

                                                            <table className="table tigimoli-detail-table">

                                                                <thead>

                                                                    <tr>

                                                                        <th>
                                                                            Talla
                                                                        </th>

                                                                        <th>
                                                                            Rollos
                                                                        </th>

                                                                        <th>
                                                                            Metros
                                                                        </th>

                                                                        <th>
                                                                            Total Metros
                                                                        </th>

                                                                    </tr>

                                                                </thead>


                                                                <tbody>

                                                                    {detalle.map(
                                                                        (talla) => (

                                                                            <tr
                                                                                key={
                                                                                    talla.codigoTalla
                                                                                }
                                                                            >

                                                                                <td className="name">
                                                                                    {talla.nombreTalla}
                                                                                </td>


                                                                                <td>
                                                                                    {talla.rollos}
                                                                                </td>


                                                                                <td>
                                                                                    {Number(
                                                                                        talla.metrosRollo
                                                                                    ).toFixed(1)}
                                                                                </td>


                                                                                <td className="detail-total-meters">
                                                                                    {Number(
                                                                                        talla.totalMetros
                                                                                    ).toFixed(1)}
                                                                                    {' '}m
                                                                                </td>

                                                                            </tr>

                                                                        )
                                                                    )}

                                                                </tbody>

                                                            </table>

                                                        </div>

                                                    )}


                                                {!loadingDetalle &&
                                                    detalle.length === 0 && (

                                                        <div className="tigimoli-detail-empty">

                                                            No hay detalle para esta generación.

                                                        </div>

                                                    )}

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </Fragment>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );
}


export default TigimoliTable;
/*=============================================================================
  Nombre responsabilidad: Capturar la selección del cálculo TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Presenta molinetes, tallas, cantidades de rollos y totales administrados por NuevoTigimoliPage.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';


function NuevoTigimoliForm({
    molinetes,
    tallas,
    molinetesSeleccionados,
    tallasSeleccionadas,
    Calculo,
    erroresTallas,
    totalRollos,
    totalMetros,
    onCambiarMolinete,
    onCambiarTalla,
    onCambiarRollos,
    onAgregarRollo,
    formatearNumero
}) {

    return (
        <>

            {/* =================================================
                01. MOLINETES
                ================================================= */}

            <section className="nuevo-tigimoli-section">

                <div className="nuevo-tigimoli-section-header">

                    <div>

                        <span className="section-overline">
                            01 · MOLINETES
                        </span>

                        <h2>
                            Seleccione los molinetes
                        </h2>

                        <p>
                            La configuración seleccionada se aplicará
                            a cada molinete.
                        </p>

                    </div>


                    <span className="selection-counter">

                        {molinetesSeleccionados.length}
                        {' '}
                        seleccionados

                    </span>

                </div>


                <div className="molinetes-selector">

                    {molinetes.map((molinete) => {

                        const seleccionado =
                            molinetesSeleccionados.includes(
                                molinete.codigo
                            );

                        return (

                            <label
                                key={molinete.codigo}
                                className={`molinete-card ${
                                    seleccionado
                                        ? 'selected'
                                        : ''
                                }`}
                            >

                                <input
                                    type="checkbox"
                                    checked={seleccionado}
                                    onChange={() =>
                                        onCambiarMolinete(
                                            molinete.codigo
                                        )
                                    }
                                />


                                <span className="molinete-check">
                                    <span />
                                </span>


                                <span className="molinete-card-icon">

                                    <PrecisionManufacturingOutlinedIcon />

                                </span>


                                <span className="molinete-card-info">

                                    <strong>
                                        {molinete.nombre}
                                    </strong>

                                    <span>
                                        {molinete.rpm}
                                        {' '}RPM
                                        {' · '}
                                        {molinete.perimetro}
                                        {' '}cm
                                    </span>

                                </span>

                            </label>

                        );

                    })}

                </div>

            </section>


            {/* =================================================
                02. CALCULO
                ================================================= */}

            <section className="nuevo-tigimoli-section">

                <div className="nuevo-tigimoli-section-header">

                    <div>

                        <span className="section-overline">
                            02 · CALCULO
                        </span>

                        <h2>
                            Configuración de tallas
                        </h2>

                        <p>
                            Seleccione las tallas y registre la
                            cantidad de rollos para cada una.
                        </p>

                    </div>

                </div>


                <div className="calculo-config-grid">


                    {/* =================================================
                        TALLAS
                        ================================================= */}

                    <div className="tallas-panel">

                        <span className="panel-label">
                            Tallas a utilizar
                        </span>


                        <div className="tallas-selector">

                            {tallas.map((talla) => {

                                const seleccionada =
                                    tallasSeleccionadas.includes(
                                        talla.codigo
                                    );

                                return (

                                    <button
                                        key={talla.codigo}
                                        type="button"
                                        className={`talla-option ${
                                            seleccionada
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            onCambiarTalla(
                                                talla.codigo
                                            )
                                        }
                                    >

                                        {talla.nombre}

                                    </button>

                                );

                            })}

                        </div>

                    </div>


                    {/* =================================================
                        TABLA
                        ================================================= */}

                    <div className="calculo-table-panel">

                        <span className="panel-label">
                            Detalle del Calculo
                        </span>


                        {Calculo.length === 0 ? (

                            <div className="empty-calculo">

                                Seleccione las tallas que harán
                                parte del Calculo.

                            </div>

                        ) : (

                            <div className="calculo-table-wrapper">

                                <table className="calculo-table">

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

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {Calculo.map(
                                            (talla) => (

                                                <tr
                                                    key={
                                                        talla.codigo
                                                    }
                                                >

                                                    <td className="calculo-size">

                                                        {talla.nombre}

                                                    </td>


                                                    <td>

                                                        <div className="rollos-field">

                                                            <div className="rollos-input">

                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="9999"
                                                                    step="1"
                                                                    value={talla.rollos}
                                                                    data-rollos-input
                                                                    className={
                                                                        erroresTallas[talla.codigo]
                                                                            ? 'input-error'
                                                                            : ''
                                                                    }
                                                                    onChange={(event) => {

                                                                        const valor = event.target.value;

                                                                        if (
                                                                            /^\d*$/.test(valor) &&
                                                                            valor.length <= 4
                                                                        ) {

                                                                            onCambiarRollos(
                                                                                talla.codigo,
                                                                                valor
                                                                            );

                                                                        }

                                                                    }}
                                                                    onKeyDown={(event) => {

                                                                        if (
                                                                            event.key === '.' ||
                                                                            event.key === ',' ||
                                                                            event.key === 'e' ||
                                                                            event.key === 'E' ||
                                                                            event.key === '+' ||
                                                                            event.key === '-'
                                                                        ) {
                                                                            event.preventDefault();
                                                                            return;
                                                                        }

                                                                        if (event.key === 'Enter') {

                                                                            event.preventDefault();

                                                                            const inputs = Array.from(
                                                                                document.querySelectorAll(
                                                                                    '[data-rollos-input]'
                                                                                )
                                                                            );

                                                                            const indiceActual =
                                                                                inputs.indexOf(event.currentTarget);

                                                                            const siguiente =
                                                                                inputs[indiceActual + 1];

                                                                            if (siguiente) {
                                                                                siguiente.focus();
                                                                                siguiente.select();
                                                                            }

                                                                        }

                                                                    }}
                                                                />


                                                                <button
                                                                    type="button"
                                                                    title="Agregar rollo"
                                                                    onClick={() =>
                                                                        onAgregarRollo(
                                                                            talla.codigo
                                                                        )
                                                                    }
                                                                >

                                                                    <AddOutlinedIcon />

                                                                </button>

                                                            </div>


                                                            {erroresTallas[
                                                                talla.codigo
                                                            ] && (

                                                                <span className="field-error">
                                                                    Ingrese una cantidad mayor que 0
                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>


                                                    <td className="calculo-meters">

                                                        {formatearNumero(
                                                            talla.metros
                                                        )}
                                                        {' '}m

                                                    </td>

                                                </tr>

                                            )
                                        )}


                                        <tr className="calculo-total-row">

                                            <td>
                                                Total
                                            </td>

                                            <td>
                                                {totalRollos}
                                            </td>

                                            <td>
                                                {formatearNumero(
                                                    totalMetros
                                                )}
                                                {' '}m
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </section>

        </>
    );

}


export default NuevoTigimoliForm;
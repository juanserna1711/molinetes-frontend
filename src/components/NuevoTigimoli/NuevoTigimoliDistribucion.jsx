/*=============================================================================
  Nombre responsabilidad: Distribuir la producción entre molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Presenta la matriz de distribución de rollos entre molinetes y tallas,
  permitiendo ajustar las RPM utilizadas para visualizar el resultado
  estimado de cada molinete.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/
import { useRef } from 'react';

function NuevoTigimoliDistribucion({
    molinetes,
    tallas,
    distribucion,
    molinetesHabilitados,
    rpmProgramacion,
    resultadosMolinetes,
    onCambiarMolinete,
    onCambiarDistribucion,
    onCambiarRpm,
    formatearNumero
}) {

    const inputsDistribucionRef = useRef({});

    function manejarNavegacionDistribucion(
    event,
    codigoMolinete,
    codigoTalla
) {

    const teclasNavegacion = [ 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight' ];

    if ( 
        !teclasNavegacion.includes(
            event.key
        )
    ) {
        return;
    }

    /*
      Evita el comportamiento nativo de los inputs numéricos, especialmente aumentar o disminuir el valor con las flechas.
    */
    event.preventDefault();

    const indiceMolinete = molinetes.findIndex((molinete) => molinete.codigo === codigoMolinete);

    const indiceTalla = tallas.findIndex((talla) => talla.codigo === codigoTalla);

    /*
      Lleva el foco a una combinación específica molinete-talla.
    */
    function enfocar(
        nuevoCodigoMolinete,
        nuevoCodigoTalla
    ) {

        const clave = `${nuevoCodigoMolinete}-${nuevoCodigoTalla}`;

        const input = inputsDistribucionRef.current[clave];

        if (input) {
            input.focus();
            input.select();
        }
    }

    /* =====================================================
       ABAJO / ENTER
       ===================================================== */

    if (
        event.key === 'ArrowDown' || event.key === 'Enter'
    ) {

        for (
            let indice = indiceMolinete + 1;
            indice < molinetes.length;
            indice++
        ) {
            const siguienteMolinete = molinetes[indice];

            if (
                !molinetesHabilitados.includes(siguienteMolinete.codigo)
            ) {
                continue;
            }


            enfocar(
                siguienteMolinete.codigo,
                codigoTalla
            );

            return;
        }

    }

    /* =====================================================
       ARRIBA
       ===================================================== */

    if (event.key === 'ArrowUp') {

        for (
            let indice = indiceMolinete - 1;
            indice >= 0;
            indice--
        ) {

            const anteriorMolinete = molinetes[indice];

            if (
                !molinetesHabilitados.includes(anteriorMolinete.codigo)
            ) {
                continue;
            }

            enfocar( anteriorMolinete.codigo, codigoTalla);

            return;

        }
    }

    /* =====================================================
       DERECHA
       ===================================================== */

    if ( event.key === 'ArrowRight' && indiceTalla < tallas.length - 1) {

        const siguienteTalla = tallas[indiceTalla + 1];

        enfocar(codigoMolinete, siguienteTalla.codigo);

    }

    /* =====================================================
       IZQUIERDA
       ===================================================== */

    if ( event.key === 'ArrowLeft' && indiceTalla > 0) {

        const anteriorTalla = tallas[indiceTalla - 1];

        enfocar(codigoMolinete, anteriorTalla.codigo);

    }

}

    /*
      Obtiene la cantidad de rollos asignada a una talla dentro de un molinete.
    */
    function obtenerCantidad(codigoMolinete, codigoTalla) {

        return distribucion[codigoMolinete]?.[codigoTalla] ?? '';

    }

    const totalRollosGeneral = molinetes.reduce( (total, molinete) => {

            const habilitado = molinetesHabilitados.includes(molinete.codigo);

            if (!habilitado) { return total; }

            const totalMolinete = tallas.reduce((subtotal, talla) => {

                        const cantidad = Number(distribucion[molinete.codigo]?.[talla.codigo] || 0);

                        return subtotal + cantidad;

                    },
                    0
                );

            return total + totalMolinete;

        },
        0
    );


    return (

        <section className="nuevo-tigimoli-section">

            <div className="nuevo-tigimoli-section-header">

                <div>

                    <span className="section-overline">
                        03 · DISTRIBUCIÓN
                    </span>

                    <h2>
                        Distribución por molinete
                    </h2>

                    <p>
                        Distribuya los rollos entre los molinetes y ajuste las RPM para comparar los tiempos de giro estimados.
                    </p>

                </div>

            </div>

            {tallas.length === 0 && (

                <div className="distribucion-empty">

                    <strong>
                        Aún no hay tallas para distribuir.
                    </strong>

                    <span>
                        Seleccione al menos una talla para habilitar la matriz de distribución.
                    </span>

                </div>

            )}

            {tallas.length > 0 && (

                <div className="distribucion-table-wrapper">

                    <table className="distribucion-table">

                        <thead>

                            <tr>

                                <th className="distribucion-molinete-column">
                                    Molinete
                                </th>

                                <th className="distribucion-rpm-column">
                                    RPM
                                </th>

                                {tallas.map((talla) => (

                                    <th key={talla.codigo}>

                                        <div className="distribucion-talla-header">

                                            <strong>
                                                {talla.nombre}
                                            </strong>

                                        </div>

                                    </th>

                                ))}

                                <th className="distribucion-resumen-column">
                                    Resumen
                                </th>

                                <th className="distribucion-tiempo-column">
                                    Tiempo giro
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {molinetes.map((molinete) => {

                                const habilitado = molinetesHabilitados.includes(molinete.codigo);

                                const resultado = resultadosMolinetes[molinete.codigo] || {
                                        totalRollos: 0,
                                        totalMetros: 0,
                                        cantidadTallas: 0,
                                        tiempoGiro: 0
                                    };

                                return (

                                    <tr
                                        key={molinete.codigo}
                                        className={habilitado ? '' : 'disabled'
                                        }
                                    >

                                        <td className="distribucion-molinete">

                                            <label
                                                className={`distribucion-molinete-info ${habilitado ? 'active' : ''}`}
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={habilitado}
                                                    onChange={() => onCambiarMolinete(molinete.codigo)}
                                                />

                                                <span className="distribucion-check">
                                                    <span />
                                                </span>

                                                <div>

                                                    <strong>
                                                        {molinete.nombre}
                                                    </strong>

                                                    <span>
                                                        {molinete.perimetro}
                                                        {' '}
                                                        cm
                                                    </span>

                                                </div>

                                            </label>

                                        </td>

                                        <td className="distribucion-rpm">

                                            <input
                                                type="number"
                                                min="1"
                                                max="999"
                                                step="1"
                                                inputMode="numeric"
                                                disabled={!habilitado}
                                                value={rpmProgramacion[molinete.codigo] ?? ''}
                                                onChange={(event) => {
                                                    const valor = event.target.value;

                                                    if (
                                                        /^\d*$/.test(valor) && valor.length <= 3
                                                    ) {
                                                        onCambiarRpm(molinete.codigo,valor);
                                                    }
                                                }}
                                                onKeyDown={(event) => {
                                                    if (['-', '+', 'e', 'E', '.', ','].includes(event.key)) {
                                                        event.preventDefault();
                                                    }

                                                }}
                                            />

                                        </td>

                                        {tallas.map((talla) => {

                                            const cantidad = obtenerCantidad(molinete.codigo,talla.codigo);

                                            return (
                                                <td
                                                    key={talla.codigo}
                                                    className="distribucion-celda"
                                                >
                                                    <input
                                                        ref={(elemento) => {
                                                            const clave =`${molinete.codigo}-${talla.codigo}`;

                                                            if (elemento) {
                                                                inputsDistribucionRef.current[clave] = elemento;
                                                            } else {
                                                                delete inputsDistribucionRef.current[clave];
                                                            }
                                                        }}
                                                        type="number"
                                                        min="0"
                                                        max="9999"
                                                        step="1"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                        disabled={!habilitado}
                                                        value={cantidad}
                                                        onChange={(event) => {
                                                            const valor = event.target.value;

                                                            if (/^\d*$/.test(valor) && valor.length <= 4) {
                                                                onCambiarDistribucion(molinete.codigo,talla.codigo,valor);
                                                            }

                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (['-','+','e','E','.',','].includes(event.key)) {
                                                                event.preventDefault();
                                                                return;
                                                            }
                                                            manejarNavegacionDistribucion(event, molinete.codigo, talla.codigo);
                                                        }}
                                                    />

                                                    <span>
                                                        {Number(cantidad || 0) > 0 ? `${formatearNumero(
                                                                Number(cantidad) * Number(talla.metrosRollo || 0)
                                                            )} m` : '—'}
                                                    </span>

                                                </td>

                                            );

                                        })}

                                        <td className="distribucion-resumen">

                                            <strong>
                                                {resultado.totalRollos}
                                                {' '}
                                                rollos
                                            </strong>

                                            <span>
                                                {resultado.cantidadTallas}
                                                {' '}
                                                {resultado.cantidadTallas === 1 ? 'talla' : 'tallas'}
                                            </span>

                                            <span>
                                                {formatearNumero(resultado.totalMetros)}
                                                {' '}
                                                m
                                            </span>

                                        </td>

                                        <td className="distribucion-tiempo">

                                            <strong>
                                                {formatearNumero(resultado.tiempoGiro)}
                                            </strong>

                                            <span>
                                                min
                                            </span>

                                        </td>

                                    </tr>

                                );
                            })}

                        </tbody>

                        <tfoot>

                            <tr className="distribucion-total-row">

                                <td className="distribucion-total-label">
                                    Total
                                </td>

                                <td>
                                    —
                                </td>

                                {tallas.map((talla) => {

                                    const totalTalla = molinetes.reduce((total, molinete) => {

                                            const habilitado = molinetesHabilitados.includes(molinete.codigo);

                                            if (!habilitado) {return total;}

                                            const cantidad = Number(distribucion[molinete.codigo]?.[talla.codigo] || 0);

                                            return total + cantidad;

                                        },
                                        0
                                    );

                                    return (

                                        <td
                                            key={talla.codigo}
                                            className="distribucion-total-talla"
                                        >

                                            <strong>
                                                {totalTalla}
                                            </strong>

                                            <span>
                                                rollos
                                            </span>

                                        </td>

                                    );

                                })}

                                <td className="distribucion-total-talla">

                                    <strong>
                                        {totalRollosGeneral}
                                    </strong>

                                    <span>
                                        rollos
                                    </span>

                                </td>

                                <td>
                                    —
                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>

            )}

        </section>

    );

}


export default NuevoTigimoliDistribucion;
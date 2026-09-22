/*=============================================================================
  Nombre responsabilidad: Presentar el tiempo calculado por molinete

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Muestra tarjetas con RPM, perímetro, metros totales y tiempo de giro en minutos.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';


function NuevoTigimoliResultados({
    molinetesCalculo,
    totalMetros,
    calcularTiempoGiro,
    formatearNumero
}) {

    return (

        <section className="nuevo-tigimoli-section">

            <div className="nuevo-tigimoli-section-header">

                <div>

                    <span className="section-overline">
                        03 · RESULTADO
                    </span>

                    <h2>
                        Calculo por molinete
                    </h2>

                    <p>
                        El tiempo de giro se calcula individualmente
                        según el RPM y perímetro de cada molinete.
                    </p>

                </div>

            </div>


            {molinetesCalculo.length === 0 ? (

                <div className="empty-results">

                    <PrecisionManufacturingOutlinedIcon />

                    <strong>
                        Seleccione uno o varios molinetes
                    </strong>

                    <span>
                        Aquí aparecerá el cálculo correspondiente
                        a cada molinete.
                    </span>

                </div>

            ) : (

                <div className="result-molinetes-grid">

                    {molinetesCalculo.map(
                        (molinete) => {

                            const tiempoGiro =
                                calcularTiempoGiro(
                                    molinete
                                );

                            return (

                                <article
                                    key={
                                        molinete.codigo
                                    }
                                    className={`molinete-result-card ${
                                        molinetesCalculo.length === 1
                                            ? 'single'
                                            : ''
                                    }`}
                                >

                                    {/* CABECERA */}

                                    <div className="result-card-header">

                                        <div className="result-molinete-title">

                                            <span className="result-molinete-icon">

                                                <PrecisionManufacturingOutlinedIcon />

                                            </span>


                                            <div>

                                                <span>
                                                    MOLINETE
                                                </span>

                                                <h3>
                                                    {molinete.nombre}
                                                </h3>

                                            </div>

                                        </div>

                                    </div>


                                    {/* DATOS */}

                                    <div className="result-machine-data">

                                        <div>

                                            <span>
                                                RPM
                                            </span>

                                            <strong>
                                                {molinete.rpm}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Perímetro
                                            </span>

                                            <strong>
                                                {molinete.perimetro}
                                                {' '}cm
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Total metros
                                            </span>

                                            <strong>
                                                {formatearNumero(
                                                    totalMetros
                                                )}
                                                {' '}m
                                            </strong>

                                        </div>

                                    </div>


                                    {/* TIEMPO */}

                                    <div className="result-time-box">

                                        <AccessTimeOutlinedIcon />

                                        <div>

                                            <span>
                                                Tiempo de giro
                                            </span>

                                            <strong>
                                                {formatearNumero(
                                                    tiempoGiro
                                                )}
                                                {' '}min
                                            </strong>

                                        </div>

                                    </div>

                                </article>

                            );

                        }
                    )}

                </div>

            )}

        </section>

    );

}


export default NuevoTigimoliResultados;
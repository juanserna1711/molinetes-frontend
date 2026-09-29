/*=============================================================================
  Nombre responsabilidad: Seleccionar tallas de la programación

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Presenta las tallas disponibles y permite seleccionar las que harán parte
  de la distribución de la programación TIGIMOLI.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

function NuevoTigimoliTallas({
    tallas,
    tallasSeleccionadas,
    onCambiarTalla
}) {

    return (

        <section className="nuevo-tigimoli-section">

            <div className="nuevo-tigimoli-section-header">

                <div>

                    <span className="section-overline">
                        02 · TALLAS
                    </span>

                    <h2>
                        Tallas de la programación
                    </h2>

                    <p>
                        Seleccione las tallas que harán parte de la distribución.
                    </p>

                </div>

            </div>


            <div className="tallas-selector">

                {tallas.map((talla) => {

                    const seleccionada = tallasSeleccionadas.includes(talla.codigo);

                    return (

                        <button
                            key={talla.codigo}
                            type="button"
                            className={`talla-option ${seleccionada ? 'selected' : ''}`}
                            onClick={() => onCambiarTalla(talla.codigo)}
                        >
                            {talla.nombre}
                        </button>

                    );

                })}

            </div>

        </section>

    );

}

export default NuevoTigimoliTallas;
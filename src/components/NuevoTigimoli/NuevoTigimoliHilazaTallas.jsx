/*=============================================================================
  Nombre responsabilidad: Seleccionar tipo de hilaza y tallas de la programación

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 30/Septiembre/2026

  Descripcion responsabilidad:
  Presenta los tipos de hilaza y las tallas disponibles para seleccionar
  los parámetros que harán parte de la programación TIGIMOLI.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

/*
  Renderiza los catálogos y selecciones que administra la página; los callbacks envían códigos.
  La comparación de hilaza convierte ambos códigos a texto para tolerar números o cadenas.
  programacionHabilitada determina la presentación bloqueada del panel de tallas.
*/
function NuevoTigimoliHilazaTallas({
    tiposHilaza,
    tipoHilazaSeleccionado,
    onCambiarTipoHilaza,
    tallas,
    tallasSeleccionadas,
    onCambiarTalla,
    programacionHabilitada
}) {

    return (
        <section className="nuevo-tigimoli-section">

            <div className="nuevo-tigimoli-hilaza-tallas">

                <div className="nuevo-tigimoli-hilaza-panel">
                    
                    <div>
                        <span className="section-overline">
                            01 · HILAZA
                        </span>
                    </div>

                    <h2>Tipo de Hilaza</h2>

                    <p>Seleccione la hilaza que se utilizará para la programación.</p>


                    <div className="tallas-selector">

                        {tiposHilaza.map((tipo) => {
                            const seleccionada = String(tipoHilazaSeleccionado) === String(tipo.codigo);
                            return (

                                <button
                                    key={tipo.codigo}
                                    type="button"
                                    className={`talla-option ${seleccionada ? 'selected' : ''}`}
                                    onClick={() => onCambiarTipoHilaza(tipo.codigo)}
                                >
                                    {tipo.nombre}
                                </button>

                            );

                        })}

                    </div>

                </div>

                <div
                    className={!programacionHabilitada ? 'nuevo-tigimoli-tallas-panel disabled' : 'nuevo-tigimoli-tallas-panel'}
                >

                    <div>
                        <span className="section-overline">
                            02 · TALLAS
                        </span>
                    </div>

                    <h2>Tallas</h2>

                    <p>Seleccione las tallas que harán parte de la distribución.</p>

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

                </div>

            </div>

        </section>
    );
}

export default NuevoTigimoliHilazaTallas;
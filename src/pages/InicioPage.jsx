/*=============================================================================
  Nombre responsabilidad: Presentar la pantalla de inicio

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 30/Septiembre/2026

  Descripcion responsabilidad:
  Muestra la bienvenida a MOLIPLUS y resume las principales áreas
  disponibles en la aplicación.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';

import logoMoliplus from '../assets/logo-moliplus.png';

import '../styles/inicio.css';

// Presenta las áreas del sistema como contenido informativo, sin cargar catálogos ni programaciones.
function InicioPage() {

    return (
        <section className="page inicio-page">

            {/* =====================================================
                CABECERA
            ====================================================== */}

            <header className="inicio-header">

                <div className="inicio-header-info">

                    <h1>Bienvenido a</h1>
                    
                    <img
                        src={logoMoliplus}
                        alt="MOLIPLUS"
                        className="inicio-logo"
                    />

                    <p>Gestione los parámetros textiles y las operaciones necesarias para la programación de producción.</p>

                </div>

            </header>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <main className="inicio-content">


                <div className="inicio-cards">

                    <article className="inicio-card">

                        <div className="inicio-card-icon">
                            <TuneOutlinedIcon />
                        </div>

                        <div className="inicio-card-content">

                            <h2>Parámetros</h2>

                            <p>Administre la información base utilizada por los procesos de MOLIPLUS.</p>

                            <ul>
                                <li>Tallas</li>
                                <li>Usuarios</li>
                                <li>Molinetes</li>
                                <li>Tipos de hilaza y promedios</li>
                                <li>Rendimientos por talla</li>
                            </ul>

                        </div>

                    </article>

                    <article className="inicio-card">

                        <div className="inicio-card-icon">
                            <PrecisionManufacturingOutlinedIcon />
                        </div>

                        <div className="inicio-card-content">

                            <h2>Operaciones</h2>

                            <p>Realice la programación y consulte las órdenes generadas.</p>

                            <ul>
                                <li>Cálculo de tiempo de giro</li>
                                <li>Distribución por molinete</li>
                                <li>Generación de órdenes de trabajo</li>
                                <li>Consulta e impresión de órdenes</li>
                            </ul>

                        </div>

                    </article>

                </div>

            </main>


            {/* =====================================================
                PIE DE PÁGINA
            ====================================================== */}

            <footer className="inicio-footer">

                <span>
                    © 2026 MOLIPLUS
                </span>

            </footer>

        </section>
    );
}

export default InicioPage;
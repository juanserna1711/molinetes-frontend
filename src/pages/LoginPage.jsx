/*=============================================================================
  Nombre responsabilidad: Presentar la pantalla de acceso

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Muestra el formulario y la identidad visual de MOLIPLUS.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useNavigate } from 'react-router-dom';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import logoMoliplus from '../assets/logo-moliplus.png';
import logoTextilesPacifico from '../assets/logo-textiles-pacifico.png';
import ondasMoliplus from '../assets/ondas-moliplus.png';

function LoginPage() {
    const navigate = useNavigate();

    const manejarRedireccion = () => {
    navigate('/tallas'); 
    };

    return (
        <div className="login-page">

            {/* =====================================================
                DECORACIÓN SUPERIOR
            ====================================================== */}

            <div className="login-top-decoration">
                <span />
                <span />
                <span />
                <span />
            </div>


            {/* =====================================================
                MARCA
            ====================================================== */}

            <header className="login-header">

                <img
                    src={logoMoliplus}
                    alt="MOLIPLUS"
                    className="login-logo-moliplus"
                />

                <div className="login-header-divider" />

                <img
                    src={logoTextilesPacifico}
                    alt="Textiles del Pacífico"
                    className="login-logo-company"
                />

            </header>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <main className="login-content">

                <section className="login-card">

                    <div className="login-card-header">

                        <h1>
                            Bienvenido
                        </h1>

                        <p>
                            Ingresa tus credenciales para acceder a MOLIPLUS.
                        </p>

                    </div>


                    {/* =================================================
                        FORMULARIO
                    ================================================== */}

                    <form className="login-form">

                        <div className="login-form-group">

                            <label htmlFor="usuario">
                                Usuario
                            </label>

                            <div className="login-input-wrapper">

                                <PersonOutlineOutlinedIcon />

                                <input
                                    id="usuario"
                                    type="text"
                                    placeholder="Ingrese su usuario"
                                />

                            </div>

                        </div>


                        <div className="login-form-group">

                            <label htmlFor="password">
                                Contraseña
                            </label>

                            <div className="login-input-wrapper">

                                <LockOutlinedIcon />

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                />

                                <button
                                    type="button"
                                    className="login-password-button"
                                    title="Mostrar contraseña"
                                >
                                    <VisibilityOutlinedIcon />
                                </button>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="login-button"
                            onClick={manejarRedireccion}
                        >
                            Ingresar
                        </button>

                    </form>


                    <div className="login-card-footer">

                        <span>
                            Sistema de gestión industrial
                        </span>

                    </div>

                </section>

            </main>


            {/* =====================================================
                DECORACIÓN INFERIOR
            ====================================================== */}

            <div className="login-bottom-decoration">

                <img
                    src={ondasMoliplus}
                    alt=""
                    className="login-wave"
                />

                <div className="login-bottom-lines">
                    <span />
                    <span />
                    <span />
                </div>

            </div>


            {/* =====================================================
                PIE DE PÁGINA
            ====================================================== */}

            <footer className="login-footer">

                <span>
                    © 2026 MOLIPLUS
                </span>

            </footer>

        </div>
    );
}

export default LoginPage;
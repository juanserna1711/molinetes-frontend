/*=============================================================================
  Nombre responsabilidad: Componer el marco de las pantallas operativas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Integra Sidebar, la barra superior y el contenido de las rutas anidadas.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import Sidebar from './Sidebar';

import logoMoliplus from '../assets/logo-moliplus.png';
import logoTextilesPacifico from '../assets/logo-textiles-pacifico.png';

function Layout({ children }) {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    function alternarSidebar() {
        setSidebarAbierto((estado) => !estado);
    }

    return (
        <div className="app-container">

            <Sidebar abierto={sidebarAbierto} />

            <div className="workspace">

                <header className="topbar">

                    {/* =================================================
                        MENÚ
                    ================================================== */}
                    <div className="topbar-left">
                    <button
                        type="button"
                        className="menu-button"
                        onClick={alternarSidebar}
                        title={
                            sidebarAbierto
                                ? 'Ocultar menú'
                                : 'Mostrar menú'
                        }
                    >
                        <MenuIcon />
                    </button>


                    {/* =================================================
                        IDENTIDAD MOLIPLUS
                    ================================================== */}

                    <div className="topbar-brand">

                        <img
                            src={logoMoliplus}
                            alt="MOLIPLUS"
                            className="topbar-logo-moliplus"
                        />

                    </div>

                    </div>


                    <div className="topbar-center"/>


                    {/* =================================================
                        LOGO EMPRESA
                    ================================================== */}

                    <div className="topbar-right">

                    <div className="topbar-company">

                        <img
                            src={logoTextilesPacifico}
                            alt="Textiles del Pacífico"
                            className="topbar-logo-company"
                        />

                    </div>


                    {/* =================================================
                        USUARIO
                    ================================================== */}

                    <div className="topbar-user">

                        <div className="topbar-user-avatar">

                            <PersonOutlineOutlinedIcon />

                        </div>

                        <div className="topbar-user-info">

                            <span className="topbar-user-name">
                                Usuario
                            </span>

                            <span className="topbar-user-role">
                                Operador
                            </span>

                        </div>

                    </div>

                    </div>

                </header>


                {/* =====================================================
                    CONTENIDO
                ====================================================== */}

                <main className="content">
                    {children}
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Layout;
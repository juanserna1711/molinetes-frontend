/*=============================================================================
  Nombre responsabilidad: Presentar la navegación de los módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Organiza la navegación de la aplicación en grupos desplegables
  de parámetros y operaciones.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import StraightenIcon from '@mui/icons-material/Straighten';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import logoMoliplus from '../assets/logo-moliplus-solo.png';

function Sidebar({ abierto }) {

    const [parametrosAbiertos, setParametrosAbiertos] = useState(true);
    const [operacionesAbiertas, setOperacionesAbiertas] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const rutasParametros = [
        '/tallas',
        '/usuarios',
        '/molinetes',
        '/tipos-hilaza',
        '/tipos-hilaza-prom',
        '/rendimiento-tallas'
    ];
    const rutasOperaciones = [
        '/nuevo-tigimoli',
        '/ordeprod'
    ];

    /*
    Abre o cierra el grupo de parámetros. Si la pantalla actual
    pertenece al grupo que se está cerrando, regresa al inicio.
    */
    function cambiarParametros() {

        if (parametrosAbiertos && rutasParametros.includes(location.pathname)) {

                navigate('/inicio');

        }

        setParametrosAbiertos(!parametrosAbiertos);

    }

    /*
    Abre o cierra el grupo de operaciones. Si la pantalla actual
    pertenece al grupo que se está cerrando, regresa al inicio.
    */
    function cambiarOperaciones() {

        if (operacionesAbiertas && rutasOperaciones.includes(location.pathname)) {

            navigate('/inicio');

        }

        setOperacionesAbiertas(!operacionesAbiertas);

    }

    return (
        <aside className={`sidebar ${abierto ? 'sidebar-open' : 'sidebar-closed'}`}>

            <nav className="sidebar-navigation">

                {/* =================================================
                    PARÁMETROS
                ================================================== */}

                <div className="sidebar-group">

                    <button
                        type="button"
                        className="sidebar-group-button"
                        onClick={cambiarParametros}
                    >
                        <span>
                            Parámetros
                        </span>

                        <KeyboardArrowDownOutlinedIcon
                            className={ parametrosAbiertos ? 'sidebar-group-arrow open' : 'sidebar-group-arrow' }
                        />
                    </button>

                    {parametrosAbiertos && (

                        <div className="sidebar-group-items">

                            <NavLink
                                to="/tallas"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <SettingsOutlinedIcon />

                                <span>
                                    Gestión de Tallas
                                </span>
                            </NavLink>


                            <NavLink
                                to="/usuarios"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <GroupsOutlinedIcon />

                                <span>
                                    Gestión de Usuarios
                                </span>
                            </NavLink>


                            <NavLink
                                to="/molinetes"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <PrecisionManufacturingOutlinedIcon />

                                <span>
                                    Gestión de Molinetes
                                </span>
                            </NavLink>


                            <NavLink
                                to="/tipos-hilaza"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <TextureOutlinedIcon />

                                <span>
                                    Gestión de Tipos de Hilaza
                                </span>
                            </NavLink>


                            <NavLink
                                to="/tipos-hilaza-prom"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <FunctionsOutlinedIcon />

                                <span>
                                    Promedios por Tipo de Hilaza
                                </span>
                            </NavLink>


                            <NavLink
                                to="/rendimiento-tallas"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <StraightenIcon />

                                <span>
                                    Gestión de Rendimiento
                                </span>
                            </NavLink>

                        </div>

                    )}

                </div>


                {/* =================================================
                    OPERACIONES
                ================================================== */}

                <div className="sidebar-group">

                    <button
                        type="button"
                        className="sidebar-group-button"
                        onClick={cambiarOperaciones}
                    >
                        <span>
                            Operaciones
                        </span>

                        <KeyboardArrowDownOutlinedIcon
                            className={
                                operacionesAbiertas
                                    ? 'sidebar-group-arrow open'
                                    : 'sidebar-group-arrow'
                            }
                        />
                    </button>


                    {operacionesAbiertas && (

                        <div className="sidebar-group-items">

                            <NavLink
                                to="/nuevo-tigimoli"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <CalculateOutlinedIcon />

                                <span>
                                    Tiempo de Giro
                                </span>
                            </NavLink>


                            <NavLink
                                to="/ordeprod"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <HistoryOutlinedIcon />

                                <span>
                                    Consulta de Órdenes de Producción
                                </span>
                            </NavLink>

                        </div>

                    )}

                </div>

            </nav>


            {/* =====================================================
                ELEMENTO DECORATIVO
            ====================================================== */}

            <div className="sidebar-decoration">

                <img
                    src={logoMoliplus}
                    alt=""
                    className="sidebar-wave"
                />

                <div className="sidebar-footer-line" />

                <span className="sidebar-footer-text">
                    La calidad también se gestiona
                </span>

            </div>

        </aside>
    );
}

export default Sidebar;
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
import { usePermisosContext } from '../contexts/PermisosContext.jsx';
import StraightenIcon from '@mui/icons-material/Straighten';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import logoMoliplus from '../assets/logo-moliplus-solo.png';

// abierto controla el panel completo; los grupos mantienen su propia apertura y navegan al inicio al cerrarse.
function Sidebar({ abierto }) {

    const [parametrosAbiertos, setParametrosAbiertos] = useState(true);
    const [operacionesAbiertas, setOperacionesAbiertas] = useState(true);
    const [configuracionesAbiertas, setConfiguracionesAbiertas] = useState(true);
    const {permisosPorModulo, loadingPermisos} = usePermisosContext();
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
    const rutasConfiguraciones = [
        '/modulos'
    ];

    //Abre o cierra el grupo de parámetros. Si la pantalla actual pertenece al grupo que se está cerrando, regresa al inicio.
    function cambiarParametros() {

        if (parametrosAbiertos && rutasParametros.includes(location.pathname)) {

                navigate('/inicio');

        }

        setParametrosAbiertos(!parametrosAbiertos);

    }

    //Abre o cierra el grupo de operaciones. Si la pantalla actual pertenece al grupo que se está cerrando, regresa al inicio.
    function cambiarOperaciones() {

        if (operacionesAbiertas && rutasOperaciones.includes(location.pathname)) {

            navigate('/inicio');

        }

        setOperacionesAbiertas(!operacionesAbiertas);

    }

    //Abre o cierra el grupo de configuraciones. Si la pantalla actual pertenece al grupo que se está cerrando, regresa al inicio.
    function cambiarConfiguraciones() {

        if (configuracionesAbiertas && rutasConfiguraciones.includes(location.pathname)) {

            navigate('/inicio');

        }

        setConfiguracionesAbiertas(!configuracionesAbiertas);

    }

    function puedeConsultar(codigoModulo) {

        return permisosPorModulo[codigoModulo]?.consulta === true;
    }

    const mostrarParametros =
        puedeConsultar(1) ||
        puedeConsultar(2) ||
        puedeConsultar(3) ||
        puedeConsultar(4) ||
        puedeConsultar(5) ||
        puedeConsultar(6);

    const mostrarOperaciones =
        puedeConsultar(7) ||
        puedeConsultar(8);

    const mostrarConfiguraciones =
        puedeConsultar(9) ||
        puedeConsultar(10);

    return (
        <aside className={`sidebar ${abierto ? 'sidebar-open' : 'sidebar-closed'}`}>

            <nav className="sidebar-navigation">

                {/* =================================================
                    PARÁMETROS
                ================================================== */}

                {mostrarParametros && (
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

                            {puedeConsultar(1) && (
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
                            )}

                            {puedeConsultar(2) && (
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
                            )}

                            {puedeConsultar(3) && (
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
                            )}

                            {puedeConsultar(4) && (
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
                            )}

                            {puedeConsultar(5) && (
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
                            )}

                            {puedeConsultar(6) && (
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
                            )}

                        </div>

                    )}

                </div>
                )}


                {/* =================================================
                    OPERACIONES
                ================================================== */}

                {mostrarOperaciones && (
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
                            className={operacionesAbiertas ? 'sidebar-group-arrow open' : 'sidebar-group-arrow'}
                        />
                    </button>


                    {operacionesAbiertas && (

                        <div className="sidebar-group-items">

                            {puedeConsultar(7) && (
                            <NavLink
                                to="/nuevo-tigimoli"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <CalculateOutlinedIcon />

                                <span>
                                    Tiempo de Giro
                                </span>
                            </NavLink>
                            )}

                            {puedeConsultar(8) && (
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
                            )}

                        </div>

                    )}

                </div>
                )}

                {/* =================================================
                    CONFIGURACION
                ================================================== */}

                {mostrarConfiguraciones && (
                <div className="sidebar-group">

                    <button
                        type="button"
                        className="sidebar-group-button"
                        onClick={cambiarConfiguraciones}
                    >
                        <span>
                            Configuraciones
                        </span>

                        <KeyboardArrowDownOutlinedIcon
                            className={configuracionesAbiertas ? 'sidebar-group-arrow open' : 'sidebar-group-arrow'}
                        />
                    </button>


                    {configuracionesAbiertas && (

                        <div className="sidebar-group-items">

                            {puedeConsultar(9) && (
                            <NavLink
                                to="/modulos"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <ViewModuleIcon />

                                <span>
                                    Modulos
                                </span>
                            </NavLink>
                            )}

                            {puedeConsultar(10) && (
                            <NavLink
                                to="/reglas"
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <VpnKeyIcon />

                                <span>
                                    Reglas
                                </span>
                            </NavLink>
                            )}

                        </div>

                    )}

                </div>
                )}
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
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
    const [seguridadAbiertas, setSeguridadAbiertas] = useState(true);
    const {permisosPorModulo} = usePermisosContext();
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
    const rutasSeguridad = [
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

    //Abre o cierra el grupo de seguridad. Si la pantalla actual pertenece al grupo que se está cerrando, regresa al inicio.
    function cambiarSeguridad() {

        if (seguridadAbiertas && rutasSeguridad.includes(location.pathname)) {

            navigate('/inicio');

        }

        setSeguridadAbiertas(!seguridadAbiertas);

    }

    function puedeConsultar(codigoModulo) {

        return permisosPorModulo[codigoModulo]?.consulta === true;
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
                                aria-disabled={!puedeConsultar(1)}
                                onClick={(event) => {
                                    if (!puedeConsultar(1)) {
                                        event.preventDefault();
                                    }
                                }}
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(1) ? 'disabled' : ''}`}
                            >
                                <SettingsOutlinedIcon />

                                <span>
                                    Gestión de Tallas
                                </span>
                            </NavLink>

                            <NavLink
                                to="/usuarios"
                                aria-disabled={!puedeConsultar(2)}
                                onClick={(event) => {
                                    if (!puedeConsultar(2)) {
                                        event.preventDefault();
                                    }
                                }}
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(2) ? 'disabled' : ''}`}
                            >
                                <GroupsOutlinedIcon />

                                <span>
                                    Gestión de Usuarios
                                </span>
                            </NavLink>
 
                            <NavLink
                                to="/molinetes"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(3) ? 'disabled' : ''}`}
                            >
                                <PrecisionManufacturingOutlinedIcon />

                                <span>
                                    Gestión de Molinetes
                                </span>
                            </NavLink>

                            <NavLink
                                to="/tipos-hilaza"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(4) ? 'disabled' : ''}`}
                            >
                                <TextureOutlinedIcon />

                                <span>
                                    Gestión de Tipos de Hilaza
                                </span>
                            </NavLink>

                            <NavLink
                                to="/tipos-hilaza-prom"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(5) ? 'disabled' : ''}`}
                            >
                                <FunctionsOutlinedIcon />

                                <span>
                                    Promedios por Tipo de Hilaza
                                </span>
                            </NavLink>

                            <NavLink
                                to="/rendimiento-tallas"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(6) ? 'disabled' : ''}`}
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
                            className={operacionesAbiertas ? 'sidebar-group-arrow open' : 'sidebar-group-arrow'}
                        />
                    </button>


                    {operacionesAbiertas && (

                        <div className="sidebar-group-items">

                            <NavLink
                                to="/nuevo-tigimoli"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(7) ? 'disabled' : ''}`}
                            >
                                <CalculateOutlinedIcon />

                                <span>
                                    Tiempo de Giro
                                </span>
                            </NavLink>

                            <NavLink
                                to="/ordeprod"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(8) ? 'disabled' : ''}`}
                            >
                                <HistoryOutlinedIcon />

                                <span>
                                    Consulta de Órdenes de Producción
                                </span>
                            </NavLink>

                        </div>

                    )}

                </div>

                {/* =================================================
                    SEGURIDAD
                ================================================== */}
                <div className="sidebar-group">

                    <button
                        type="button"
                        className="sidebar-group-button"
                        onClick={cambiarSeguridad}
                    >
                        <span>
                            Seguridad
                        </span>

                        <KeyboardArrowDownOutlinedIcon
                            className={seguridadAbiertas ? 'sidebar-group-arrow open' : 'sidebar-group-arrow'}
                        />
                    </button>


                    {seguridadAbiertas && (

                        <div className="sidebar-group-items">

                            <NavLink
                                to="/modulos"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(9) ? 'disabled' : ''}`}
                            >
                                <ViewModuleIcon />

                                <span>
                                    Modulos
                                </span>
                            </NavLink>

                            <NavLink
                                to="/reglas"
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${!puedeConsultar(10) ? 'disabled' : ''}`}
                            >
                                <VpnKeyIcon />

                                <span>
                                    Reglas
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
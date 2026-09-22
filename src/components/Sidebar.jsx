/*=============================================================================
  Nombre responsabilidad: Presentar la navegación de los módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Muestra enlaces NavLink a tallas, usuarios, molinetes, rendimientos y las dos pantallas TIGIMOLI.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { NavLink } from 'react-router-dom';

import StraightenIcon from '@mui/icons-material/Straighten';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';

import logoMoliplus from '../assets/logo-moliplus-solo.png';

function Sidebar({ abierto }) {
    return (
        <aside
            className={`sidebar ${
                abierto ? 'sidebar-open' : 'sidebar-closed'
            }`}
        >

            {/* =====================================================
                NAVEGACIÓN
            ====================================================== */}

            <nav className="sidebar-navigation">

                <div className="sidebar-section-title">
                    Operación
                </div>


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
                    to="/tigimoli"
                    className={({ isActive }) =>
                        `sidebar-item ${isActive ? 'active' : ''}`
                    }
                >
                    <HistoryOutlinedIcon />

                    <span>
                        Consulta de Tiempos de Giro
                    </span>
                </NavLink>


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

                <div className="sidebar-footer-line"/>

                <span className="sidebar-footer-text">
                    La calidad también se gestiona
                </span>

            </div>

        </aside>
    );
}

export default Sidebar;
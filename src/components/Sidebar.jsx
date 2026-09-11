import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';

function Sidebar({ abierto }) {
    return (
        <aside className={`sidebar ${abierto ? 'sidebar-open' : 'sidebar-closed'}`}>

            <div className="sidebar-brand">
                <div className="sidebar-brand-name">
                    TEXTILES
                </div>

                <div className="sidebar-brand-subtitle">
                    Control Industrial
                </div>
            </div>

            <div className="sidebar-user">
                <PersonOutlineIcon className="sidebar-user-icon" />

                <div className="sidebar-user-info">
                    <span className="sidebar-user-label">
                        Usuario
                    </span>

                    <span className="sidebar-user-role">
                        Operador
                    </span>
                </div>
            </div>

            <nav className="sidebar-navigation">

                <div className="sidebar-section-title">
                    Operación
                </div>

                <button
                    type="button"
                    className="sidebar-item active"
                >
                    <StraightenIcon />

                    <span>
                        Gestión de Tallas
                    </span>
                </button>

            </nav>

        </aside>
    );
}

export default Sidebar;
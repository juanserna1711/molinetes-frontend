import {
    User,
    Menu,
    Settings,
    Factory,
    Gauge
} from 'lucide-react';

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-title">
                Textiles
            </div>

            <div className="user-card">
                <User size={64} strokeWidth={1.5} />
                <span>Usuario</span>
            </div>

            <div className="sidebar-section">
                Registro Molinetes
            </div>

            <button className="sidebar-item">
                <Gauge size={18} />
                T. Giro Molinete
            </button>

            <button className="sidebar-item active">
                <Factory size={18} />
                Gestión de Tallas
            </button>

            <button className="sidebar-item">
                <Settings size={18} />
                Ajustes
            </button>

        </aside>
    );
}

export default Sidebar;
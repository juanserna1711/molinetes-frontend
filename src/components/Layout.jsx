import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import Sidebar from './Sidebar';

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

                    <button
                        type="button"
                        className="menu-button"
                        onClick={alternarSidebar}
                        title={sidebarAbierto ? 'Ocultar menú' : 'Mostrar menú'}
                    >
                        <MenuIcon />
                    </button>

                    <span className="topbar-title">
                        Textiles
                    </span>

                </header>

                <main className="content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;
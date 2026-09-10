import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

function Layout({ children }) {

    return (
        <div className="app-container">

            <header className="topbar">

                <button className="menu-button">
                    <Menu size={20} />
                </button>

                <span className="topbar-title">
                    Textiles
                </span>

            </header>

            <div className="main-container">

                <Sidebar />

                <main className="content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default Layout;
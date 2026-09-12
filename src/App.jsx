import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TallasPage from './pages/TallasPage';
import RendTallasPage from './pages/RendTallasPage';

function App() {
    return (
        <Layout>
            <Routes>
                {/* Redirección inicial a una ruta por defecto al entrar a la app */}
                <Route path="/" element={<Navigate to="/rendimiento-tallas" replace />} />

                {/* Rutas principales */}
                <Route path="/rendimiento-tallas" element={<RendTallasPage />} />
                <Route path="/tallas" element={<TallasPage />} />

                {/* Ruta por si intentan entrar a una URL que no existe */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </Layout>
    );
}

export default App;
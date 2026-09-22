/*=============================================================================
  Nombre responsabilidad: Definir las rutas de MOLIPLUS

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  App organiza las pantallas con React Router y agrupa la operación dentro de Layout.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TallasPage from './pages/TallasPage';
import RendTallasPage from './pages/RendTallasPage';
import UsuariosPage from './pages/UsuariosPage';
import MolinetesPage from './pages/MolinetesPage';
import LoginPage from './pages/LoginPage';
import TigimoliPage from './pages/TigimoliPage'
import NuevoTigimoliPage from './pages/NuevoTigimoliPage'

function App() {
    return (
            <Routes>
                {/* Redirección inicial a una ruta por defecto al entrar a la app */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rutas principales */}
                <Route path="/login" element={<LoginPage />} />
                <Route element={<Layout />}>
                <Route path="/rendimiento-tallas" element={<RendTallasPage />} />
                <Route path="/tallas" element={<TallasPage />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
                <Route path="/molinetes" element={<MolinetesPage />} />
                <Route path="/tigimoli" element={<TigimoliPage />} />
                <Route path="/nuevo-tigimoli" element={<NuevoTigimoliPage />} />
                </Route>
                {/* Ruta por si intentan entrar a una URL que no existe */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
    );
}

export default App;
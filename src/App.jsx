/*=============================================================================
  Nombre responsabilidad: Definir las rutas de MOLIPLUS

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

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
import OrdeProdPage from './pages/OrdeProdPage';
import NuevoTigimoliPage from './pages/NuevoTigimoliPage';
import TiposHilazaPage from './pages/TiposHilazaPage';
import TiHiPromPage from './pages/TiHiPromPage';

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
                <Route path="/ordeprod" element={<OrdeProdPage />} />                
                <Route path="/nuevo-tigimoli" element={<NuevoTigimoliPage />} />
                <Route path="/tipos-hilaza" element={<TiposHilazaPage />} />
                <Route path="/tipos-hilaza-prom" element={<TiHiPromPage />} />
                </Route>
                {/* Ruta por si intentan entrar a una URL que no existe */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
    );
}

export default App;
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
import PermissionRoute from './routes/PermissionRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import InicioPage from './pages/InicioPage';
import TallasPage from './pages/TallasPage';
import RendTallasPage from './pages/RendTallasPage';
import UsuariosPage from './pages/UsuariosPage';
import MolinetesPage from './pages/MolinetesPage';
import LoginPage from './pages/LoginPage';
import OrdeProdPage from './pages/OrdeProdPage';
import NuevoTigimoliPage from './pages/NuevoTigimoliPage';
import TiposHilazaPage from './pages/TiposHilazaPage';
import TiHiPromPage from './pages/TiHiPromPage';
import ModulosPage from './pages/ModulosPage';
import ReglasPage from './pages/ReglasPage';

function App() {
    return (
            <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/inicio" element={<InicioPage />} />
                    <Route path="/tallas" element={<PermissionRoute codigoModulo={1}> <TallasPage /> </PermissionRoute>} />
                    <Route path="/usuarios" element={<PermissionRoute codigoModulo={2}> <UsuariosPage /> </PermissionRoute>} />
                    <Route path="/molinetes" element={<PermissionRoute codigoModulo={3}> <MolinetesPage /> </PermissionRoute>} />
                    <Route path="/tipos-hilaza" element={<PermissionRoute codigoModulo={4}> <TiposHilazaPage /> </PermissionRoute>} />
                    <Route path="/tipos-hilaza-prom" element={<PermissionRoute codigoModulo={5}> <TiHiPromPage /> </PermissionRoute>} />
                    <Route path="/rendimiento-tallas" element={<PermissionRoute codigoModulo={6}> <RendTallasPage /> </PermissionRoute>} />
                    <Route path="/nuevo-tigimoli" element={<PermissionRoute codigoModulo={7}> <NuevoTigimoliPage /> </PermissionRoute>} />
                    <Route path="/ordeprod" element={<PermissionRoute codigoModulo={8}> <OrdeProdPage /> </PermissionRoute>} />
                    <Route path="/modulos" element={<PermissionRoute codigoModulo={9}> <ModulosPage/> </PermissionRoute>} />
                    <Route path="/reglas" element={<PermissionRoute codigoModulo={10}> <ReglasPage/> </PermissionRoute>} />
                </Route>
            </Route>

            <Route
                path="*"
                element={<h2>404 - Página no encontrada</h2>}
            />

        </Routes>
    );
}

export default App;
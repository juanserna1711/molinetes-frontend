/*=============================================================================
  Nombre responsabilidad: Montar la aplicación React

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Crea la raíz sobre el elemento root de index.html y renderiza App dentro de StrictMode y BrowserRouter.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

import './styles/global.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/pages.css'
import './styles/tables.css'
import './styles/forms.css'
import './styles/snackbar.css'
import './styles/confirmmodal.css'
import './styles/login.css'
import './styles/tigimoli.css'
import './styles/nuevoTigimoli.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </StrictMode>,
)
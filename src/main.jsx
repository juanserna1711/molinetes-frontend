import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

import './styles/global.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/tallas.css'
import './styles/tallastable.css'
import './styles/tallasform.css'
import './styles/snackbar.css'
import './styles/confirmmodal.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

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
        <App />
    </StrictMode>,
)
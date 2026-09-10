import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import './styles/global.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/tallas.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
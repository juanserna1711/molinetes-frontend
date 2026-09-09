
import React from 'react'
import { TarjetaMolinete } from './components/TarjetaMolinete'
import { molinetesMock } from './data/molinetesMock'
function App() {

  return (
    <>
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Tablero de Monitoreo de la Planta</h1>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {/* 2. Recorremos el arreglo y renderizamos una tarjeta por cada molinete */}
        {molinetesMock.map((item) => (
          <TarjetaMolinete 
            key={item.id} 
            molinete={item} 
          />
        ))}
      </div>
    </div>
    </>
  )
}

export default App

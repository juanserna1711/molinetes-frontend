import React from 'react';

export function TarjetaMolinete({ molinete }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
      <h3>{molinete.nombre}</h3>
      <p><strong>Velocidad:</strong> {molinete.rpm} RPM</p>
      <p><strong>Perímetro:</strong> {molinete.perimetro}</p>
    </div>
  );
}
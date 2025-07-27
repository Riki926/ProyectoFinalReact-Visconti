import React from 'react'
// import './LoadingSpinner.css' // Archivo CSS no existe - componente utiliza estilos globales

const LoadingSpinner = ({ size = 'medium', message = 'Cargando...' }) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default LoadingSpinner 
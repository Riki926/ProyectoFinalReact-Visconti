import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</div>
        <h1>Página no encontrada</h1>
        <p>La página que buscas no existe o fue movida.</p>
        <Link to="/" style={{
          display: 'inline-block',
          marginTop: '2rem',
          padding: '1rem 2rem',
          background: 'var(--primary-color)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: '600'
        }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage 
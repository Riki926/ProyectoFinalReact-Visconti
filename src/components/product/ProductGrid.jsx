import React from 'react'
import ProductCard from './ProductCard'
import LoadingSpinner from '../common/LoadingSpinner'
// import './ProductGrid.css' // Archivo CSS no existe - componente utiliza estilos globales

const ProductGrid = ({ products, loading, error, title, emptyMessage }) => {
  if (loading) {
    return <LoadingSpinner size="large" message="Cargando productos..." />
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar productos</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Intentar nuevamente
        </button>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">📦</div>
        <h3>No hay productos disponibles</h3>
        <p>{emptyMessage || 'No se encontraron productos en esta categoría.'}</p>
      </div>
    )
  }

  return (
    <section className="product-grid-container">
      {title && (
        <div className="grid-header">
          <h2 className="grid-title">{title}</h2>
          <p className="grid-count">
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductGrid 
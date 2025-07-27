import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../firebase/services'
import ProductCard from '../components/ProductCard'
import '../styles/Featured.css'

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const products = await productService.getFeatured()
        setFeaturedProducts(products)
      } catch (err) {
        setError('Error al cargar los productos destacados')
        console.error('Error loading featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  const handleBackHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos destacados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="featured-error">
        <div className="error-container">
          <h2>⚠️ Error al cargar</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="retry-btn">
              Intentar de nuevo
            </button>
            <button onClick={handleBackHome} className="back-btn">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="featured-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Productos Destacados</span>
          </div>
          
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">⭐</span>
              Productos Destacados
            </h1>
            <p className="page-description">
              Nuestra selección especial de los mejores productos en tecnología, 
              elegidos por su calidad, popularidad y excelente relación calidad-precio.
            </p>
          </div>

          <div className="header-actions">
            <button onClick={handleBackHome} className="back-home-btn">
              ← Volver al inicio
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="featured-content">
          {featuredProducts.length > 0 ? (
            <>
              <div className="products-count">
                <span className="count-badge">{featuredProducts.length}</span>
                <span className="count-text">productos destacados encontrados</span>
              </div>
              
              <div className="products-grid">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos destacados</h3>
              <p>En este momento no tenemos productos destacados disponibles.</p>
              <button onClick={handleBackHome} className="browse-btn">
                Explorar todos los productos
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {featuredProducts.length > 0 && (
          <div className="cta-section">
            <div className="cta-content">
              <h3>¿No encontraste lo que buscabas?</h3>
              <p>Explora nuestras categorías para encontrar más productos increíbles</p>
              <div className="cta-actions">
                <button onClick={handleBackHome} className="cta-btn-primary">
                  Ver todas las categorías
                </button>
                <Link to="/checkout" className="cta-btn-secondary">
                  Ir al carrito
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Featured 
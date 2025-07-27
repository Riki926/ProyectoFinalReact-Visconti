import React, { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { productService } from '../firebase/services'
import { getCategoryInfo, formatPrice } from '../utils/helpers'
import '../styles/Category.css'

const Category = () => {
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Cargar productos por categoría
        const productsData = await productService.getByCategory(categoryId)
        setProducts(productsData)
        
      } catch (err) {
        setError('Error al cargar los productos de esta categoría')
        console.error('Error loading category products:', err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      loadProducts()
    } else {
      setLoading(false)
      setError('Categoría no especificada')
    }
  }, [categoryId])

  const categoryInfo = getCategoryInfo(categoryId)

  // Si la categoría no existe o es inválida
  if (!categoryId) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="category-loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <div className="loading-content">
            <h2>Cargando {categoryInfo.name}</h2>
            <p>Buscando los mejores productos para ti...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="category-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error al cargar la categoría</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="retry-btn">
              Intentar de nuevo
            </button>
            <Link to="/" className="home-btn">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{categoryInfo.name}</span>
        </div>
      </nav>

      {/* Category Header */}
      <section className="category-header">
        <div className="container">
          <div className="category-hero">
            <div className="category-icon-large">
              {categoryInfo.icon}
            </div>
            <div className="category-content">
              <h1 className="category-title">{categoryInfo.name}</h1>
              <p className="category-description">{categoryInfo.description}</p>
              <div className="category-stats">
                <span className="products-count">
                  📦 {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
                </span>
                <span className="category-tag">#{categoryId}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="category-products">
        <div className="container">
          {products.length > 0 ? (
            <>
              <div className="products-header">
                <h2>Productos en {categoryInfo.name}</h2>
                <div className="products-info">
                  <span>Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}</span>
                  <span className="products-sort">Ordenados por nombre</span>
                </div>
              </div>
              
              <div className="products-grid">
                {products.map(product => (
                  <ProductCardCategory key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-products">
              <div className="no-products-content">
                <div className="no-products-icon">📦</div>
                <h3>No hay productos disponibles</h3>
                <p>Actualmente no tenemos productos en la categoría <strong>{categoryInfo.name}</strong>.</p>
                <p>Te invitamos a explorar otras categorías o volver más tarde.</p>
                
                <div className="no-products-actions">
                  <Link to="/" className="cta-btn">
                    Ver todas las categorías
                  </Link>
                  <button onClick={() => window.location.reload()} className="retry-btn">
                    Recargar página
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Suggested Categories */}
      {products.length === 0 && (
        <section className="suggested-categories">
          <div className="container">
            <h3>Otras categorías que te pueden interesar</h3>
            <div className="categories-grid">
              {['auriculares', 'notebooks', 'celulares', 'tablets'].filter(cat => cat !== categoryId).map(category => {
                const catInfo = getCategoryInfo(category)
                return (
                  <Link 
                    key={category} 
                    to={`/category/${category}`}
                    className="category-suggestion"
                  >
                    <span className="suggestion-icon">{catInfo.icon}</span>
                    <span className="suggestion-name">{catInfo.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Componente ProductCard optimizado para vista de categoría
const ProductCardCategory = ({ product }) => {
  return (
    <div className="product-card-category">
      {/* Imagen del producto */}
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name || product.title}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'
          }}
        />
        {product.featured && (
          <div className="product-badge">
            ⭐ Destacado
          </div>
        )}
        {product.stock === 0 && (
          <div className="product-badge out-of-stock">
            Sin stock
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-name">{product.name || product.title}</h3>
        
        <div className="product-price">
          {formatPrice(product.price)}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <div className="stock-warning">
            ⚠️ Últimas {product.stock} unidades
          </div>
        )}
      </div>

      {/* Botón Ver más */}
      <div className="product-actions">
        <Link 
          to={`/product/${product.id}`} 
          className="view-more-btn"
        >
          Ver más
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  )
}

export default Category 
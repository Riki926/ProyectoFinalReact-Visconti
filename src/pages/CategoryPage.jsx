import React from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useProductsByCategory } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
// import './CategoryPage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const CategoryPage = () => {
  const { categoryId } = useParams()
  const { products, loading, error } = useProductsByCategory(categoryId)

  const categoryInfo = {
    auriculares: {
      name: 'Auriculares',
      icon: '🎧',
      description: 'Descubre nuestra colección de auriculares de alta calidad con tecnología de cancelación de ruido, sonido premium y comodidad excepcional.'
    },
    notebooks: {
      name: 'Notebooks',
      icon: '💻',
      description: 'Explora nuestra gama de notebooks de alto rendimiento, diseñadas para productividad, gaming y uso profesional.'
    },
    celulares: {
      name: 'Celulares',
      icon: '📱',
      description: 'Los últimos smartphones con tecnología de vanguardia, cámaras avanzadas y rendimiento excepcional.'
    },
    tablets: {
      name: 'Tablets',
      icon: '📱',
      description: 'Tablets versátiles para trabajo, entretenimiento y creatividad con pantallas de alta resolución.'
    },
    smarttv: {
      name: 'Smart TV',
      icon: '📺',
      description: 'Televisores inteligentes con tecnología 4K, HDR y conectividad avanzada para el mejor entretenimiento.'
    },
    monitores: {
      name: 'Monitores',
      icon: '🖥️',
      description: 'Monitores profesionales y gaming con alta resolución, colores precisos y tasas de refresco elevadas.'
    }
  }

  const currentCategory = categoryInfo[categoryId]

  // Si la categoría no existe, redirigir a home
  if (!currentCategory) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <LoadingSpinner message={`Cargando productos de ${currentCategory.name}...`} />
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error-container">
            <h1>Error al cargar productos</h1>
            <p>{error}</p>
            <Link to="/" className="back-button">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const formatCategoryName = (category) => category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="category-page">
      {/* Category Header */}
      <section className="category-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            <span className="breadcrumb-separator">{'>'}</span>
            <span className="breadcrumb-current">{currentCategory.name}</span>
          </div>
          
          <div className="category-info">
            <div className="category-icon-large">
              {currentCategory.icon}
            </div>
            <div className="category-content">
              <h1 className="category-title">{currentCategory.name}</h1>
              <p className="category-description">{currentCategory.description}</p>
              
              <div className="category-stats">
                <div className="stat">
                  <span className="stat-number">{products.length}</span>
                  <span className="stat-label">Productos disponibles</span>
                </div>
                <div className="stat">
                  <span className="stat-number">⭐</span>
                  <span className="stat-label">Calidad garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          {products.length > 0 ? (
            <>
              <div className="products-header">
                <h2 className="products-title">
                  Productos en {currentCategory.name}
                </h2>
                <div className="products-count">
                  {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3 className="no-products-title">
                No hay productos en esta categoría
              </h3>
              <p className="no-products-description">
                Estamos trabajando para agregar más productos en {currentCategory.name}. 
                Mientras tanto, puedes explorar otras categorías.
              </p>
              <Link to="/" className="explore-button">
                Explorar todas las categorías
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {products.length > 0 && (
        <section className="related-categories">
          <div className="container">
            <h2 className="section-title">Explorar otras categorías</h2>
            <div className="categories-grid">
              {Object.entries(categoryInfo)
                .filter(([key]) => key !== categoryId)
                .slice(0, 3)
                .map(([key, info]) => (
                  <Link key={key} to={`/categoria/${key}`} className="category-card">
                    <div className="category-icon">{info.icon}</div>
                    <h3 className="category-name">{info.name}</h3>
                    <span className="category-link-text">Ver productos →</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default CategoryPage 
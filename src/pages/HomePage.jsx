import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFeaturedProducts, useCategories } from '../hooks/useProducts'
import { productService } from '../firebase/services'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
// import './HomePage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const HomePage = () => {
  const { products: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts()
  const { categories, loading: categoriesLoading } = useCategories()

  // Inicializar productos en Firebase (solo la primera vez)
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Verificar si ya hay productos
        const existingProducts = await productService.getAll()
        if (existingProducts.length === 0) {
          await productService.initializeProducts()
          window.location.reload() // Recargar para mostrar los productos
        }
      } catch (error) {
        console.error('Error inicializando datos:', error)
      }
    }

    initializeData()
  }, [])

  const categoryInfo = {
    auriculares: {
      name: 'Auriculares',
      icon: '🎧',
      description: 'Audio de alta calidad'
    },
    notebooks: {
      name: 'Notebooks',
      icon: '💻',
      description: 'Potencia y portabilidad'
    },
    celulares: {
      name: 'Celulares',
      icon: '📱',
      description: 'Última tecnología móvil'
    },
    tablets: {
      name: 'Tablets',
      icon: '📱',
      description: 'Versatilidad digital'
    }
  }

  if (featuredLoading && categoriesLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bienvenido a <span className="brand-name">BitStore</span>
            </h1>
            <p className="hero-subtitle">
              Tu tienda de tecnología de confianza. Encuentra los mejores productos con la calidad que buscas.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Soporte</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-tech-icons">
              <span className="tech-icon">💻</span>
              <span className="tech-icon">📱</span>
              <span className="tech-icon">🎧</span>
              <span className="tech-icon">⌚</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Explora por Categorías</h2>
          <div className="categories-grid">
            {categories.map(category => {
              const info = categoryInfo[category] || {
                name: category.charAt(0).toUpperCase() + category.slice(1),
                icon: '📦',
                description: 'Productos de calidad'
              }
              
              return (
                <Link 
                  key={category} 
                  to={`/categoria/${category}`}
                  className="category-card"
                >
                  <div className="category-icon">
                    {info.icon}
                  </div>
                  <h3 className="category-name">{info.name}</h3>
                  <p className="category-description">{info.description}</p>
                  <span className="category-link-text">Ver productos →</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="section-container">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">
              Los productos más populares y mejor valorados por nuestros clientes
            </p>
            
            {featuredError ? (
              <div className="error-message">
                Error al cargar productos destacados: {featuredError}
              </div>
            ) : (
              <div className="products-grid">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">¿Por qué elegir BitStore?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Envío Rápido</h3>
              <p className="feature-description">
                Recibe tus productos en 24-48 horas en todo el país
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Compra Segura</h3>
              <p className="feature-description">
                Transacciones protegidas con los mejores estándares de seguridad
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Tecnología de Punta</h3>
              <p className="feature-description">
                Solo ofrecemos productos de las mejores marcas y últimas tecnologías
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3 className="feature-title">Soporte Técnico</h3>
              <p className="feature-description">
                Equipo especializado para ayudarte antes y después de tu compra
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 
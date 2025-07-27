import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../firebase/services'
import { getCategoryInfo } from '../utils/helpers'
import ProductCard from '../components/ProductCard'
import '../styles/Home.css'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [featured, categoriesData] = await Promise.all([
          productService.getFeatured(),
          productService.getCategories()
        ])
        
        setFeaturedProducts(featured)
        setCategories(categoriesData)
      } catch (err) {
        setError('Error al cargar los datos')
        console.error('Error loading home data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Función para smooth scroll a una sección específica
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  // Handler para el botón "Ver productos destacados"
  const handleViewFeatured = () => {
    scrollToSection('featured')
  }

  // Handler para el botón "Explorar categorías"
  const handleExploreCategories = () => {
    scrollToSection('categories')
  }

  // Handler alternativo: navegar a una página de productos destacados dedicada
  const handleViewFeaturedPage = () => {
    navigate('/featured')
  }

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-error">
        <div className="error-container">
          <h2>⚠️ Error al cargar</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bienvenido a <span className="brand-highlight">BitStore</span>
            </h1>
            <p className="hero-description">
              Tu tienda de tecnología de confianza. Descubre los mejores productos 
              en auriculares, notebooks, celulares y más, con la mejor calidad y precios.
            </p>
            <div className="hero-actions">
              <button 
                onClick={handleViewFeatured} 
                className="btn-primary"
                aria-label="Ver productos destacados"
              >
                Ver productos destacados
              </button>
              <button 
                onClick={handleExploreCategories} 
                className="btn-secondary"
                aria-label="Explorar categorías"
              >
                Explorar categorías
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="tech-icons">
              <span className="tech-icon">💻</span>
              <span className="tech-icon">📱</span>
              <span className="tech-icon">🎧</span>
              <span className="tech-icon">📺</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section" id="featured">
        <div className="container">
          <div className="section-header">
            <h2>⭐ Productos Destacados</h2>
            <p>Los mejores productos seleccionados especialmente para ti</p>
            {/* Botón para ir a página dedicada de productos destacados */}
            <div className="section-actions">
              <button 
                onClick={handleViewFeaturedPage}
                className="view-all-btn"
                title="Ver todos los productos destacados"
              >
                Ver todos los destacados →
              </button>
            </div>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No hay productos destacados disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" id="categories">
        <div className="container">
          <div className="section-header">
            <h2>🛍️ Explorar por Categorías</h2>
            <p>Encuentra exactamente lo que buscas en nuestras categorías especializadas</p>
          </div>
          
          <div className="categories-grid">
            {categories.map(category => {
              const categoryInfo = getCategoryInfo(category)
              return (
                <button
                  key={category}
                  onClick={() => navigate(`/category/${category}`)}
                  className="category-card"
                  aria-label={`Ver productos de ${categoryInfo.name}`}
                >
                  <div className="category-icon">
                    {categoryInfo.icon}
                  </div>
                  <h3 className="category-name">{categoryInfo.name}</h3>
                  <p className="category-description">{categoryInfo.description}</p>
                  <span className="category-link">Ver productos →</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Envío gratis</h3>
              <p>En compras superiores a $50.000</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Compra segura</h3>
              <p>Tus datos protegidos siempre</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>Soporte 24/7</h3>
              <p>Atención al cliente especializada</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Garantía extendida</h3>
              <p>30 días para cambios y devoluciones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 
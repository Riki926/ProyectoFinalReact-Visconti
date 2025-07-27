import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../firebase/services'
import { getCategoryInfo } from '../utils/helpers'
import '../styles/Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const { cart } = useCart()
  const location = useLocation()

  // Cargar categorías desde Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await productService.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    
    loadCategories()
  }, [])

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActiveCategory = (category) => {
    return location.pathname === `/category/${category}`
  }

  const isActiveHome = location.pathname === '/'

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <div className="brand-icon">
              <span className="icon-symbol">🔌</span>
              <div className="icon-pulse"></div>
            </div>
            <div className="brand-text">
              <span className="brand-name">BitStore</span>
              <span className="brand-tagline">Tech Store</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="navbar-navigation">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActiveHome ? 'nav-link-active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Inicio</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            {categories.map(category => {
              const categoryInfo = getCategoryInfo(category)
              const isActive = isActiveCategory(category)
              return (
                <li key={category} className="nav-item">
                  <Link 
                    to={`/category/${category}`}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <span className="nav-icon">{categoryInfo.icon}</span>
                    <span className="nav-text">{categoryInfo.name}</span>
                    <div className="nav-indicator"></div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Actions Section */}
        <div className="navbar-actions">
          {/* Shopping Cart */}
          <div className="cart-widget">
            <Link to="/checkout" className="cart-button">
              <div className="cart-icon-container">
                <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cart.totalItems > 0 && (
                  <div className="cart-badge">
                    <span className="badge-count">{cart.totalItems}</span>
                    <div className="badge-pulse"></div>
                  </div>
                )}
              </div>
              <span className="cart-label">Carrito</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'menu-toggle-active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <div className="hamburger">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-active' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h3>Navegación</h3>
            <button className="mobile-menu-close" onClick={closeMenu}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <ul className="mobile-nav-menu">
            <li className="mobile-nav-item">
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActiveHome ? 'mobile-nav-link-active' : ''}`}
                onClick={closeMenu}
              >
                <div className="mobile-nav-icon">🏠</div>
                <div className="mobile-nav-content">
                  <span className="mobile-nav-title">Inicio</span>
                  <span className="mobile-nav-desc">Página principal</span>
                </div>
                <div className="mobile-nav-arrow">→</div>
              </Link>
            </li>
            {categories.map(category => {
              const categoryInfo = getCategoryInfo(category)
              const isActive = isActiveCategory(category)
              return (
                <li key={category} className="mobile-nav-item">
                  <Link 
                    to={`/category/${category}`}
                    className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                    onClick={closeMenu}
                  >
                    <div className="mobile-nav-icon">{categoryInfo.icon}</div>
                    <div className="mobile-nav-content">
                      <span className="mobile-nav-title">{categoryInfo.name}</span>
                      <span className="mobile-nav-desc">Ver productos</span>
                    </div>
                    <div className="mobile-nav-arrow">→</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="navbar-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  )
}

export default Navbar




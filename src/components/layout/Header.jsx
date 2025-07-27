import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCategories } from '../../hooks/useProducts'
// import './Header.css' // Archivo CSS no existe - usando Navbar.css de src/styles/

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const { categories } = useCategories()
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const formatCategoryName = (category) => {
    const categoryNames = {
      'auriculares': 'Auriculares',
      'notebooks': 'Notebooks',
      'celulares': 'Celulares',
      'tablets': 'Tablets',
      'smarttv': 'Smart TV',
      'monitores': 'Monitores'
    }
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  const isActiveCategory = (category) => {
    return location.pathname === `/categoria/${category}`
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <span className="logo-icon">🔌</span>
            <span className="logo-text">BitStore</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            {categories.map(category => (
              <li key={category} className="nav-item">
                <Link 
                  to={`/categoria/${category}`}
                  className={`nav-link ${isActiveCategory(category) ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  {formatCategoryName(category)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Cart Widget */}
        <div className="header-cart">
          <Link to="/carrito" className="cart-link" onClick={closeMenu}>
            <div className="cart-icon">
              🛒
              {cart.totalItems > 0 && (
                <span className="cart-badge">{cart.totalItems}</span>
              )}
            </div>
            <span className="cart-text">Carrito</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  )
}

export default Header 
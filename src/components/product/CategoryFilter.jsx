import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRODUCT_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants'
// import './CategoryFilter.css' // Archivo CSS no existe - componente utiliza estilos globales

const CategoryFilter = () => {
  const location = useLocation()
  const currentCategory = location.pathname.split('/')[2] // Obtener categoría de la URL

  const categories = Object.values(PRODUCT_CATEGORIES)

  return (
    <div className="category-filter">
      <h3 className="filter-title">Categorías</h3>
      
      <div className="category-buttons">
        {/* Botón para todas las categorías */}
        <Link
          to="/"
          className={`category-button ${!currentCategory ? 'active' : ''}`}
        >
          <span className="category-icon">🛒</span>
          <span className="category-label">Todas</span>
        </Link>

        {/* Botones para cada categoría específica */}
        {categories.map((category) => (
          <Link
            key={category}
            to={`/categoria/${category}`}
            className={`category-button ${currentCategory === category ? 'active' : ''}`}
          >
            <span className="category-icon">
              {CATEGORY_ICONS[category]}
            </span>
            <span className="category-label">
              {CATEGORY_LABELS[category]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter 
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import '../styles/ProductCard.css'

const ProductCard = ({ product }) => {
  const { addItem, isInCart, getItemQuantity } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const isProductInCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        {/* Product Image */}
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {product.featured && (
            <span className="product-badge">⭐ Destacado</span>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description?.length > 80 
              ? `${product.description.substring(0, 80)}...` 
              : product.description
            }
          </p>
          
          <div className="product-details">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="stock-available">
                  📦 Stock: {product.stock}
                </span>
              ) : (
                <span className="stock-unavailable">
                  ❌ Sin stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="product-actions">
          {product.stock > 0 ? (
            <button 
              className={`add-to-cart-btn ${isProductInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {isProductInCart ? (
                <>
                  <span className="cart-icon">✓</span>
                  En carrito ({cartQuantity})
                </>
              ) : (
                <>
                  <span className="cart-icon">🛒</span>
                  Agregar al carrito
                </>
              )}
            </button>
          ) : (
            <button className="add-to-cart-btn disabled" disabled>
              <span className="cart-icon">❌</span>
              Sin stock
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}

export default ProductCard 
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import '../../styles/ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const isProductInCart = isInCart(product.id)
  const quantity = getItemQuantity(product.id)

  return (
    <article className="product-card">
      <Link to={`/producto/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen'
            }}
          />
          {product.featured && (
            <div className="product-badge">
              ⭐ Destacado
            </div>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <div className="product-badge stock-low">
              ⚠️ Últimas unidades
            </div>
          )}
          {product.stock === 0 && (
            <div className="product-badge out-of-stock">
              Sin stock
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-details">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>
            
            <div className="product-stock">
              Stock: {product.stock} unidades
            </div>
          </div>
        </div>
      </Link>

      <div className="product-actions">
        {product.stock > 0 ? (
          <button 
            className={`add-to-cart-btn ${isProductInCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
          >
            {isProductInCart ? (
              <>
                ✓ En carrito ({quantity})
              </>
            ) : (
              <>
                🛒 Agregar al carrito
              </>
            )}
          </button>
        ) : (
          <button className="add-to-cart-btn disabled" disabled>
            Sin stock
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard 
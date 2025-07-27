import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { APP_CONFIG } from '../utils/constants'
// import './ProductDetailPage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const ProductDetailPage = () => {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) return <LoadingSpinner size="large" message="Cargando producto..." />

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error al cargar el producto</h2>
          <p>{error}</p>
          <Link to="/" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container">
        <div className="not-found-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o fue eliminado.</p>
          <Link to="/" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const isProductInCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x400?text=Imagen+no+disponible'
            }}
          />
        </div>

        <div className="product-info-section">
          <div className="breadcrumb">
            <Link to="/">Inicio</Link>
            <span> / </span>
            <Link to={`/categoria/${product.category}`}>{product.category}</Link>
            <span> / </span>
            <span>{product.name}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>
          <p className="product-category-detail">{product.category}</p>

          <div className="product-price-detail">
            <span className="currency">{APP_CONFIG.CURRENCY_SYMBOL}</span>
            <span className="amount">{product.price?.toLocaleString()}</span>
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-stock-info">
            {product.stock > 0 ? (
              <p className="in-stock">✅ En stock ({product.stock} disponibles)</p>
            ) : (
              <p className="out-of-stock">❌ Sin stock</p>
            )}
          </div>

          {product.stock > 0 && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="add-to-cart-detail"
                disabled={product.stock === 0}
              >
                {isProductInCart ? (
                  `Agregar más (${cartQuantity} en carrito)`
                ) : (
                  'Agregar al carrito'
                )}
              </button>

              {isProductInCart && (
                <Link to="/carrito" className="go-to-cart">
                  Ver carrito
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage 
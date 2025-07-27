import React, { useState, useEffect } from 'react'
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { productService } from '../firebase/services'
import { useCart } from '../context/CartContext'
import { formatPrice, getCategoryInfo } from '../utils/helpers'
import '../styles/ProductDetail.css'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  
  const { addItem, isInCart, getItemQuantity } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const productData = await productService.getById(productId)
        setProduct(productData)
      } catch (err) {
        setError('Producto no encontrado')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity)
      setShowAddedMessage(true)
      // Ocultar mensaje después de 2 segundos
      setTimeout(() => setShowAddedMessage(false), 2000)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleGoToCheckout = () => {
    navigate('/checkout')
  }

  if (!productId) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="error-container">
          <h2>⚠️ Producto no encontrado</h2>
          <p>{error || 'El producto que buscas no existe.'}</p>
          <Link to="/" className="back-button">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(product.category)
  const isProductInCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/category/${product.category}`} className="breadcrumb-link">
            {categoryInfo.name}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="product-detail-content">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-image"
              />
              {product.featured && (
                <span className="product-badge">⭐ Destacado</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-category">
              <span className="category-icon">{categoryInfo.icon}</span>
              <span className="category-name">{categoryInfo.name}</span>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price-container">
              <div className="product-price">{formatPrice(product.price)}</div>
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <div className="stock-available">
                  <span className="stock-icon">📦</span>
                  <span className="stock-text">
                    {product.stock} unidades disponibles
                  </span>
                </div>
              ) : (
                <div className="stock-unavailable">
                  <span className="stock-icon">❌</span>
                  <span className="stock-text">Sin stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="product-actions">
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
                      min="1" 
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
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

                <div className="cart-actions">
                  {!isProductInCart ? (
                    <button 
                      onClick={handleAddToCart}
                      className="add-to-cart-btn"
                    >
                      <span className="cart-icon">🛒</span>
                      Agregar al carrito
                    </button>
                  ) : (
                    <>
                      {!showAddedMessage && (
                        <button 
                          onClick={handleAddToCart}
                          className="add-to-cart-btn add-more"
                        >
                          <span className="cart-icon">➕</span>
                          Agregar más ({cartQuantity} en carrito)
                        </button>
                      )}
                      
                      <button 
                        onClick={handleGoToCheckout}
                        className="checkout-btn"
                      >
                        <span className="checkout-icon">💳</span>
                        Finalizar compra
                      </button>
                    </>
                  )}

                  {showAddedMessage && (
                    <div className="added-message">
                      <span className="check-icon">✅</span>
                      Producto agregado al carrito
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Features */}
            <div className="product-features">
              <h3>Características</h3>
              <ul className="features-list">
                <li>🚚 Envío gratis en compras superiores a $50.000</li>
                <li>🔒 Compra 100% segura</li>
                <li>↩️ 30 días para cambios y devoluciones</li>
                <li>📞 Soporte técnico especializado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 
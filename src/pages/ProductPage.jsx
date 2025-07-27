import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
// import './ProductPage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const ProductPage = () => {
  const { productId } = useParams()
  const { product, loading, error } = useProduct(productId)
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity)
      setQuantity(1) // Reset quantity after adding
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const isProductInCart = product ? isInCart(product.id) : false
  const cartQuantity = product ? getItemQuantity(product.id) : 0

  if (loading) {
    return <LoadingSpinner message="Cargando producto..." />
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="error-container">
            <h1>Producto no encontrado</h1>
            <p>{error || 'El producto que buscas no existe o ya no está disponible.'}</p>
            <Link to="/" className="back-button">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Para múltiples imágenes (por ahora solo tenemos una)
  const productImages = [product.image]

  return (
    <div className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Inicio</Link>
          <span className="breadcrumb-separator">{'>'}</span>
          <Link to={`/categoria/${product.category}`} className="breadcrumb-link">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="breadcrumb-separator">{'>'}</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Sin+Imagen'
                }}
              />
              {product.featured && (
                <div className="product-badge featured">
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
            
            {productImages.length > 1 && (
              <div className="image-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-category">
                <Link to={`/categoria/${product.category}`} className="category-link">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </div>
            </div>

            <div className="product-price-section">
              <div className="product-price">{formatPrice(product.price)}</div>
              <div className="stock-info">
                {product.stock > 0 ? (
                  <span className="stock-available">
                    ✅ En stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="stock-unavailable">
                    ❌ Sin stock
                  </span>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Add to Cart Section */}
            <div className="add-to-cart-section">
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector">
                    <label htmlFor="quantity">Cantidad:</label>
                    <div className="quantity-controls">
                      <button 
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
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
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button 
                    className={`add-to-cart-btn ${isProductInCart ? 'in-cart' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {isProductInCart ? (
                      <>
                        ✓ Agregar más ({cartQuantity} en carrito)
                      </>
                    ) : (
                      <>
                        🛒 Agregar al carrito
                      </>
                    )}
                  </button>

                  <div className="total-price">
                    <strong>Total: {formatPrice(product.price * quantity)}</strong>
                  </div>
                </>
              ) : (
                <div className="out-of-stock-section">
                  <button className="add-to-cart-btn disabled" disabled>
                    Sin stock disponible
                  </button>
                  <p className="notify-text">
                    Este producto no está disponible en este momento.
                  </p>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="product-features">
              <h3>Características del producto</h3>
              <ul className="features-list">
                <li>✅ Garantía oficial del fabricante</li>
                <li>✅ Envío gratuito a todo el país</li>
                <li>✅ Devolución sin costo hasta 30 días</li>
                <li>✅ Soporte técnico especializado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to={`/categoria/${product.category}`} className="action-button secondary">
            ← Ver más {product.category}
          </Link>
          <Link to="/carrito" className="action-button primary">
            Ver carrito →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductPage 
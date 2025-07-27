import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
// import './CartPage.css' // Archivo CSS no existe - componente utiliza estilos globales

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart()
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Carrito de Compras</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Parece que no has agregado ningún producto todavía.</p>
            <Link to="/" className="continue-shopping-btn">
              Comenzar a comprar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Carrito de Compras</h1>
          <div className="cart-actions">
            <button onClick={handleClearCart} className="clear-cart-btn">
              🗑️ Vaciar carrito
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <h2>Productos ({cart.totalItems} artículo{cart.totalItems !== 1 ? 's' : ''})</h2>
            
            <div className="items-list">
              {cart.items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/120x120?text=Sin+Imagen'
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">
                      <Link to={`/producto/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="item-category">
                      Categoría: {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                    </p>
                    <div className="item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  
                  <div className="item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Cantidad:</label>
                    <div className="quantity-controls">
                      <button 
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        max={item.stock || 99}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="quantity-input"
                      />
                      <button 
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <div className="subtotal">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Resumen de la compra</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Productos ({cart.totalItems})</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Envío</span>
                  <span className="free-shipping">Gratis 🚚</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>
              
              <div className="checkout-section">
                <Link to="/checkout" className="checkout-btn">
                  Proceder al pago
                </Link>
                
                <Link to="/" className="continue-shopping">
                  ← Continuar comprando
                </Link>
              </div>
              
              <div className="security-info">
                <div className="security-item">
                  <span className="security-icon">🔒</span>
                  <span>Compra 100% segura</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">↩️</span>
                  <span>Devolución gratuita</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">🛡️</span>
                  <span>Garantía oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage 
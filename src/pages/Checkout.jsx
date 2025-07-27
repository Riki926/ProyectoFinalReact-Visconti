import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderService } from '../firebase/services'
import { validateCheckoutForm } from '../utils/validations'
import { formatPrice, generateOrderNumber } from '../utils/helpers'
import '../styles/Checkout.css'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Si el carrito está vacío, redirigir al inicio
  if (cart.totalItems === 0) {
    return <Navigate to="/" replace />
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulario
    const validation = validateCheckoutForm(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      setSubmitError('Por favor, corrige los errores en el formulario')
      return
    }

    try {
      setLoading(true)
      setSubmitError('')
      
      // Crear la orden en el formato específico solicitado
      const orderData = {
        buyer: {
          nombre: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.phone.trim()
        },
        items: cart.items.map(item => ({
          id: item.id,
          title: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cart.totalPrice,
        date: new Date(),
        // Información adicional para el comprobante
        orderNumber: generateOrderNumber(),
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim()
        },
        summary: {
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        },
        status: 'confirmed'
      }

      // Guardar en Firebase
      const orderId = await orderService.create(orderData)
      
      // Limpiar carrito
      clearCart()
      
      // Redirigir a página de confirmación
      navigate(`/order/${orderId}`, { replace: true })
      
    } catch (error) {
      console.error('Error processing order:', error)
      setSubmitError('Error al procesar la orden. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Finalizar Compra</h1>
          <p>Completa tus datos para procesar tu pedido</p>
        </div>

        <div className="checkout-content">
          {/* Formulario de checkout */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>📋 Información Personal</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Nombre completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Ej: Juan Pérez"
                    maxLength={50}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Teléfono *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="Ej: +54 11 1234-5678"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>📍 Dirección de Entrega</h2>
                
                <div className="form-group">
                  <label htmlFor="address">Dirección *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Ej: Av. Corrientes 1234"
                    maxLength={100}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Ciudad *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Ej: Buenos Aires"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Código Postal *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={errors.postalCode ? 'error' : ''}
                      placeholder="Ej: 1001"
                      maxLength={8}
                    />
                    {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="submit-error">
                  ⚠️ {submitError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="cart-icon">💳</span>
                    Confirmar Compra
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>📦 Resumen del Pedido</h2>
              
              <div className="summary-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <span className="item-quantity">Cantidad: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Total de productos:</span>
                  <span>{cart.totalItems} items</span>
                </div>
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span className="free-shipping">Gratis</span>
                </div>
                <div className="total-row final-total">
                  <span>Total Final:</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>

              <div className="payment-info">
                <h3>💳 Información de Pago</h3>
                <p>El pago se realizará contra entrega. Aceptamos efectivo y tarjetas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout 
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { orderService } from '../services/firebase'
import LoadingSpinner from '../components/common/LoadingSpinner'
// import './CheckoutPage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const CheckoutPage = () => {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit-card'
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Redirigir si el carrito está vacío
  if (cart.items.length === 0) {
    return <Navigate to="/carrito" replace />
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return 'Este campo es requerido'
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          return 'Solo se permiten letras y espacios'
        }
        if (value.trim().length < 2) {
          return 'Debe tener al menos 2 caracteres'
        }
        return ''

      case 'email':
        if (!value.trim()) {
          return 'El email es requerido'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Formato de email inválido'
        }
        return ''

      case 'phone':
        if (!value.trim()) {
          return 'El teléfono es requerido'
        }
        // Solo números, espacios, guiones y paréntesis
        if (!/^[\d\s\-\(\)]+$/.test(value)) {
          return 'Solo se permiten números, espacios, guiones y paréntesis'
        }
        // Extraer solo números para validar longitud
        const numbersOnly = value.replace(/[^\d]/g, '')
        if (numbersOnly.length < 8) {
          return 'Debe tener al menos 8 dígitos'
        }
        if (numbersOnly.length > 15) {
          return 'No puede tener más de 15 dígitos'
        }
        return ''

      case 'address':
        if (!value.trim()) {
          return 'La dirección es requerida'
        }
        if (value.trim().length < 5) {
          return 'La dirección debe tener al menos 5 caracteres'
        }
        return ''

      case 'city':
        if (!value.trim()) {
          return 'La ciudad es requerida'
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          return 'Solo se permiten letras y espacios'
        }
        return ''

      case 'postalCode':
        if (!value.trim()) {
          return 'El código postal es requerido'
        }
        if (!/^\d{4,8}$/.test(value)) {
          return 'Debe contener entre 4 y 8 números'
        }
        return ''

      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Aplicar filtros específicos en tiempo real
    let filteredValue = value
    
    if (name === 'firstName' || name === 'lastName' || name === 'city') {
      // Solo letras, espacios y acentos
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    } else if (name === 'phone') {
      // Solo números, espacios, guiones y paréntesis
      filteredValue = value.replace(/[^\d\s\-\(\)]/g, '')
    } else if (name === 'postalCode') {
      // Solo números
      filteredValue = value.replace(/[^\d]/g, '')
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))

    // Validar el campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, filteredValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      if (key !== 'paymentMethod') {
        const error = validateField(key, formData[key])
        if (error) {
          newErrors[key] = error
        }
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {}))

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim()
        },
        items: cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        payment: {
          method: formData.paymentMethod,
          amount: cart.totalPrice
        },
        summary: {
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          shipping: 0, // Envío gratis
          finalPrice: cart.totalPrice
        }
      }

      const orderId = await orderService.create(orderData)
      
      // Limpiar carrito después de crear la orden
      clearCart()
      
      // Redirigir a la página de confirmación
      navigate(`/orden/${orderId}`)
      
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Hubo un error al procesar tu orden. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Procesando tu orden..." />
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Finalizar Compra</h1>
          <p>Completa tus datos para finalizar la compra</p>
        </div>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Información Personal</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.firstName ? 'error' : ''}
                    placeholder="Ingresa tu nombre"
                    maxLength="50"
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.lastName ? 'error' : ''}
                    placeholder="Ingresa tu apellido"
                    maxLength="50"
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email ? 'error' : ''}
                    placeholder="tu@email.com"
                    maxLength="100"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone ? 'error' : ''}
                    placeholder="11 1234-5678"
                    maxLength="20"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Dirección de Entrega</h2>
              
              <div className="form-group">
                <label htmlFor="address">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.address ? 'error' : ''}
                  placeholder="Calle, número, piso, departamento"
                  maxLength="200"
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.city ? 'error' : ''}
                    placeholder="Buenos Aires"
                    maxLength="50"
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.postalCode ? 'error' : ''}
                    placeholder="1234"
                    maxLength="8"
                  />
                  {errors.postalCode && (
                    <span className="error-message">{errors.postalCode}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Método de Pago</h2>
              
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleChange}
                  />
                  <span className="payment-info">
                    <strong>💳 Tarjeta de Crédito</strong>
                    <small>Visa, Mastercard, American Express</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debit-card"
                    checked={formData.paymentMethod === 'debit-card'}
                    onChange={handleChange}
                  />
                  <span className="payment-info">
                    <strong>💳 Tarjeta de Débito</strong>
                    <small>Visa Débito, Maestro</small>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                  />
                  <span className="payment-info">
                    <strong>🏦 Transferencia Bancaria</strong>
                    <small>CBU/CVU - Descuento 5%</small>
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Procesando...' : `Confirmar pedido - ${formatPrice(cart.totalPrice)}`}
            </button>
          </form>

          <div className="order-summary">
            <div className="summary-card">
              <h2>Resumen del Pedido</h2>
              
              <div className="summary-items">
                {cart.items.map(item => (
                  <div key={item.id} className="summary-item">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="summary-item-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen'
                      }}
                    />
                    <div className="summary-item-details">
                      <h4>{item.name}</h4>
                      <p>Cantidad: {item.quantity}</p>
                    </div>
                    <div className="summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
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

              <div className="security-badges">
                <div className="security-badge">
                  <span>🔒</span>
                  <span>Compra segura SSL</span>
                </div>
                <div className="security-badge">
                  <span>↩️</span>
                  <span>Devolución gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage 
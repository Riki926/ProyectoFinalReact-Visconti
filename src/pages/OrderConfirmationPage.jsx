import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { orderService } from '../firebase/services'
import LoadingSpinner from '../components/common/LoadingSpinner'
// import './OrderConfirmationPage.css' // Archivo CSS no existe - usando estructura modular en src/styles/

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const orderData = await orderService.getById(orderId)
        setOrder(orderData)
      } catch (err) {
        setError(err.message)
        console.error('Error loading order:', err)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date.seconds * 1000))
  }

  const getPaymentMethodName = (method) => {
    const methods = {
      'credit-card': 'Tarjeta de Crédito',
      'debit-card': 'Tarjeta de Débito',
      'transfer': 'Transferencia Bancaria'
    }
    return methods[method] || method
  }

  const printOrder = () => {
    window.print()
  }

  if (loading) {
    return <LoadingSpinner message="Cargando orden..." />
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="error-container">
            <h1>❌ Orden no encontrada</h1>
            <p>{error || 'La orden que buscas no existe o no se pudo cargar.'}</p>
            <Link to="/" className="back-button">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h1>¡Pedido confirmado!</h1>
          <p>Tu pedido ha sido procesado exitosamente</p>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <div className="order-info-card">
            <div className="order-header">
              <div className="order-number">
                <h2>Número de orden</h2>
                <div className="order-id">{order.orderNumber || order.id}</div>
              </div>
              <div className="order-date">
                <h3>Fecha de pedido</h3>
                <div className="date">{formatDate(order.createdAt)}</div>
              </div>
            </div>

            <div className="order-status">
              <span className="status-badge confirmed">
                ✅ Confirmado
              </span>
              <p>Tu pedido está siendo preparado para envío</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="customer-info-card">
            <h2>👤 Información del Cliente</h2>
            <div className="customer-details">
              <div className="detail-group">
                <div className="detail-item">
                  <strong>Nombre completo:</strong>
                  <span>{order.customer.firstName} {order.customer.lastName}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{order.customer.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Teléfono:</strong>
                  <span>{order.customer.phone}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h3>📍 Dirección de entrega</h3>
                <div className="address-details">
                  <div>{order.customer.address}</div>
                  <div>{order.customer.city}, CP: {order.customer.postalCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="items-card">
            <h2>🛒 Productos adquiridos ({order.summary.totalItems} artículos)</h2>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-category">Categoría: {item.category}</p>
                    <div className="item-details">
                      <span className="item-price">Precio unitario: {formatPrice(item.price)}</span>
                      <span className="item-quantity">Cantidad: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="payment-info-card">
            <h2>💳 Información de pago</h2>
            <div className="payment-details">
              <div className="payment-method">
                <strong>Método de pago:</strong>
                <span>{getPaymentMethodName(order.payment.method)}</span>
              </div>
              
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal productos:</span>
                  <span>{formatPrice(order.summary.totalPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span className="free-shipping">Gratis 🚚</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total pagado:</span>
                  <span>{formatPrice(order.summary.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-card">
            <h2>📋 Próximos pasos</h2>
            <div className="steps-list">
              <div className="step completed">
                <div className="step-icon">✅</div>
                <div className="step-content">
                  <h4>Pedido confirmado</h4>
                  <p>Tu pedido ha sido recibido y confirmado</p>
                </div>
              </div>
              <div className="step pending">
                <div className="step-icon">📦</div>
                <div className="step-content">
                  <h4>Preparación del pedido</h4>
                  <p>Estamos preparando tus productos para el envío (1-2 días hábiles)</p>
                </div>
              </div>
              <div className="step pending">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>Envío</h4>
                  <p>Te notificaremos cuando tu pedido esté en camino</p>
                </div>
              </div>
              <div className="step pending">
                <div className="step-icon">🏠</div>
                <div className="step-content">
                  <h4>Entrega</h4>
                  <p>Recibirás tu pedido en la dirección indicada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions-card">
            <div className="action-buttons">
              <button onClick={printOrder} className="print-btn">
                🖨️ Imprimir comprobante
              </button>
              <Link to="/" className="continue-shopping-btn">
                🛒 Seguir comprando
              </Link>
            </div>
            
            <div className="contact-info">
              <h3>¿Necesitas ayuda?</h3>
              <p>Si tienes alguna pregunta sobre tu pedido, contáctanos:</p>
              <div className="contact-methods">
                <div className="contact-item">
                  📧 <strong>Email:</strong> soporte@bitstore.com
                </div>
                <div className="contact-item">
                  📞 <strong>WhatsApp:</strong> +54 11 1234-5678
                </div>
                <div className="contact-item">
                  🕒 <strong>Horarios:</strong> Lunes a Viernes 9:00 - 18:00hs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage 
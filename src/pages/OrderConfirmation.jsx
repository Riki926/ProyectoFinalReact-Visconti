import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { orderService } from '../firebase/services'
import { formatPrice, formatDate } from '../utils/helpers'
import '../styles/OrderConfirmation.css'

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        const orderData = await orderService.getById(orderId)
        setOrder(orderData)
      } catch (err) {
        setError('Orden no encontrada')
        console.error('Error loading order:', err)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (!orderId) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="order-confirmation-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando información de tu orden...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-error">
        <div className="error-container">
          <h2>⚠️ Orden no encontrada</h2>
          <p>{error || 'La orden que buscas no existe.'}</p>
          <Link to="/" className="back-button">
            Volver al inicio
          </Link>
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

        {/* Order Receipt */}
        <div className="order-receipt">
          {/* Order Info Header */}
          <div className="receipt-header">
            <div className="company-info">
              <h2>🔌 BitStore</h2>
              <p>Tu tienda de tecnología de confianza</p>
            </div>
            <div className="order-info">
              <h3>Orden #{order.orderNumber || order.id}</h3>
              <p>Fecha: {formatDate(order.createdAt)}</p>
              <div className="status-badge">
                <span className="status-icon">✅</span>
                Confirmado
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="receipt-section">
            <h3>👤 Información del Cliente</h3>
            <div className="customer-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Nombre:</strong>
                  <span>{order.buyer?.nombre || order.customer?.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{order.buyer?.email || order.customer?.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Teléfono:</strong>
                  <span>{order.buyer?.telefono || order.customer?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="receipt-section">
            <h3>📍 Dirección de Entrega</h3>
            <div className="address-details">
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, CP: {order.customer.postalCode}</p>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="receipt-section">
            <h3>🛒 Productos Adquiridos</h3>
            <div className="items-table">
              <div className="table-header">
                <span>Producto</span>
                <span>Cantidad</span>
                <span>Precio Unit.</span>
                <span>Total</span>
              </div>
              {order.items.map((item, index) => (
                <div key={item.id || index} className="table-row">
                  <div className="item-details">
                    <span className="item-name">{item.title || item.name}</span>
                    <span className="item-category">Categoría: {item.category || 'No especificada'}</span>
                  </div>
                  <span className="item-quantity">{item.quantity}</span>
                  <span className="item-price">{formatPrice(item.price)}</span>
                  <span className="item-total">{formatPrice(item.total || item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="receipt-section">
            <h3>📊 Resumen del Pedido</h3>
            <div className="order-totals">
              <div className="total-row">
                <span>Total de productos:</span>
                <span>{order.summary?.totalItems || order.items?.length || 0} items</span>
              </div>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.total || order.summary?.totalPrice || 0)}</span>
              </div>
              <div className="total-row">
                <span>Envío:</span>
                <span className="free-shipping">Gratis</span>
              </div>
              <div className="total-row final-total">
                <span>Total Final:</span>
                <span>{formatPrice(order.total || order.summary?.totalPrice || 0)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="receipt-section">
            <h3>💳 Información de Pago y Entrega</h3>
            <div className="payment-delivery-info">
              <div className="info-card">
                <h4>💰 Método de Pago</h4>
                <p>Pago contra entrega</p>
                <p>Aceptamos efectivo y tarjetas</p>
              </div>
              <div className="info-card">
                <h4>🚚 Tiempo de Entrega</h4>
                <p>2-5 días hábiles</p>
                <p>Te contactaremos para coordinar</p>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="receipt-actions">
            <button onClick={handlePrint} className="print-btn">
              🖨️ Imprimir Comprobante
            </button>
            <Link to="/" className="back-home-btn">
              🏠 Volver al inicio
            </Link>
            <Link to="/" className="continue-shopping-btn">
              🛍️ Ver más productos
            </Link>
          </div>

          {/* Footer */}
          <div className="receipt-footer">
            <p>¡Gracias por tu compra en BitStore!</p>
            <p>Cualquier consulta, contáctanos a: soporte@bitstore.com</p>
            <p>Este es tu comprobante de compra. Guárdalo para futuras referencias.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation 
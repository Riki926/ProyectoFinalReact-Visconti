import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./CheckoutForm.css";

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ 
    nombre: "", 
    email: "", 
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: ""
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Funciones de validación
  const validateNombre = (nombre) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nombre.trim()) return "El nombre es requerido";
    if (nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (!nameRegex.test(nombre)) return "El nombre solo puede contener letras y espacios";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "El email es requerido";
    if (!emailRegex.test(email)) return "Ingresa un email válido";
    return "";
  };

  const validateTelefono = (telefono) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '');
    if (!telefono.trim()) return "El teléfono es requerido";
    if (!phoneRegex.test(telefono)) return "El teléfono solo puede contener números, espacios y símbolos (+, -, (, ))";
    if (cleanPhone.length < 8 || cleanPhone.length > 15) return "El teléfono debe tener entre 8 y 15 dígitos";
    return "";
  };

  const validateDireccion = (direccion) => {
    if (!direccion.trim()) return "La dirección es requerida";
    if (direccion.trim().length < 5) return "La dirección debe tener al menos 5 caracteres";
    return "";
  };

  const validateCiudad = (ciudad) => {
    const cityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!ciudad.trim()) return "La ciudad es requerida";
    if (!cityRegex.test(ciudad)) return "La ciudad solo puede contener letras y espacios";
    return "";
  };

  const validateCodigoPostal = (codigo) => {
    const cpRegex = /^\d{4,8}$/;
    if (!codigo.trim()) return "El código postal es requerido";
    if (!cpRegex.test(codigo)) return "El código postal debe tener entre 4 y 8 números";
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      nombre: validateNombre(form.nombre),
      email: validateEmail(form.email),
      telefono: validateTelefono(form.telefono),
      direccion: validateDireccion(form.direccion),
      ciudad: validateCiudad(form.ciudad),
      codigoPostal: validateCodigoPostal(form.codigoPostal),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validar en tiempo real
    let error = "";
    switch (name) {
      case "nombre":
        error = validateNombre(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "telefono":
        error = validateTelefono(value);
        break;
      case "direccion":
        error = validateDireccion(value);
        break;
      case "ciudad":
        error = validateCiudad(value);
        break;
      case "codigoPostal":
        error = validateCodigoPostal(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        buyer: { ...form },
        items: cart.items.map(i => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          subtotal: i.quantity * i.product.price,
        })),
        total: cart.totalPrice,
        totalItems: cart.totalQuantity,
        date: Timestamp.fromDate(new Date()),
        status: "pendiente"
      };
      
      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      setOrder({
        id: docRef.id,
        ...orderData
      });
      
      clearCart();
    } catch (err) {
      console.error("Error al generar la orden:", err);
      setErrors({ submit: "Error al procesar la compra. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && !order) {
    return (
      <div className="checkout-empty">
        <h2>El carrito está vacío</h2>
        <p>Agrega productos antes de realizar la compra</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Ir a comprar
        </button>
      </div>
    );
  }

  if (order) {
    return (
      <div className="order-success">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h2>¡Compra realizada exitosamente!</h2>
          <p className="order-id">Número de orden: <strong>{order.id}</strong></p>
        </div>

        <div className="order-details">
          <div className="customer-info">
            <h3>Datos del Cliente</h3>
            <div className="info-grid">
              <div><strong>Nombre:</strong> {order.buyer.nombre}</div>
              <div><strong>Email:</strong> {order.buyer.email}</div>
              <div><strong>Teléfono:</strong> {order.buyer.telefono}</div>
              <div><strong>Dirección:</strong> {order.buyer.direccion}</div>
              <div><strong>Ciudad:</strong> {order.buyer.ciudad}</div>
              <div><strong>Código Postal:</strong> {order.buyer.codigoPostal}</div>
            </div>
          </div>

          <div className="order-items">
            <h3>Productos Comprados</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-receipt">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    <span>Cantidad: {item.quantity}</span>
                    <span>Precio: ${item.price.toLocaleString()}</span>
                    <span>Subtotal: ${item.subtotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Total de artículos:</span>
              <span>{order.totalItems}</span>
            </div>
            <div className="summary-row total">
              <span>Total a pagar:</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/")} className="btn-primary">
            Continuar comprando
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            Imprimir comprobante
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      
      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Datos Personales</h3>
              
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? "error" : ""}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? "error" : ""}
                  placeholder="Ej: +54 11 1234-5678"
                />
                {errors.telefono && <span className="error-text">{errors.telefono}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Dirección de Entrega</h3>
              
              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className={errors.direccion ? "error" : ""}
                  placeholder="Ej: Av. Corrientes 1234"
                />
                {errors.direccion && <span className="error-text">{errors.direccion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    className={errors.ciudad ? "error" : ""}
                    placeholder="Ej: Buenos Aires"
                  />
                  {errors.ciudad && <span className="error-text">{errors.ciudad}</span>}
                </div>

                <div className="form-group">
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={form.codigoPostal}
                    onChange={handleChange}
                    className={errors.codigoPostal ? "error" : ""}
                    placeholder="Ej: 1001"
                  />
                  {errors.codigoPostal && <span className="error-text">{errors.codigoPostal}</span>}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Procesando compra..." : "Confirmar compra"}
            </button>
    </form>
        </div>

        <div className="order-preview">
          <h3>Resumen del Pedido</h3>
          <div className="preview-items">
            {cart.items.map((item) => (
              <div key={item.product.id} className="preview-item">
                <span className="item-name">{item.product.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="preview-total">
            <strong>Total: ${cart.totalPrice.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}




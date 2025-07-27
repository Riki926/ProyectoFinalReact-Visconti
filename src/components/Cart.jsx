import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import "./Cart.css";

export default function Cart() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega productos y comienza a comprar!</p>
        <button onClick={() => navigate("/")} className="btn-shop">
          Ir a comprar
        </button>
      </div>
    );
  }

  const handleRemove = (id) => {
    const { removeFromCart } = useCart();
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart();
    }
  };

  return (
    <section className="cart-container" aria-label="Contenido del carrito">
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <button onClick={handleClearCart} className="btn-clear">
          Vaciar carrito
        </button>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map(({ product, quantity }) => (
            <CartItem 
              key={product.id} 
              product={product} 
              quantity={quantity} 
              onRemove={handleRemove} 
            />
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-content">
            <h3>Resumen del Pedido</h3>
            <div className="summary-row">
              <span>Productos ({cart.totalQuantity})</span>
              <span>${cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <span>${cart.totalPrice.toLocaleString()}</span>
            </div>
            
            <button
              onClick={() => navigate("/checkout")}
              className="btn-checkout"
            >
              Finalizar compra
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="btn-continue"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}




import React from "react";
import { useCart } from "../context/CartContext";
import "./CartItem.css";

export default function CartItem({ product, quantity, onRemove }) {
  const { updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(product.id, newQuantity);
  };

  const subtotal = quantity * product.price;

  return (
    <div className="cart-item">
      <div className="item-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="item-image"
        />
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{product.name}</h3>
        <p className="item-category">{product.category}</p>
        <p className="item-price">${product.price.toLocaleString()}</p>
      </div>
      
      <div className="quantity-controls">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)}
          className="quantity-btn"
          disabled={quantity <= 1}
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className="quantity-btn"
          disabled={quantity >= (product.stock || 99)}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
      
      <div className="item-subtotal">
        <span className="subtotal-label">Subtotal:</span>
        <span className="subtotal-amount">${subtotal.toLocaleString()}</span>
      </div>
      
      <button
        onClick={() => onRemove(product.id)}
        className="remove-btn"
        aria-label={`Eliminar ${product.name} del carrito`}
      >
        🗑️
      </button>
    </div>
  );
}




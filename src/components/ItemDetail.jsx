import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import ItemCount from "./ItemCount";

export default function ItemDetail({ product }) {
  const { dispatch } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  function handleAdd(quantity) {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    setAddedToCart(true);
  }

  return (
    <article
      aria-label={`Detalle de producto: ${product.name}`}
      style={{ display: "flex", gap: "2rem", padding: "1rem", flexWrap: "wrap" }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ maxWidth: "400px", width: "100%", borderRadius: "6px" }}
      />
      <div style={{ flex: "1" }}>
        <h2>{product.name}</h2>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p><strong>Stock disponible:</strong> {product.stock}</p>
        {!addedToCart && product.stock > 0 ? (
          <ItemCount stock={product.stock} initial={1} onAdd={handleAdd} />
        ) : (
          addedToCart ? <p>Producto agregado al carrito.</p> : <p>Producto sin stock.</p>
        )}
      </div>
    </article>
  );
}




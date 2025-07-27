import React, { useState } from "react";

export default function ItemCount({ stock, initial, onAdd }) {
  const [count, setCount] = useState(initial);

  function increment() {
    setCount(prev => Math.min(prev + 1, stock));
  }

  function decrement() {
    setCount(prev => Math.max(prev - 1, 1));
  }

  return (
    <div aria-label="Selector de cantidad para agregar al carrito" style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={decrement}
          aria-label="Disminuir cantidad"
          disabled={count <= 1}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          -
        </button>
        <span aria-live="polite" aria-atomic="true" style={{ minWidth: "2rem", textAlign: "center" }}>
          {count}
        </span>
        <button
          onClick={increment}
          aria-label="Aumentar cantidad"
          disabled={count >= stock}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => onAdd(count)}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        aria-disabled={stock === 0}
      >
        Agregar al carrito
      </button>
    </div>
  );
}




import React from "react";

export default function CartWidget({ count }) {
  return (
    <div aria-label={`Carrito con ${count} productos`} style={{ position: "relative", display: "inline-block" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-shopping-cart"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span
          aria-live="polite"
          style={{
            position: "absolute",
            top: "-5px",
            right: "-10px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}




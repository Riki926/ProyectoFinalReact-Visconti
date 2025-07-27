import React from "react";

export default function SkeletonList({ count = 4 }) {
  return (
    <section
      aria-label="Cargando productos"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            background: "#f6f7f8",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "1rem",
            minHeight: "350px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            animation: "pulse 1.5s infinite",
          }}
        >
          <div style={{
            width: "100%",
            height: "180px",
            background: "#e0e0e0",
            borderRadius: "8px",
            marginBottom: "1rem",
          }} />
          <div style={{ height: "20px", width: "70%", background: "#e0e0e0", borderRadius: "4px", marginBottom: "0.5rem" }} />
          <div style={{ height: "18px", width: "40%", background: "#e0e0e0", borderRadius: "4px" }} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
} 
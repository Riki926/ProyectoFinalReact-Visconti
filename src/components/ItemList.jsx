import React from "react";
import Item from "./Item";

function ItemList({ products }) {
  return (
    <section
      aria-label="Listado de productos"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {products.map(product => (
        <Item key={product.id} product={product} />
      ))}
    </section>
  );
}

export default React.memo(ItemList);




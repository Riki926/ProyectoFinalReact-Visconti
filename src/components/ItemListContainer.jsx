import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemList from "./ItemList";
import SkeletonList from "./SkeletonList";
import { useProducts } from "../hooks/useProducts";
import "./ItemListContainer.css";

const CATEGORY_ICONS = {
  auriculares: "🎧",
  camaras: "📷",
  celulares: "📱",
  tablets: "💊",
  smarttv: "📺",
  monitores: "🖥️",
  notebooks: "💻",
};

export default function ItemListContainer() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, fetchMore, hasMore } = useProducts();

  // Sincronizar categoryId con el estado local
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");

  useEffect(() => {
    setSelectedCategory(categoryId || "");
  }, [categoryId]);

  // Obtener categorías únicas de los productos
  const availableCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(product => 
      product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  // Productos destacados (solo en vista principal)
  const featuredProducts = useMemo(() => {
    if (selectedCategory) return [];
    return [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 3);
  }, [products, selectedCategory]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSelectedCategory(category);
      navigate(`/category/${category}`);
    } else {
      setSelectedCategory("");
      navigate("/");
    }
  };

  if (loading && products.length === 0) return <SkeletonList />;
  if (error) return <div className="error-message" role="alert">{error}</div>;
  if (filteredProducts.length === 0 && !loading) {
    return (
      <div className="no-products">
        <p>No hay productos disponibles en esta categoría.</p>
        <button onClick={() => handleCategoryChange("")} className="btn-secondary">
          Ver todos los productos
        </button>
      </div>
    );
  }

  return (
    <div className="item-list-container">
      <h1 className="page-title">
        {selectedCategory 
          ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` 
          : "Todos los Productos"
        }
      </h1>

      {/* Navegación por categorías */}
      <div className="category-nav">
        <button
          onClick={() => handleCategoryChange("")}
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
        >
          <span className="category-icon">🛒</span>
          Todas
        </button>
        
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            <span className="category-icon">
              {CATEGORY_ICONS[category] || "📦"}
            </span>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Productos destacados */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="featured-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="featured-item">
                <ItemList products={[product]} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lista principal de productos */}
      <section className="products-section">
        <div className="products-count">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
          {selectedCategory && ` en ${selectedCategory}`}
        </div>
        <ItemList products={filteredProducts} />
      </section>

      {/* Paginación */}
      {hasMore && !loading && (
        <div className="pagination">
          <button onClick={fetchMore} className="load-more-btn">
            Ver más productos
          </button>
        </div>
      )}
      
      {loading && products.length > 0 && <SkeletonList count={2} />}
    </div>
  );
}




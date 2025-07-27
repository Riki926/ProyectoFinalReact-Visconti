import React from "react";
import { Link } from "react-router-dom";
import "./Item.css";

function getImageByProductName(name = "") {
  const n = name.toLowerCase();
  
  // Auriculares - Imágenes específicas de auriculares
  if (n.includes("auricular")) {
    if (n.includes("apple") || n.includes("airpods")) {
      return "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop"; // AirPods
    }
    if (n.includes("sony")) {
      return "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop"; // Sony headphones
    }
    if (n.includes("bose")) {
      return "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop"; // Bose headphones
    }
    if (n.includes("beats")) {
      return "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop"; // Beats headphones
    }
    if (n.includes("razer") || n.includes("kraken")) {
      return "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop"; // Gaming headphones
    }
    if (n.includes("jbl")) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"; // JBL headphones
    }
    // Auriculares genéricos
    return "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop";
  }
  
  // Cámaras - Imágenes específicas de cámaras
  if (n.includes("cámara") || n.includes("camara")) {
    if (n.includes("canon")) {
      return "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop"; // Canon camera
    }
    if (n.includes("nikon")) {
      return "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop"; // Nikon camera
    }
    if (n.includes("sony") && n.includes("alpha")) {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop"; // Sony Alpha
    }
    // Cámaras genéricas
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop";
  }
  
  // Celulares - Imágenes específicas de smartphones
  if (n.includes("celular") || n.includes("iphone") || n.includes("smartphone")) {
    if (n.includes("iphone")) {
      return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"; // iPhone
    }
    if (n.includes("samsung") || n.includes("galaxy")) {
      return "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop"; // Samsung Galaxy
    }
    if (n.includes("xiaomi") || n.includes("redmi")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"; // Xiaomi phone
    }
    // Celulares genéricos
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop";
  }
  
  // Tablets - Imágenes específicas de tablets
  if (n.includes("tablet")) {
    if (n.includes("ipad")) {
      return "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=300&fit=crop"; // iPad
    }
    if (n.includes("samsung")) {
      return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"; // Samsung tablet
    }
    // Tablets genéricas
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop";
  }
  
  // Smart TV - Imágenes específicas de televisores
  if (n.includes("smart tv") || n.includes("televisor") || n.includes("tv")) {
    if (n.includes("samsung")) {
      return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop"; // Samsung TV
    }
    if (n.includes("lg")) {
      return "https://images.unsplash.com/photo-1571037928314-735d6d3b8d3d?w=300&h=300&fit=crop"; // LG TV
    }
    // TV genéricas
    return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop";
  }
  
  // Monitores - Imágenes específicas de monitores
  if (n.includes("monitor")) {
    if (n.includes("gaming") || n.includes("asus") || n.includes("tuf")) {
      return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"; // Gaming monitor
    }
    if (n.includes("4k") || n.includes("uhd")) {
      return "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=300&h=300&fit=crop"; // 4K monitor
    }
    // Monitores genéricos
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop";
  }
  
  // Notebooks - Imágenes específicas de laptops
  if (n.includes("notebook") || n.includes("laptop")) {
    if (n.includes("macbook")) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop"; // MacBook
    }
    if (n.includes("gaming") || n.includes("hp pavilion") || n.includes("msi")) {
      return "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop"; // Gaming laptop
    }
    if (n.includes("asus") || n.includes("vivobook")) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"; // ASUS laptop
    }
    // Notebooks genéricas
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop";
  }
  
  // Imagen por defecto para productos no categorizados
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop";
}

function Item({ product }) {
  const name = product?.name || "Sin nombre";
  const price = typeof product?.price === "number" ? product.price : null;
  const image = product?.image && product.image.trim() !== "" ? product.image : getImageByProductName(name);
  const category = product?.category || "Sin categoría";
  const stock = typeof product?.stock === "number" ? product.stock : "-";

  return (
    <article
      className="item-card"
      tabIndex="0"
      aria-label={`Producto: ${name}, precio: $${price !== null ? price : "N/D"}`}
    >
      <Link to={`/item/${product.id}`} className="item-link">
        <div className="item-image-container">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="item-image"
            onError={(e) => {
              // Fallback si la imagen falla
              e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop";
            }}
          />
          {stock !== "-" && stock < 5 && (
            <div className="stock-badge">¡Últimas {stock} unidades!</div>
          )}
        </div>
        
        <div className="item-content">
          <h3 className="item-title">{name}</h3>
          <p className="item-category">{category}</p>
          <div className="item-footer">
            <p className="item-price">
              {price !== null ? `$${price.toLocaleString()}` : "Precio no disponible"}
            </p>
            <div className="item-stock">
              Stock: {stock}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default React.memo(Item);




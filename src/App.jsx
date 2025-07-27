import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Featured from './pages/Featured'
import Category from './pages/Category'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import './styles/global.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/featured" element={<Featured />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:orderId" element={<OrderConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

// Componente 404
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Página no encontrada</h2>
          <p>Lo sentimos, la página que buscas no existe.</p>
          <a href="/" className="back-home-btn">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

// Componente Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🔌 BitStore</h3>
            <p>Tu tienda de tecnología de confianza</p>
            <div className="social-links">
              <span>📧 soporte@bitstore.com</span>
              <span>📞 +54 11 1234-5678</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Productos</h4>
            <ul>
              <li><a href="/category/auriculares">Auriculares</a></li>
              <li><a href="/category/notebooks">Notebooks</a></li>
              <li><a href="/category/celulares">Celulares</a></li>
              <li><a href="/category/tablets">Tablets</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Ayuda</h4>
            <ul>
              <li><a href="#help">Centro de ayuda</a></li>
              <li><a href="#shipping">Envíos</a></li>
              <li><a href="#returns">Devoluciones</a></li>
              <li><a href="#warranty">Garantía</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#about">Sobre nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#privacy">Privacidad</a></li>
              <li><a href="#terms">Términos</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 BitStore. Todos los derechos reservados.</p>
          <p>Desarrollado con ❤️ usando React + Firebase</p>
        </div>
      </div>
    </footer>
  )
}

export default App




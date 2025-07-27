import React, { useState, useEffect } from "react";
import "./BannerSlider.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    text: "¡Ofertas en tecnología! Hasta 40% OFF en notebooks y celulares.",
  },
  {
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    text: "Envíos gratis en compras superiores a $50.000.",
  },
  {
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    text: "¡Nuevos productos en audio y accesorios!",
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="banner-slider">
      <div className="slider-container">
        <img
          src={slides[current].image}
          alt={slides[current].text}
          className="slider-image"
        />
        
        <div className="slider-overlay">
          <div className="slider-text">
            {slides[current].text}
          </div>
        </div>

        {/* Controles de navegación */}
        <button 
          className="slider-nav prev" 
          onClick={prevSlide}
          aria-label="Slide anterior"
        >
          &#8249;
        </button>
        
        <button 
          className="slider-nav next" 
          onClick={nextSlide}
          aria-label="Siguiente slide"
        >
          &#8250;
        </button>

        {/* Indicadores */}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`dot ${idx === current ? 'active' : ''}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
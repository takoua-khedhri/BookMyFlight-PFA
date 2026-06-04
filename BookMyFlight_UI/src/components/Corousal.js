// Corousal.js - Version améliorée
import React, { useState } from 'react';
import homepage from '../assets/images/homepage.jpg';
import plane1 from '../assets/images/plane1.jpg';
import plane2 from '../assets/images/plane2.jpg';

function Corousal() {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const slides = [
        { src: homepage, alt: "Travel Experience", caption: "Book Your Dream Flight" },
        { src: plane1, alt: "Memorable Travel", caption: "Memorable Journeys" },
        { src: plane2, alt: "Safety First", caption: "Safe & Secure Travel" }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <div id="demo" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        data-bs-target="#demo"
                        data-bs-slide-to={idx}
                        className={idx === currentIndex ? "active" : ""}
                        aria-current={idx === currentIndex ? "true" : "false"}
                        aria-label={`Slide ${idx + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner">
                {slides.map((slide, idx) => (
                    <div key={idx} className={`carousel-item ${idx === currentIndex ? "active" : ""}`}>
                        <img 
                            src={slide.src} 
                            className="d-block w-100" 
                            alt={slide.alt}
                            style={{ height: "500px", objectFit: "cover" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h3 style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "10px" }}>
                                {slide.caption}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" onClick={prevSlide}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" onClick={nextSlide}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Corousal;
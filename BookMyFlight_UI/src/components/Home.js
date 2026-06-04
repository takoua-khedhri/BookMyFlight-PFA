// Home.js - Version améliorée
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SearchFlight from './SearchFlight';
import plane1 from '../assets/images/plane1.jpg';
import plane2 from '../assets/images/plane2.jpg';
import plane3 from '../assets/images/plane3.jpg';
import plane5 from '../assets/images/plane5.jpg';
import Corousal from './Corousal';

const features = [
    { image: plane1, feature: "Voyages Mémorables", description: "Créez des souvenirs inoubliables" },
    { image: plane2, feature: "Sécurité COVID-19", description: "Voyagez en toute sécurité" },
    { image: plane3, feature: "Service d'excellence", description: "À votre écoute 24/7" },
    { image: plane5, feature: "Réservation Facile", description: "En quelques clics seulement" }
];

function Home() {
    return (
        <div>
            <Header />
            
            {/* Hero Section avec Carousel */}
            <section className="mt-5 pt-2">
                <Corousal />
            </section>

            {/* Search Section */}
            <section className="bg-light">
                <SearchFlight />
            </section>

            {/* Features Section */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                        Pourquoi choisir BookMyFlight ?
                    </h2>
                    <div className="row g-4">
                        {features.map((feature, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <div className="card h-100 text-center border-0 shadow-sm feature-card">
                                    <div className="card-body p-4">
                                        <div className="feature-icon mb-3">
                                            <img 
                                                src={feature.image} 
                                                className="rounded-circle"
                                                alt={feature.feature}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <h5 className="card-title fw-bold">{feature.feature}</h5>
                                        <p className="card-text text-muted">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-5 bg-primary text-white">
                <div className="container text-center">
                    <h3 className="mb-3">Prêt à voyager ?</h3>
                    <p className="mb-4">Réservez votre vol maintenant et profitez des meilleurs tarifs</p>
                    <button 
                        className="btn btn-light btn-lg"
                        onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Réserver maintenant
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
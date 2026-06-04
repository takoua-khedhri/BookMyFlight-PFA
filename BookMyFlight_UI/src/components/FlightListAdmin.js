// FlightListAdmin.js - Version corrigée
import React, { Component } from 'react';
import FlightServiceRest from '../services/FlightServiceRest';
import Header from './Header';
import Footer from './Footer';

class FlightListAdmin extends Component {
    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.state = {
            flights: [],
            loading: true,
            error: ""
        };
    }

    componentDidMount() {
        this.checkAuth();
        this.loadFlights();
    }

    checkAuth = () => {
        if (!localStorage.getItem('user')) {
            alert('Veuillez vous connecter');
            this.props.history.push('/login');
            return false;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.isadmin !== 1) {
            alert('Accès réservé aux administrateurs');
            this.props.history.push('/');
            return false;
        }
        return true;
    };

    loadFlights = async () => {
        this.setState({ loading: true, error: "" });
        try {
            const data = await this.service.getFlights();
            if (data && data.length > 0) {
                this.setState({ flights: data, loading: false });
            } else {
                this.setState({ flights: [], loading: false });
            }
        } catch (error) {
            console.error('Erreur chargement:', error);
            this.setState({ error: "Erreur lors du chargement des vols", loading: false });
        }
    };

    onDelete = async (fid) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le vol ${fid} ?`)) {
            try {
                await this.service.deleteFlight(fid);
                alert('Vol supprimé avec succès');
                this.loadFlights(); // Recharger la liste
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    onEdit = (flight) => {
        localStorage.setItem('flight', JSON.stringify(flight));
        this.props.history.push('/updateFlight');
    };

    calculateDuration = (f) => {
        if (!f.departureTime || !f.arrivalTime) return 'N/A';
        try {
            let t1 = new Date(`1970-01-01T${f.departureTime}`);
            let t2 = new Date(`1970-01-01T${f.arrivalTime}`);
            let diff = Math.abs(t1 - t2);
            let hours = Math.floor(diff / 3600000);
            let minutes = Math.floor((diff % 3600000) / 60000);
            return `${hours}h ${minutes}min`;
        } catch (error) {
            return 'N/A';
        }
    };

    render() {
        const { flights, loading, error } = this.state;

        if (!localStorage.getItem('user')) return null;
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.isadmin !== 1) return null;

        return (
            <div>
                <Header />
                <div className="container py-5 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">
                            <i className="fas fa-plane me-2 text-primary"></i>
                            Gestion des vols
                            <span className="badge bg-primary ms-2">{flights.length} vol(s)</span>
                        </h2>
                        <button 
                            className="btn btn-success" 
                            onClick={() => this.props.history.push('/addFlight')}
                        >
                            <i className="fas fa-plus-circle me-2"></i>
                            Nouveau vol
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                            <button className="btn btn-sm btn-outline-danger ms-3" onClick={this.loadFlights}>
                                Réessayer
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                            <p className="mt-3">Chargement des vols...</p>
                        </div>
                    ) : flights.length === 0 ? (
                        <div className="alert alert-info text-center py-5">
                            <i className="fas fa-info-circle fa-3x mb-3"></i>
                            <h4>Aucun vol trouvé</h4>
                            <p>Cliquez sur "Nouveau vol" pour ajouter votre premier vol.</p>
                            <button className="btn btn-primary mt-2" onClick={() => this.props.history.push('/addFlight')}>
                                <i className="fas fa-plus-circle me-2"></i>
                                Ajouter un vol
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {flights.map((flight) => (
                                <div key={flight.flightNumber} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100 shadow-sm border-0 rounded-4 hover-card">
                                        <div className="card-header bg-gradient-primary text-white rounded-top-4">
                                            <h5 className="mb-0">
                                                <i className="fas fa-plane me-2"></i>
                                                Vol {flight.flightNumber}
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mb-3">
                                                <div className="col-6 text-center border-end">
                                                    <div className="fw-bold fs-5">{flight.source}</div>
                                                    <small className="text-muted">Départ</small>
                                                    <div className="fw-bold">{flight.arrivalTime?.substring(0,5)}</div>
                                                </div>
                                                <div className="col-6 text-center">
                                                    <div className="fw-bold fs-5">{flight.destination}</div>
                                                    <small className="text-muted">Arrivée</small>
                                                    <div className="fw-bold">{flight.departureTime?.substring(0,5)}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Date:</span>
                                                <span className="fw-bold">{flight.travelDate}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Durée:</span>
                                                <span className="fw-bold">{this.calculateDuration(flight)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Prix:</span>
                                                <span className="fw-bold text-success">{flight.price} €</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Sièges:</span>
                                                <span className={`fw-bold ${flight.availableSeats < 10 ? 'text-danger' : 'text-success'}`}>
                                                    {flight.availableSeats}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-white border-0 pb-3 d-flex gap-2">
                                            <button 
                                                className="btn btn-outline-warning flex-grow-1"
                                                onClick={() => this.onEdit(flight)}
                                            >
                                                <i className="fas fa-edit me-1"></i> Modifier
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger flex-grow-1"
                                                onClick={() => this.onDelete(flight.flightNumber)}
                                            >
                                                <i className="fas fa-trash-alt me-1"></i> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        );
    }
}

export default FlightListAdmin;
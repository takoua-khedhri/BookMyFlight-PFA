// SearchFlight.js - Version complète avec villes dynamiques
import React, { Component } from 'react';
import FlightList from './FlightList';
import FlightServiceRest from '../services/FlightServiceRest';

class SearchFlight extends Component {
    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.state = {
            source: "",
            destination: "",
            travelDate: "",
            flights: [],
            cities: [],  // Liste dynamique des villes
            searched: false,
            loading: false,
            loadingCities: true
        };
    }

    componentDidMount() {
        // Charger les villes depuis la base de données
        this.loadCities();
        // Charger tous les vols au démarrage
        this.loadAllFlights();
    }

    loadCities = async () => {
        this.setState({ loadingCities: true });
        try {
            const cities = await this.service.getCities();
            this.setState({ 
                cities: cities,
                loadingCities: false 
            });
            console.log('✅ Villes chargées:', cities);
        } catch (error) {
            console.error('Erreur chargement villes:', error);
            // Villes par défaut en cas d'erreur
            this.setState({ 
                cities: ['Paris', 'Londres', 'New York', 'Dubai', 'Tokyo'],
                loadingCities: false 
            });
        }
    };

    loadAllFlights = async () => {
        try {
            const data = await this.service.getFlights();
            if (data && data.length > 0) {
                this.setState({
                    flights: data,
                    searched: true
                });
            }
        } catch (error) {
            console.error('Erreur chargement vols:', error);
        }
    };

    handleInput = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    getFlightsList = async () => {
        const { source, destination, travelDate } = this.state;
        
        if (!source || !destination || !travelDate) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (source === destination) {
            alert('La source et la destination ne peuvent pas être identiques');
            return;
        }

        this.setState({ loading: true });

        try {
            const data = await this.service.getFlightsForUser(source, destination, travelDate);
            
            if (data && data.length > 0) {
                this.setState({
                    flights: data,
                    searched: true,
                    loading: false
                });
            } else {
                this.setState({ 
                    flights: [], 
                    searched: true, 
                    loading: false 
                });
                alert('Aucun vol trouvé pour ces critères');
            }
        } catch (error) {
            console.error('Erreur recherche:', error);
            this.setState({ loading: false });
            alert('Erreur lors de la recherche des vols');
        }
    };

    render() {
        const { cities, source, destination, travelDate, flights, searched, loading, loadingCities } = this.state;

        return (
            <div className="container py-4">
                <div className="card shadow-lg border-0 rounded-4">
                    <div className="card-body p-4">
                        <h3 className="card-title text-center mb-4" style={{ color: '#2c3e50' }}>
                            ✈ Rechercher un Vol
                        </h3>
                        
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Départ</label>
                                <select 
                                    className="form-select form-select-lg"
                                    name="source" 
                                    value={source}
                                    onChange={this.handleInput}
                                    disabled={loadingCities}
                                >
                                    <option value="">Sélectionnez</option>
                                    {cities.map(city => (
                                        <option key={`src-${city}`} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold">Arrivée</label>
                                <select 
                                    className="form-select form-select-lg"
                                    name="destination" 
                                    value={destination}
                                    onChange={this.handleInput}
                                    disabled={loadingCities}
                                >
                                    <option value="">Sélectionnez</option>
                                    {cities.map(city => (
                                        <option key={`dst-${city}`} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Date de voyage</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-lg"
                                    name="travelDate" 
                                    value={travelDate}
                                    onChange={this.handleInput}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="col-md-1 d-flex align-items-end">
                                <button 
                                    onClick={this.getFlightsList} 
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={loading || loadingCities}
                                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                    ) : (
                                        '🔍'
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        {loadingCities && (
                            <div className="text-center mt-3">
                                <small className="text-muted">Chargement des villes...</small>
                            </div>
                        )}
                    </div>
                </div>

                {searched && (
                    <div className="mt-5">
                        <h4 className="mb-3">
                            Vols disponibles 
                            {flights.length > 0 && <span className="badge bg-primary ms-2">{flights.length}</span>}
                        </h4>
                        <FlightList flights={flights} />
                    </div>
                )}
            </div>
        );
    }
}

export default SearchFlight;
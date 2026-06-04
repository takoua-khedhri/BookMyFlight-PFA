// FlightList.js - Version améliorée
import React from 'react';
import { withRouter } from 'react-router-dom';

class FlightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: props.flights || []
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.flights !== this.props.flights) {
            this.setState({ flights: this.props.flights });
        }
    }

    calculateDuration = (f) => {
        if (!f.departureTime || !f.arrivalTime) return 'N/A';
        
        try {
            let t1 = new Date(`1970-01-01T${f.departureTime}:00`);
            let t2 = new Date(`1970-01-01T${f.arrivalTime}:00`);
            let diff = Math.abs(t1 - t2);
            let hours = Math.floor(diff / 3600000);
            let minutes = Math.floor((diff % 3600000) / 60000);
            return `${hours}h ${minutes}min`;
        } catch (error) {
            return 'N/A';
        }
    };

    handleFlight = (flight) => {
        localStorage.setItem('plane', JSON.stringify(flight));
        this.props.history.push('/booking');
    };

    render() {
        const { flights } = this.state;

        if (!flights || flights.length === 0) {
            return (
                <div className="text-center py-5">
                    <h4>Aucun vol trouvé</h4>
                    <p>Veuillez modifier vos critères de recherche</p>
                </div>
            );
        }

        return (
            <div>
                <h3 className="mb-4" style={{ color: '#2c3e50' }}>Vols disponibles ({flights.length})</h3>
                <div className="row">
                    {flights.map((f, index) => (
                        <div key={f.flightNumber || index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm hover-card">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">✈ Vol {f.flightNumber}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Départ:</div>
                                        <div className="col-6">{f.source}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Arrivée:</div>
                                        <div className="col-6">{f.destination}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Date:</div>
                                        <div className="col-6">{f.travelDate}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Départ:</div>
                                        <div className="col-6">{f.arrivalTime}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Arrivée:</div>
                                        <div className="col-6">{f.departureTime}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold">Durée:</div>
                                        <div className="col-6">{this.calculateDuration(f)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 fw-bold text-success">Prix:</div>
                                        <div className="col-6 text-success fw-bold">{f.price} €</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6 fw-bold">Sièges:</div>
                                        <div className="col-6">{f.availableSeats}</div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white">
                                    <button 
                                        className="btn btn-primary w-100"
                                        onClick={() => this.handleFlight(f)}
                                        disabled={f.availableSeats === 0}
                                    >
                                        {f.availableSeats === 0 ? 'Complet' : 'Réserver'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default withRouter(FlightList);
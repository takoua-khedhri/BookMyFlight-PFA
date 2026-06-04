// AddFlight.js - Version complète et corrigée
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import FlightServiceRest from '../services/FlightServiceRest';

// Liste complète des pays du monde
const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua", "Argentina", "Armenia", 
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", 
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", 
    "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
    "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", 
    "Sao Tome", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", 
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
].sort();

class AddFlight extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            source: "",
            destination: "",
            travelDate: "",
            arrivalTime: "",
            departureTime: "",
            price: "",
            availableSeats: "",
            message: "",
            error: "",
            loading: false
        };
        
        this.service = new FlightServiceRest();
    }

    componentDidMount() {
        this.checkAuth();
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

    handleInput = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value, message: "", error: "" });
    };

    onSave = async (e) => {
        e.preventDefault();
        
        const { source, destination, travelDate, arrivalTime, departureTime, price, availableSeats } = this.state;
        
        // Validation
        if (!source || !destination || !travelDate || !arrivalTime || !departureTime || !price || !availableSeats) {
            this.setState({ error: "Tous les champs sont obligatoires" });
            return;
        }
        
        if (source === destination) {
            this.setState({ error: "La source et la destination ne peuvent pas être identiques" });
            return;
        }
        
        const priceNum = parseFloat(price);
        const seatsNum = parseInt(availableSeats);
        
        if (isNaN(priceNum) || priceNum <= 0) {
            this.setState({ error: "Le prix doit être un nombre supérieur à 0" });
            return;
        }
        
        if (isNaN(seatsNum) || seatsNum < 0) {
            this.setState({ error: "Le nombre de sièges doit être un nombre positif" });
            return;
        }
        
        this.setState({ loading: true, error: "", message: "" });
        
        // Formatage des données pour le backend
        const flight = {
            source: source,
            destination: destination,
            travelDate: travelDate,
            arrivalTime: arrivalTime + ":00",
            departureTime: departureTime + ":00",
            price: priceNum,
            availableSeats: seatsNum
        };
        
        console.log("📤 Envoi du vol:", flight);
        
        try {
            const result = await this.service.saveFlight(flight);
            console.log("📥 Réponse:", result);
            
            if (result && result.success) {
                this.setState({ 
                    message: "✅ Vol ajouté avec succès ! Redirection...",
                    loading: false,
                    source: "", 
                    destination: "", 
                    travelDate: "", 
                    arrivalTime: "", 
                    departureTime: "", 
                    price: "", 
                    availableSeats: ""
                });
                setTimeout(() => this.props.history.push('/allFlights'), 2000);
            } else {
                const errorMsg = result?.message || "Erreur lors de l'ajout du vol";
                this.setState({ error: errorMsg, loading: false });
            }
        } catch (error) {
            console.error("❌ Erreur détaillée:", error);
            let errorMsg = "Erreur lors de l'ajout du vol";
            if (error.message) errorMsg += ": " + error.message;
            this.setState({ error: errorMsg, loading: false });
        }
    };

    resetForm = () => {
        this.setState({ 
            source: "", 
            destination: "", 
            travelDate: "", 
            arrivalTime: "", 
            departureTime: "", 
            price: "", 
            availableSeats: "",
            error: "",
            message: ""
        });
    };

    render() {
        // Vérification d'authentification
        if (!localStorage.getItem('user')) return null;
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.isadmin !== 1) return null;
        } catch (e) {
            return null;
        }
        
        const { source, destination, travelDate, arrivalTime, departureTime, price, availableSeats, message, error, loading } = this.state;
        
        return (
            <div>
                <Header />
                <div className="container py-5 mt-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-header bg-primary text-white text-center rounded-top-4 py-3">
                                    <h3 className="mb-0">
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Ajouter un nouveau vol
                                    </h3>
                                </div>
                                <div className="card-body p-4">
                                    {error && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            <i className="fas fa-exclamation-circle me-2"></i>
                                            {error}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => this.setState({ error: "" })}></button>
                                        </div>
                                    )}
                                    {message && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            <i className="fas fa-check-circle me-2"></i>
                                            {message}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => this.setState({ message: "" })}></button>
                                        </div>
                                    )}
                                    
                                    <form onSubmit={this.onSave}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-plane-departure me-1 text-primary"></i> Source
                                                </label>
                                                <select 
                                                    className="form-select form-select-lg"
                                                    name="source" 
                                                    value={source}
                                                    onChange={this.handleInput}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                >
                                                    <option value="">Sélectionnez le pays de départ</option>
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-plane-arrival me-1 text-primary"></i> Destination
                                                </label>
                                                <select 
                                                    className="form-select form-select-lg"
                                                    name="destination" 
                                                    value={destination}
                                                    onChange={this.handleInput}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                >
                                                    <option value="">Sélectionnez le pays d'arrivée</option>
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div className="col-md-12">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-calendar-alt me-1 text-primary"></i> Date de vol
                                                </label>
                                                <input 
                                                    type="date" 
                                                    className="form-control form-control-lg"
                                                    name="travelDate" 
                                                    value={travelDate}
                                                    onChange={this.handleInput}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-clock me-1 text-primary"></i> Heure de départ
                                                </label>
                                                <input 
                                                    type="time" 
                                                    className="form-control form-control-lg"
                                                    name="arrivalTime" 
                                                    value={arrivalTime}
                                                    onChange={this.handleInput}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-clock me-1 text-primary"></i> Heure d'arrivée
                                                </label>
                                                <input 
                                                    type="time" 
                                                    className="form-control form-control-lg"
                                                    name="departureTime" 
                                                    value={departureTime}
                                                    onChange={this.handleInput}
                                                    required
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-tag me-1 text-primary"></i> Prix (€)
                                                </label>
                                                <input 
                                                    type="number" 
                                                    className="form-control form-control-lg"
                                                    placeholder="Ex: 150"
                                                    name="price" 
                                                    value={price}
                                                    onChange={this.handleInput}
                                                    required
                                                    min="0"
                                                    step="1"
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-chair me-1 text-primary"></i> Sièges disponibles
                                                </label>
                                                <input 
                                                    type="number" 
                                                    className="form-control form-control-lg"
                                                    placeholder="Ex: 50"
                                                    name="availableSeats" 
                                                    value={availableSeats}
                                                    onChange={this.handleInput}
                                                    required
                                                    min="0"
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex gap-3 mt-4">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary btn-lg flex-grow-1"
                                                disabled={loading}
                                                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '10px' }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Ajout en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save me-2"></i>
                                                        Ajouter le vol
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary btn-lg"
                                                onClick={this.resetForm}
                                            >
                                                <i className="fas fa-undo-alt me-2"></i>
                                                Réinitialiser
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default AddFlight;
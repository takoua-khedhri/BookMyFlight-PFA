// App.js - Version avec protection avancée des routes
import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

// Import des composants critiques
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ErrorWorld from './components/ErrorWorld';

// Lazy loading
const Booking = lazy(() => import('./components/Booking'));
const Passengers = lazy(() => import('./components/Passengers'));
const Ticket = lazy(() => import('./components/Ticket'));
const Tickets = lazy(() => import('./components/Tickets'));
const Payment = lazy(() => import('./components/Payment'));
const Summary = lazy(() => import('./components/Summary'));
const Admin = lazy(() => import('./components/Admin'));
const AddFlight = lazy(() => import('./components/AddFlight'));
const FlightListAdmin = lazy(() => import('./components/FlightListAdmin'));
const UpdateFlight = lazy(() => import('./components/UpdateFlight'));

// Composant de chargement
const LoadingFallback = () => (
  <div className="loading-overlay">
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p style={{ color: 'white', marginTop: '20px' }}>Chargement en cours...</p>
    </div>
  </div>
);

// HOC pour la protection des routes
const withAuth = (WrappedComponent, requireAdmin = false) => {
  return (props) => {
    const history = useHistory();
    const user = localStorage.getItem('user');
    
    useEffect(() => {
      if (!user) {
        history.replace('/login');
        return;
      }
      
      if (requireAdmin) {
        const userData = JSON.parse(user);
        if (userData.isadmin !== 1) {
          history.replace('/');
        }
      }
    }, [user, history]);
    
    if (!user) return null;
    if (requireAdmin) {
      const userData = JSON.parse(user);
      if (userData.isadmin !== 1) return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Composants protégés
const ProtectedBooking = withAuth(Booking);
const ProtectedPassengers = withAuth(Passengers);
const ProtectedTicket = withAuth(Ticket);
const ProtectedTickets = withAuth(Tickets);
const ProtectedPayment = withAuth(Payment);
const ProtectedSummary = withAuth(Summary);
const ProtectedAdmin = withAuth(Admin, true);
const ProtectedAddFlight = withAuth(AddFlight, true);
const ProtectedFlightListAdmin = withAuth(FlightListAdmin, true);
const ProtectedUpdateFlight = withAuth(UpdateFlight, true);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Routes publiques */}
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Routes protégées */}
        <Route path="/booking" component={ProtectedBooking} />
        <Route path="/passengers" component={ProtectedPassengers} />
        <Route path="/ticket" component={ProtectedTicket} />
        <Route path="/tickets" component={ProtectedTickets} />
        <Route path="/payment" component={ProtectedPayment} />
        <Route path="/summary" component={ProtectedSummary} />
        <Route path="/admin" component={ProtectedAdmin} />
        <Route path="/addFlight" component={ProtectedAddFlight} />
        <Route path="/allFlights" component={ProtectedFlightListAdmin} />
        <Route path="/updateFlight" component={ProtectedUpdateFlight} />
        
        {/* Route 404 */}
        <Route component={ErrorWorld} />
      </Switch>
    </Suspense>
  );
}

export default App;
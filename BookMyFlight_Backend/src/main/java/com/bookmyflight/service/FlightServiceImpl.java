package com.bookmyflight.service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookmyflight.entity.Flight;
import com.bookmyflight.exception.FlightException;
import com.bookmyflight.repo.FlightRepository;

@Service
public class FlightServiceImpl implements FlightService {
    
    @Autowired
    FlightRepository frepo;
    
    @Override
    public int addFlight(Flight flight) throws FlightException {
        System.out.println("=== Service: Ajout d'un nouveau vol ===");
        System.out.println("Vol à ajouter: " + flight);
        
        // Vérifier si un vol identique existe déjà
        List<Flight> existingFlights = frepo.findByCondition(
            flight.getSource(), 
            flight.getDestination(), 
            flight.getTravelDate()
        );
        
        for(Flight existing : existingFlights) {
            if(existing.getArrivalTime().equals(flight.getArrivalTime()) && 
               existing.getDepartureTime().equals(flight.getDepartureTime())) {
                throw new FlightException("Un vol identique existe déjà avec le numéro " + existing.getFlightNumber());
            }
        }
        
        // Sauvegarder le vol
        Flight savedFlight = frepo.save(flight);
        System.out.println("✅ Vol sauvegardé avec l'ID: " + savedFlight.getFlightNumber());
        
        return savedFlight.getFlightNumber();
    }
    
    @Override
    public Collection<Flight> fetchAll() {
        System.out.println("📋 Récupération de tous les vols");
        List<Flight> flights = frepo.findAll();
        System.out.println("📊 " + flights.size() + " vols trouvés");
        return flights;
    }
    
    @Override
    public Flight fetchFlight(String source, String destination, LocalDate scheduleDate) throws FlightException {
        List<Flight> flights = frepo.findByCondition(source, destination, scheduleDate);
        if(flights != null && !flights.isEmpty()) {
            return flights.get(0);
        }
        throw new FlightException("Vol non trouvé avec les critères spécifiés");
    }
    
    @Override
    public Collection<Flight> fetchFlightsOnCondition(String source, String destination, LocalDate scheduleDate)
            throws FlightException {
        System.out.println("🔍 Recherche de vols: " + source + " -> " + destination + " le " + scheduleDate);
        List<Flight> flights = frepo.findByCondition(source, destination, scheduleDate);
        System.out.println("✅ " + flights.size() + " vol(s) trouvé(s)");
        return flights;
    }
    
    @Override
    public int updateFlight(Flight flight) throws FlightException {
        System.out.println("✏️ Mise à jour du vol: " + flight.getFlightNumber());
        
        Optional<Flight> existingOpt = frepo.findById(flight.getFlightNumber());
        if(existingOpt.isPresent()) {
            Flight existing = existingOpt.get();
            existing.setSource(flight.getSource());
            existing.setDestination(flight.getDestination());
            existing.setTravelDate(flight.getTravelDate());
            existing.setArrivalTime(flight.getArrivalTime());
            existing.setDepartureTime(flight.getDepartureTime());
            existing.setPrice(flight.getPrice());
            existing.setAvailableSeats(flight.getAvailableSeats());
            
            Flight updated = frepo.save(existing);
            System.out.println("✅ Vol mis à jour: " + updated.getFlightNumber());
            return updated.getFlightNumber();
        } else {
            throw new FlightException("Vol non trouvé avec l'ID: " + flight.getFlightNumber());
        }
    }
    
    @Override
    public void removeFlight(int flightNumber) {
        System.out.println("🗑️ Suppression du vol: " + flightNumber);
        frepo.deleteById(flightNumber);
        System.out.println("✅ Vol supprimé");
    }
    
    @Override
    public Flight fetchById(int fid) {
        Optional<Flight> flightOpt = frepo.findById(fid);
        return flightOpt.orElse(null);
    }
}
package com.bookmyflight.rest;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyflight.entity.Flight;
import com.bookmyflight.exception.FlightException;
import com.bookmyflight.service.FlightService;

// SUPPRIMEZ @CrossOrigin - On va le gérer globalement
@RestController
@RequestMapping("/flight")
public class FlightController {

    @Autowired
    FlightService fservice;

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addFlight(@RequestBody Flight flight) {
        try {
            System.out.println("=== Ajout d'un nouveau vol ===");
            int id = fservice.addFlight(flight);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vol ajouté avec succès");
            response.put("flightNumber", id);
            response.put("success", true);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (FlightException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("success", false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/fetchall", produces = "application/json")
    public ResponseEntity<?> searchFlights() {
        try {
            Collection<Flight> flights = fservice.fetchAll();
            System.out.println("📊 Nombre de vols récupérés: " + flights.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", flights.size());
            response.put("flights", flights);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/cities", produces = "application/json")
    public ResponseEntity<?> getAllCities() {
        try {
            System.out.println("🏙️ Récupération des villes...");
            Collection<Flight> flights = fservice.fetchAll();
            
            List<String> cities = new ArrayList<>();
            
            for (Flight flight : flights) {
                String source = flight.getSource();
                String destination = flight.getDestination();
                
                if (source != null && !source.isEmpty() && !cities.contains(source)) {
                    cities.add(source);
                }
                if (destination != null && !destination.isEmpty() && !cities.contains(destination)) {
                    cities.add(destination);
                }
            }
            
            Collections.sort(cities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", cities);
            response.put("count", cities.size());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
            List<String> defaultCities = List.of("Paris", "Londres", "New York", "Dubai", "Tokyo");
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("cities", defaultCities);
            response.put("count", defaultCities.size());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/fetch", produces = "application/json")
    public ResponseEntity<?> searchFlight(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {
        try {
            System.out.println("🔍 Recherche: " + source + " -> " + destination + " le " + date);
            
            LocalDate travelDate = LocalDate.parse(date);
            Collection<Flight> flights = fservice.fetchFlightsOnCondition(source, destination, travelDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", flights.size());
            response.put("flights", flights);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (FlightException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", 0);
            response.put("flights", new ArrayList<>());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/fetch/{flightNumber}", produces = "application/json")
    public ResponseEntity<?> getFlightById(@PathVariable int flightNumber) {
        try {
            Flight flight = fservice.fetchById(flightNumber);
            if (flight != null) {
                return new ResponseEntity<>(flight, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(createErrorResponse("Vol non trouvé"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "/remove/{fid}", produces = "application/json")
    public ResponseEntity<?> removeFlight(@PathVariable int fid) {
        try {
            fservice.removeFlight(fid);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vol supprimé avec succès");
            response.put("success", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateFlight(@RequestBody Flight flight) {
        try {
            int id = fservice.updateFlight(flight);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vol mis à jour avec succès");
            response.put("flightNumber", id);
            response.put("success", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (FlightException e) {
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(createErrorResponse(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }
}
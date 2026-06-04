package com.bookmyflight.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight")
@SequenceGenerator(name = "flight_seq", sequenceName = "flight_seq", initialValue = 1001)
public class Flight {
    
    @Id
    @GeneratedValue(generator = "flight_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "flight_number")
    private int flightNumber;
    
    private String source;
    private String destination;
    
    @Column(name = "travel_date")
    private LocalDate travelDate;
    
    @Column(name = "arrival_time")
    private LocalTime arrivalTime;
    
    @Column(name = "departure_time")
    private LocalTime departureTime;
    
    private double price;
    private int availableSeats;
    
    // Getters et Setters
    public int getFlightNumber() {
        return flightNumber;
    }
    
    public void setFlightNumber(int flightNumber) {
        this.flightNumber = flightNumber;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public LocalDate getTravelDate() {
        return travelDate;
    }
    
    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }
    
    public LocalTime getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public LocalTime getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }
    
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }
    
    public int getAvailableSeats() {
        return availableSeats;
    }
    
    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
    
    // Méthode utilitaire pour formater l'heure
    public String getFormattedArrivalTime() {
        if(arrivalTime != null) {
            return arrivalTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        }
        return "";
    }
    
    public String getFormattedDepartureTime() {
        if(departureTime != null) {
            return departureTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        }
        return "";
    }
    
    @Override
    public String toString() {
        return "Flight [flightNumber=" + flightNumber + ", source=" + source + ", destination=" + destination
                + ", travelDate=" + travelDate + ", arrivalTime=" + arrivalTime + ", departureTime=" + departureTime
                + ", price=" + price + ", availableSeats=" + availableSeats + "]";
    }
}
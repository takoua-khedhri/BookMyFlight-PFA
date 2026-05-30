package com.bookmyflight.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;


import com.fasterxml.jackson.annotation.JsonManagedReference;



@Entity
@Table(name="booking")
@SequenceGenerator(name = "booking_seq",sequenceName = "booking_seq",initialValue = 2001)
public class Booking {
	@Id
	@GeneratedValue(generator = "booking_seq",strategy=GenerationType.SEQUENCE)
	@Column(name = "booking_id")
	private int bookingId;
	
	@Column(name="seats")
	private int numberOfSeatsToBook;
	
	private int payStatus;
	private LocalDate bookingDate;
	
	/* One booking remembers one flight
	Parent of Flight entity*/
	@OneToOne
	@JoinColumn(name = "flight_number")		
	private Flight flight;
	
	/*One booking remembers multiple passengers
	Parent of Passenger entity*/
	@JsonManagedReference
	@OneToMany(mappedBy = "booking",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
	private List<Passenger> passengers = new ArrayList<Passenger>();
	
	public int getBookingId() {
		return bookingId;
	}
	public void setBookingId(int bookingId) {
		this.bookingId = bookingId;
	}

	public int getNumberOfSeatsToBook() {
		return numberOfSeatsToBook;
	}
	public void setNumberOfSeatsToBook(int numberOfSeatsToBook) {
		this.numberOfSeatsToBook = numberOfSeatsToBook;
	}
	public int getPayStatus() {
		return payStatus;
	}
	public void setPayStatus(int payStatus) {
		this.payStatus = payStatus;
	}
	public Flight getFlight() {
		return flight;
	}
	public void setFlight(Flight flight) {
		this.flight = flight;
	}
	public List<Passenger> getPassengers() {
		return passengers;
	}
	public void setPassengers(List<Passenger> passengers) {
		this.passengers = passengers;
	}
	public LocalDate getBookingDate() {
		return bookingDate;
	}
	public void setBookingDate(LocalDate bookingDate) {
		this.bookingDate = bookingDate;
	}
	
	
}
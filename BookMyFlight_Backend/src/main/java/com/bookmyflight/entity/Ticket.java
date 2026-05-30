package com.bookmyflight.entity;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;

/**
 * 
 * @author Vikrant
 * Description: Store ticket details, Booking id and user id
 *
 */
@Entity
@SequenceGenerator(name = "ticket_seq",sequenceName = "ticket_seq",initialValue = 5001)
public class Ticket {
	
	@Id
	@GeneratedValue(generator = "ticket_seq",strategy=GenerationType.SEQUENCE)
	@Column(name = "ticket_number")
	private int ticketNumber;
	
	//One ticket remembers its user
	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	//One ticket remembers its booking
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "booking_id")
	private Booking booking;
	
	private LocalDate booking_date;
	private double total_pay;
	
	public Ticket() {
	}

	public Ticket(int ticket_number, LocalDate booking_date, double total_pay) {
		super();
	
		this.ticketNumber = ticket_number;
		this.booking_date = booking_date;
		this.total_pay = total_pay;
	}

	public LocalDate getBooking_date() {
		return booking_date;
	}

	public void setBooking_date(LocalDate booking_date) {
		this.booking_date = booking_date;
	}

	public double getTotal_pay() {
		return total_pay;
	}

	public void setTotal_pay(double total_pay) {
		this.total_pay = total_pay;
	}

	public int getTicketNumber() {
		return ticketNumber;
	}

	public void setTicketNumber(int ticketNumber) {
		this.ticketNumber = ticketNumber;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Booking getBooking() {
		return booking;
	}

	public void setBooking(Booking booking) {
		this.booking = booking;
	}

	
}
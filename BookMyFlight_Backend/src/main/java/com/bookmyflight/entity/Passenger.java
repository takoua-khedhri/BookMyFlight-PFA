package com.bookmyflight.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Table(name = "passenger")
@SequenceGenerator(name = "passenger_seq",sequenceName = "passneger_seq",initialValue = 4001)
public class Passenger {

	@Id
	@GeneratedValue(generator = "passenegr_seq",strategy=GenerationType.SEQUENCE)
	private int pid;
	@Column(name = "pass_name")
	private String pname;
	private String gender;
	private int age;
	
	/*Many passengers are added to one booking
	 *Child of Booking entity  
	 */
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "booking_id")
	private Booking booking;
	
	public Passenger() {
	}
	
	public int getPid() {
		return pid;
	}
	public void setPid(int pid) {
		this.pid = pid;
	}
	public String getPname() {
		return pname;
	}
	public void setPname(String pname) {
		this.pname = pname;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}

	public Booking getBooking() {
		return booking;
	}

	public void setBooking(Booking booking) {
		this.booking = booking;
	}
	
	
}


package com.project.Bom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column
	private String name;
	
	@Column(unique = true,nullable = false)
	private String username;
	
	@Column(nullable = false)
	private String Password;
	
	@Column
	private String email;

	@Column(nullable = false)
	private String role;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PlanType plan = PlanType.FREE;
	
	
	private LocalDateTime upgradedAt;
	
	private String paymentId;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return Password;
	}

	public void setPassword(String password) {
		Password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public PlanType getPlan() {
		return plan;
	}

	public void setPlan(PlanType plan) {
		this.plan = plan;
	}

	public LocalDateTime getUpgradedAt() {
		return upgradedAt;
	}

	public void setUpgradedAt(LocalDateTime upgradedAt) {
		this.upgradedAt = upgradedAt;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}	
	
}

package com.project.Bom.dto;

import com.project.Bom.entity.PlanType;

public class UserDTO {
	private String name;
	private String username;
	private String email;
	private PlanType plan;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public PlanType getPlan() {
		return plan;
	}
	public void setPlan(PlanType plan) {
		this.plan = plan;
	}
	
	
}

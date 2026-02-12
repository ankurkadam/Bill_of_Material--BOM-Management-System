package com.project.Bom.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Product_Master")
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "product_name")
	private String productName;
	
	@Column(name = "product_code",unique = true,nullable = false)
	private String productCode;
	
	@ManyToOne(optional = false)
	@JoinColumn(name = "owner_id")
	private User owner;
	
	public Product() {
		
	}

	@Override
	public String toString() {
		return "Product [id=" + id + ", productName=" + productName + ", productCode=" + productCode + "]";
	}
	
	
	
	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public Product(Integer id, String productName, String productCode) {
		super();
		this.id = id;
		this.productName = productName;
		this.productCode = productCode;
	}

	
	
	
	
}

package com.project.Bom.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "bom_version",
	uniqueConstraints =  @UniqueConstraint(columnNames = {"product_id", "version_number"} )
		)
public class BomVersion {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne(optional = false)
	@JoinColumn(name = "product_id")
	private Product product;
	
	@Column(name = "version_number",nullable = false)
	private Integer versionNumber;
	
	@Lob
	@Column(name = "bom_snapshot",nullable = false,columnDefinition = "TEXT")
	private String bomSnapshot;
	
	@Column(name = "created_At",nullable = false)
	private LocalDateTime createdAt;
	
	@ManyToOne(optional = false)
	@JoinColumn(name = "created_by")
	private User createdBy;
	
	@Column(name = "is_latest",nullable = false)
	private boolean latest;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Integer getVersionNumber() {
		return versionNumber;
	}

	public void setVersionNumber(Integer versionNumber) {
		this.versionNumber = versionNumber;
	}

	public String getBomSnapshot() {
		return bomSnapshot;
	}

	public void setBomSnapshot(String bomSnapshot) {
		this.bomSnapshot = bomSnapshot;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public boolean isLatest() {
		return latest;
	}

	public void setLatest(boolean latest) {
		this.latest = latest;
	}
	
	
}

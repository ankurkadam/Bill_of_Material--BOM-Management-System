package com.project.Bom.dto;

import java.time.LocalDateTime;

public class BomVersionDetailDTO {
    private Integer versionNumber;
    private String productName;
    private String productCode;
    private Object bom;   
    private LocalDateTime createdAt;
    private String createdBy;
	public Integer getVersionNumber() {
		return versionNumber;
	}
	public void setVersionNumber(Integer versionNumber) {
		this.versionNumber = versionNumber;
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
	public Object getBom() {
		return bom;
	}
	public void setBom(Object bom) {
		this.bom = bom;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
    
    
	
}

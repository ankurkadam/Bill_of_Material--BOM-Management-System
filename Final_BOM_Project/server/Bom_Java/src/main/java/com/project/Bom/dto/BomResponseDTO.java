package com.project.Bom.dto;

import java.util.List;

public class BomResponseDTO {
	private ProductSummaryDTO product;
	private Integer version;
	private List<BomNodeDTO> components;
	
	public ProductSummaryDTO getProduct() {
		return product;
	}
	public void setProduct(ProductSummaryDTO product) {
		this.product = product;
	}
	public Integer getVersion() {
		return version;
	}
	public void setVersion(Integer version) {
		this.version = version;
	}
	public List<BomNodeDTO> getComponents() {
		return components;
	}
	public void setComponents(List<BomNodeDTO> components) {
		this.components = components;
	}
	
	
}

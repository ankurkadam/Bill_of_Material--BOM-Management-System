package com.project.Bom.dto;

public class ProductDTO {
	 	@Override
	public String toString() {
		return "ProductDTO [id=" + id + ", productName=" + productName + ", productCode=" + productCode + "]";
	}
		public ProductDTO() {
			
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
		public ProductDTO(Integer id, String productName, String productCode) {
		super();
		this.id = id;
		this.productName = productName;
		this.productCode = productCode;
	}
		private Integer id;
	    private String productName;
	    private String productCode;
}

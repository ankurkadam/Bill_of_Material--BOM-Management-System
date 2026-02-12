package com.project.Bom.dto;

import java.util.List;

public class BomDTO {
	    private Integer productId;
	    private String productName;
	    private String productCode;
	    private List<ComponentDTO> components;
	    private List<BomNodeDTO> componentTree;

	  public BomDTO() {
		
	}
	  public BomDTO(Integer productId, String productName, String productCode, List<ComponentDTO> components) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.productCode = productCode;
		this.components = components;
	}
	  @Override
	public String toString() {
		return "BomDTO [productId=" + productId + ", productName=" + productName + ", productCode=" + productCode
				+ ", components=" + components + "]";
	}
	  
	  public List<BomNodeDTO> getComponentTree() {
		return componentTree;
	}
	  public void setComponentTree(List<BomNodeDTO> componentTree) {
		  this.componentTree = componentTree;
	  }
	  public Integer getProductId() {
		return productId;
	}
	  public void setProductId(Integer productId) {
		  this.productId = productId;
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
	  public List<ComponentDTO> getComponents() {
		  return components;
	  }
	  public void setComponents(List<ComponentDTO> components) {
		  this.components = components;
	  }
	
}

package com.project.Bom.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ComponentDTO {

	private Integer componentId;
    private String componentName;
    private int quantity;
    
    @JsonProperty("parent_component_id")
    @JsonAlias("parentComponentId")
    private Integer parentComponentId;
	
    public Integer getParentComponentId() {
		return parentComponentId;
	}

	public void setParentComponentId(Integer parentComponentId) {
		this.parentComponentId = parentComponentId;
	}

	public ComponentDTO() {
	}
		
	public ComponentDTO(Integer componentId, String componentName, int quantity, Integer parentComponentId) {
			super();
			this.componentId = componentId;
			this.componentName = componentName;
			this.quantity = quantity;
			this.parentComponentId = parentComponentId;
		}

	@Override
	public String toString() {
		return "ComponentDTO [componentId=" + componentId + ", componentName=" + componentName + ", quantity="
				+ quantity + ", parentComponentId=" + parentComponentId + "]";
	}
		public Integer getComponentId() {
		return componentId;
	}
	public void setComponentId(Integer componentId) {
		this.componentId = componentId;
	}
	public String getComponentName() {
		return componentName;
	}
	public void setComponentName(String componentName) {
		this.componentName = componentName;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
		
	
		

}

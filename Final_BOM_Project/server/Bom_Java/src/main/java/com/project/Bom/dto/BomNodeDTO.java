package com.project.Bom.dto;

import java.util.ArrayList;
import java.util.List;

public class BomNodeDTO {
	 private Integer componentId;
	private String name;
	private int quantity;
	private List<BomNodeDTO> children = new ArrayList<BomNodeDTO>();
	
	
	public Integer getComponentId() {
		return componentId;
	}
	public void setComponentId(Integer componentId) {
		this.componentId = componentId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public List<BomNodeDTO> getChildren() {
		return children;
	}
	public void setChildren(List<BomNodeDTO> children) {
		this.children = children;
	}
}

package com.project.Bom.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Component_Master")
public class Component {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "component_id")
	private Integer componentId;
	
	@Column(name = "component_name")
	private String componentName;
	
	@Column(name = "quantity")
	private int quantity;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;
	
	@ManyToOne
	@JoinColumn(name = "parent_component_id")
	private Component parent;
	
	@OneToMany
	private List<Component> children = new ArrayList<Component>();
	
	@Column(name = "level")
	private int level;
	
	@Override
	public String toString() {
		return "Component [componentId=" + componentId + ", componentName=" + componentName + ", quantity=" + quantity
				+ ", product=" + product + ", parent=" + parent + ", children=" + children + ", level=" + level + "]";
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
	public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	
	public Component getParent() {
		return parent;
	}
	public void setParent(Component parent) {
		this.parent = parent;
	}
	public List<Component> getChildren() {
		return children;
	}
	public void setChildren(List<Component> children) {
		this.children = children;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public Component(Integer componentId, String componentName, int quantity, Product product, Component parent,
			List<Component> children, int level) {
		super();
		this.componentId = componentId;
		this.componentName = componentName;
		this.quantity = quantity;
		this.product = product;
		this.parent = parent;
		this.children = children;
		this.level = level;
	}
	public Component() {
		// TODO Auto-generated constructor stub
	}

}

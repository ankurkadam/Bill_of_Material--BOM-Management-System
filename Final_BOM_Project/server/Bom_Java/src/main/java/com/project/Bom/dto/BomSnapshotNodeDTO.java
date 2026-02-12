package com.project.Bom.dto;

import java.util.ArrayList;
import java.util.List;

public class BomSnapshotNodeDTO {
	 private String name;
	 private int quantity;
	 private List<BomSnapshotNodeDTO> children = new ArrayList<BomSnapshotNodeDTO>();
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
	 public List<BomSnapshotNodeDTO> getChildren() {
		 return children;
	 }
	 public void setChildren(List<BomSnapshotNodeDTO> children) {
		 this.children = children;
	 }
	 
	 
}

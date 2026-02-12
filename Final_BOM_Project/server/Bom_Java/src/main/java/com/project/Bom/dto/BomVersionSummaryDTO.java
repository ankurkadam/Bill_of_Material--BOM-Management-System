package com.project.Bom.dto;

import java.time.LocalDateTime;

public class BomVersionSummaryDTO {
	 private Integer versionNumber;
	 private LocalDateTime createdAt;
	 private String createdBy;
	 private boolean latest;
	 public Integer getVersionNumber() {
		 return versionNumber;
	 }
	 public void setVersionNumber(Integer versionNumber) {
		 this.versionNumber = versionNumber;
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
	 public boolean isLatest() {
		 return latest;
	 }
	 public void setLatest(boolean latest) {
		 this.latest = latest;
	 }
	 
}

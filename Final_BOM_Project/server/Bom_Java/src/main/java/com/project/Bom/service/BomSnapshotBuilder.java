package com.project.Bom.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.project.Bom.dto.BomNodeDTO;

import tools.jackson.databind.ObjectMapper;

@Component
public class BomSnapshotBuilder {
	private final ObjectMapper objectMapper = new ObjectMapper();
	
	public String buildSnapshot(List<BomNodeDTO> bomTree) {
		try {
			return objectMapper.writeValueAsString(bomTree);
		}
		catch(Exception  e) {
			throw new RuntimeException("Failed to build BOM snapshot");
		}
	}
}

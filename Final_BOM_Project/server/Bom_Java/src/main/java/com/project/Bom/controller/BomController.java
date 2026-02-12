package com.project.Bom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.project.Bom.dto.BomResponseDTO;
import com.project.Bom.dto.BomVersionDetailDTO;
import com.project.Bom.dto.BomVersionSummaryDTO;
import com.project.Bom.service.BomRestoreService;
import com.project.Bom.service.BomService;
import com.project.Bom.service.BomVersionReadService;

@RestController
@RequestMapping("/api/bom")
public class BomController {
	
	@Autowired
	private BomService bomService;
	
	@Autowired
	private BomVersionReadService bomVersionReadService;
	
	@Autowired
	private BomRestoreService bomRestoreService;
	
	@GetMapping("/{productId}")
	public BomResponseDTO getBom(@PathVariable Integer productId)
	{
		return bomService.getBom(productId);
	}
	
	@GetMapping("/{productId}/versions")
	public List<BomVersionSummaryDTO> listVersions(@PathVariable Integer productId) {
	    return bomVersionReadService.listVersions(productId);
	}
	
	@GetMapping("/{productId}/versions/{version}")
	public BomVersionDetailDTO getVersion(@PathVariable Integer productId,
	                                      @PathVariable Integer version) {
	    return bomVersionReadService.getVersion(productId, version);
	}
	
	@PostMapping("/{productId}/restore/{versionNumber}")
	public void restoreBom(@PathVariable Integer productId,
	                       @PathVariable Integer versionNumber) {

	    bomRestoreService.restore(productId, versionNumber);
	}

}

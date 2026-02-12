package com.project.Bom.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.BomVersionDetailDTO;
import com.project.Bom.dto.BomVersionSummaryDTO;
import com.project.Bom.entity.BomVersion;
import com.project.Bom.entity.Product;
import com.project.Bom.exception.ProductNotFoundException;
import com.project.Bom.repository.BomVersionRepository;
import com.project.Bom.repository.ProductRepository;
import com.project.Bom.security.SecurityUtil;

import tools.jackson.databind.ObjectMapper;

@Service
public class BomVersionReadService {
	@Autowired
	private ProductRepository productRepo;
	
	@Autowired
	private BomVersionRepository versionRepo;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	 public List<BomVersionSummaryDTO> listVersions(Integer productId) {

	        Product product = productRepo.findById(productId)
	                .orElseThrow(() -> new ProductNotFoundException(productId));

	        SecurityUtil.ensureOwner(product); 

	        return versionRepo.findByProductOrderByVersionNumberDesc(product)
	                .stream()
	                .map(v -> {
	                    BomVersionSummaryDTO dto = new BomVersionSummaryDTO();
	                    dto.setVersionNumber(v.getVersionNumber());
	                    dto.setCreatedAt(v.getCreatedAt());
	                    dto.setCreatedBy(v.getCreatedBy().getUsername());
	                    dto.setLatest(v.isLatest());
	                    return dto;
	                })
	                .toList();
	    }
	 
	 public BomVersionDetailDTO getVersion(Integer productId, Integer version) {

	        Product product = productRepo.findById(productId)
	                .orElseThrow(() -> new ProductNotFoundException(productId));

	        SecurityUtil.ensureOwner(product);

	        BomVersion bomVersion = versionRepo
	                .findByProductAndVersionNumber(product, version)
	                .orElseThrow(() -> new RuntimeException("Version not found"));

	        Object bomTree;
	        try {
	            bomTree = objectMapper.readValue(bomVersion.getBomSnapshot(), Object.class);
	        } catch (Exception e) {
	            throw new RuntimeException("Failed to read BOM snapshot");
	        }

	        BomVersionDetailDTO dto = new BomVersionDetailDTO();
	        dto.setVersionNumber(bomVersion.getVersionNumber());
	        dto.setProductName(product.getProductName());
	        dto.setProductCode(product.getProductCode());
	        dto.setBom(bomTree);
	        dto.setCreatedAt(bomVersion.getCreatedAt());
	        dto.setCreatedBy(bomVersion.getCreatedBy().getUsername());

	        return dto;
	    }
}

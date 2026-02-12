package com.project.Bom.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.BomSnapshotNodeDTO;
import com.project.Bom.entity.BomVersion;
import com.project.Bom.entity.Component;
import com.project.Bom.entity.Product;
import com.project.Bom.exception.ProductNotFoundException;
import com.project.Bom.repository.BomVersionRepository;
import com.project.Bom.repository.ComponentRepository;
import com.project.Bom.repository.ProductRepository;
import com.project.Bom.security.SecurityUtil;

import jakarta.transaction.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class BomRestoreService {

	 	@Autowired
	    private ProductRepository productRepo;

	    @Autowired
	    private ComponentRepository componentRepo;

	    @Autowired
	    private BomVersionRepository bomVersionRepo;

	    @Autowired
	    private BomVersionService bomVersionService;

	    @Autowired
	    private ObjectMapper objectMapper;
	    
	    @Transactional
	    public void restore(Integer productId, Integer versionNumber) {
	    	
	    	Product product = productRepo.findById(productId)
	                .orElseThrow(() -> new ProductNotFoundException(productId));
	    	
	    	SecurityUtil.ensureOwner(product);
	    	
	    	BomVersion version = bomVersionRepo
	                .findByProductAndVersionNumber(product, versionNumber)
	                .orElseThrow(() -> new RuntimeException("BOM version not found"));
	    	
	    	List<BomSnapshotNodeDTO> snapshotTree = parseSnapshot(version);
	    	
	    	componentRepo.deleteByProduct(product);
	    	
	    	for (BomSnapshotNodeDTO node : snapshotTree) {
	            rebuildComponent(node, product, null, 1);
	        }
	    	
	    	bomVersionService.createNewVersion(
	                product,
	                SecurityUtil.getCurrentUser()
	        );
	    }
	    
	    private List<BomSnapshotNodeDTO> parseSnapshot(BomVersion version) {

	        try {
	            return objectMapper.readValue(
	                version.getBomSnapshot(),
	                new TypeReference<List<BomSnapshotNodeDTO>>() {}
	            );
	        } catch (Exception e) {
	            throw new RuntimeException("Invalid BOM snapshot");
	        }
	    }
	    
	    private void rebuildComponent(
	            BomSnapshotNodeDTO node,
	            Product product,
	            Component parent,
	            int level
	    ) {
	        Component component = new Component();
	        component.setComponentName(node.getName());
	        component.setQuantity(node.getQuantity());
	        component.setProduct(product);
	        component.setParent(parent);
	        component.setLevel(level);

	        componentRepo.save(component);

	        for (BomSnapshotNodeDTO child : node.getChildren()) {
	            rebuildComponent(child, product, component, level + 1);
	        }
	    }

	    
	    

}

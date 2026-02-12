package com.project.Bom.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

//import com.project.Bom.dto.BomDTO;
import com.project.Bom.dto.BomNodeDTO;
import com.project.Bom.dto.BomResponseDTO;
//import com.project.Bom.dto.ComponentDTO;
//import com.project.Bom.dto.ProductDTO;
import com.project.Bom.dto.ProductSummaryDTO;
import com.project.Bom.entity.Component;
import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;
import com.project.Bom.exception.ProductNotFoundException;
import com.project.Bom.repository.ComponentRepository;
import com.project.Bom.repository.ProductRepository;
import com.project.Bom.security.SecurityUtil;

@Service
public class BomService {

	@Autowired
	private ProductRepository productRepo;
	
	@Autowired
	private ComponentRepository componentRepo;
	
	public BomResponseDTO getBom(Integer productId) {
		Product product = productRepo.findById(productId)
				.orElseThrow(()-> new ProductNotFoundException(productId));
		
		User user = SecurityUtil.getCurrentUser();

		if (!product.getOwner().getId().equals(user.getId())) {
		    throw new AccessDeniedException("You are not allowed to access this BOM");
		}
		
		ProductSummaryDTO productdto = new ProductSummaryDTO();
		productdto.setId(product.getId());
		productdto.setName(product.getProductName());
		productdto.setCode(product.getProductCode());
		
		List<Component> components = componentRepo.findByProductId(productId);
		
		Map<Integer, BomNodeDTO> nodeMap = new HashMap<Integer, BomNodeDTO>();
		
		for(Component c : components) {
			BomNodeDTO node = new BomNodeDTO();
			node.setComponentId(c.getComponentId());
			node.setName(c.getComponentName());
			node.setQuantity(c.getQuantity());
			nodeMap.put(c.getComponentId(), node);
		}
		
		List<BomNodeDTO> rootComponents = new ArrayList<BomNodeDTO>();
		
		for(Component c : components)
		{
			BomNodeDTO currentNode = nodeMap.get(c.getComponentId());
			
			if (c.getParent() != null) {
				BomNodeDTO parentNode = nodeMap.get(c.getParent().getComponentId());
				parentNode.getChildren().add(currentNode);
			}
			else {
				rootComponents.add(currentNode);
			}
		}
		
//		BomDTO response = new BomDTO();
//		response.setProductName(product.getProductName());
//		response.setProductCode(product.getProductCode());
		
//		List<ComponentDTO> componentDtos = components.stream()
//				.map(c->{
//					ComponentDTO dto = new ComponentDTO();
//					dto.setComponentId(c.getComponentId());
//					dto.setComponentName(c.getComponentName());
//					dto.setQuantity(c.getQuantity());
//					
//					if(c.getParent()!= null) {
//						dto.setParentComponentId(c.getParent().getComponentId());
//					}
//					
//					return dto;
//				}).toList();
//		response.setProductId(product.getId());
//		response.setComponents(componentDtos);
//		response.setComponentTree(rootComponents);
		
		
		
	
		
		BomResponseDTO response = new BomResponseDTO();
		response.setProduct(productdto);
		response.setVersion(null);
		response.setComponents(rootComponents);
		return response;
				
	}
}

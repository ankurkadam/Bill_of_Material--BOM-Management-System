package com.project.Bom.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.ComponentDTO;
import com.project.Bom.entity.Component;
import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;
import com.project.Bom.exception.ComponentNotFoundException;
import com.project.Bom.exception.InvalidComponentException;
import com.project.Bom.exception.InvalidHierarchyException;
import com.project.Bom.exception.ProductNotFoundException;
import com.project.Bom.repository.ComponentRepository;
import com.project.Bom.repository.ProductRepository;
import com.project.Bom.security.SecurityUtil;

@Service
public class ComponentService {

	@Autowired
	private ComponentRepository componentRepo;
	
	@Autowired
	private ProductRepository productRepo;
	
	@Autowired
	private BomVersionService bomVersionService;
	
	
	
	private static final int MAX_DEPTH = 5;
	
	public ComponentDTO createComponent(ComponentDTO componentdto,Integer productId)
	{
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ProductNotFoundException(productId));
		
		User currentUser = SecurityUtil.getCurrentUser();
		
		 if (!product.getOwner().getId().equals(currentUser.getId())) {
		        throw new AccessDeniedException("You are not allowed to access this product");
		    }
		
		 if (componentdto.getQuantity() <= 0) {
	            throw new InvalidComponentException("Quantity must be greater than 0");
	        }
		
		Component component = new Component();
		component.setComponentName(componentdto.getComponentName());
		component.setQuantity(componentdto.getQuantity());
		component.setProduct(product);
		
		Component parent = null;
		
		if(componentdto.getParentComponentId() != null)
		{
			parent = componentRepo.findById(componentdto.getParentComponentId())
					.orElseThrow(()-> new InvalidHierarchyException("Parent component not found!"));
			
			
			
			if(!parent.getProduct().getId().equals(productId)) {
				throw new InvalidHierarchyException("Parent component belongs to a diffrent product");
			}
			
			if(componentdto.getComponentId() !=null && isCircular(parent, componentdto.getComponentId())) {
				throw new InvalidHierarchyException("Circular component hierarchy detected");
			}
		}
		
		component.setParent(parent);
		
		int newLevel;
		if (parent == null) {
			newLevel=1;
		}
		else
		{
			newLevel = parent.getLevel() + 1;
		}
		
		if (newLevel > MAX_DEPTH) {
		    throw new InvalidHierarchyException(
		        "Maximum BOM depth of " + MAX_DEPTH + " exceeded");
		}
		
		component.setLevel(newLevel);
		
		componentRepo.save(component);
		
		bomVersionService.createNewVersion(product, SecurityUtil.getCurrentUser());
		componentdto.setComponentId(component.getComponentId());
		return componentdto;
		
	}
	
	private boolean isCircular(Component parent,Integer childId)
	{
		Component current = parent;
		
		while (current != null) {

			if(current.getComponentId().equals(childId))
			{
				return true;
			}
			current = current.getParent();
		}
		return false;
	}
	
	public List<Component> getAllComponent()
	{
		return componentRepo.findAll();
	}
	
	public Component getById(Integer id)
	{
		return componentRepo.findById(id)
				.orElseThrow(() -> new ComponentNotFoundException(id));
	}
	
	public void deleteById(Integer id)
	{
		Component component = componentRepo.findById(id)
	            .orElseThrow(() ->
	                new InvalidComponentException("Component not found"));

	    if (!component.getChildren().isEmpty()) {
	        throw new InvalidHierarchyException(
	            "Cannot delete component with sub-components");
	    }

	    componentRepo.delete(component);
	    bomVersionService.createNewVersion(component.getProduct(), SecurityUtil.getCurrentUser());
	}
	
	public ComponentDTO updateComponent(Integer id,ComponentDTO componentdto)
	{
		Component component = componentRepo.findById(id)
				.orElseThrow(()-> new InvalidComponentException("Component not found!"));
		
		 if (componentdto.getQuantity() <= 0) {
	            throw new InvalidComponentException("Quantity must be greater than 0");
	        }
		
		component.setComponentName(componentdto.getComponentName());
		component.setQuantity(componentdto.getQuantity());
		
		Component parent = null;
		
		if(componentdto.getParentComponentId() != null) {
			
			parent = componentRepo.findById(componentdto.getParentComponentId())
					.orElseThrow(() -> new InvalidHierarchyException("Parent component not found") );
			
			if(!parent.getProduct().getId()
					.equals(component.getProduct().getId())) {
				
				throw new InvalidHierarchyException("Parent component belongs to a diffrent product");
			}
			
			if (isCircular(parent, id)) {
	            throw new InvalidHierarchyException(
	                "Circular component hierarchy detected");
	        }
			
		}
		
		component.setParent(parent);
		
		int newLevel;
		if (parent == null) {
			newLevel=1;
		}
		else
		{
			newLevel = parent.getLevel() + 1;
		}
		
		if (newLevel > MAX_DEPTH) {
		    throw new InvalidHierarchyException(
		        "Maximum BOM depth of " + MAX_DEPTH + " exceeded");
		}
		
		component.setLevel(newLevel);
		
		componentRepo.save(component);
		
		
		bomVersionService.createNewVersion(component.getProduct(), SecurityUtil.getCurrentUser());
		componentdto.setComponentId(component.getComponentId());
		return componentdto;
	}
}

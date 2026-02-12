package com.project.Bom.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.ProductDTO;
import com.project.Bom.entity.PlanType;
import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;
import com.project.Bom.exception.DuplicateProductException;
import com.project.Bom.exception.InvalidProductException;
import com.project.Bom.exception.PlanLimitException;
import com.project.Bom.exception.ProductNotFoundException;
import com.project.Bom.repository.BomVersionRepository;
import com.project.Bom.repository.ComponentRepository;
import com.project.Bom.repository.ProductRepository;
import com.project.Bom.security.SecurityUtil;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepo;
	
	@Autowired
	private BomVersionRepository bomVersionRepo;
	
	@Autowired
	private ComponentRepository componentRepo;
	
	private static final int FREE_PRODUCT_LIMIT = 5;

	
	public ProductDTO create(ProductDTO productdto) {
		
		  if (productdto.getProductName() == null || productdto.getProductName().isBlank()) {
	            throw new InvalidProductException("Product name is required");
	        }

	        if (productdto.getProductCode() == null || productdto.getProductCode().isBlank()) {
	            throw new InvalidProductException("Product code is required");
	        }
	        
	        if (productRepo.existsByProductCode(productdto.getProductCode())) {
	            throw new DuplicateProductException(
	                "Product code already exists"
	            );
	        }

		
		Product product = new Product();
		product.setProductName(productdto.getProductName());
		product.setProductCode(productdto.getProductCode());
		
		User currentUser = SecurityUtil.getCurrentUser();
		product.setOwner(currentUser);
		if (currentUser.getPlan() == PlanType.FREE) {

		    long count = productRepo.countByOwner(currentUser);

		    if (count >= FREE_PRODUCT_LIMIT) {
		        throw new PlanLimitException(
		            "FREE plan allows only 5 products. Upgrade to PREMIUM."
		        );
		    }
		}
		productRepo.save(product);
		productdto.setId(product.getId());
		return productdto;
	}
	
	public List<Product> getAll()
	{
		
		User user = SecurityUtil.getCurrentUser();
	    return productRepo.findByOwner(user);
	}
	
	public ProductDTO getById(Integer id)
	{
		Product product = productRepo.findById(id).orElseThrow(() -> new ProductNotFoundException(id) ); 
		
		User currentUser = SecurityUtil.getCurrentUser();
		
		 if (!product.getOwner().getId().equals(currentUser.getId())) {
		        throw new AccessDeniedException("You are not allowed to access this product");
		    }
		
		ProductDTO productdto = new ProductDTO();
		productdto.setId(product.getId());
		productdto.setProductCode(product.getProductCode());
		productdto.setProductName(product.getProductName());
		
		return productdto;
	}
	@Transactional
	public void delProduct(Integer id)
	{
		Product product = productRepo.findById(id).orElseThrow(()-> new ProductNotFoundException(id));
		SecurityUtil.ensureOwner(product);
		bomVersionRepo.deleteByProduct(product);
		componentRepo.deleteByProduct(product);
		productRepo.delete(product);
	}
	
	public ProductDTO updateProduct(Integer id,ProductDTO productdto)
	{
		Product product = productRepo.findById(id)
				.orElseThrow(() -> 
				new InvalidProductException("Product not found"));
		
		User currentUser = SecurityUtil.getCurrentUser();
		
		 if (!product.getOwner().getId().equals(currentUser.getId())) {
		        throw new AccessDeniedException("You are not allowed to access this product");
		    }
		 Product existing = productRepo
			        .findByProductCode(productdto.getProductCode())
			        .orElse(null);

			if (existing != null && !existing.getId().equals(id)) {
			    throw new RuntimeException(
			        "Product code already exists"
			    );
			}

		product.setProductCode(productdto.getProductCode());
		product.setProductName(productdto.getProductName());
		productRepo.save(product);
		
		productdto.setId(product.getId());
		
		return productdto;
		
	}
	
}

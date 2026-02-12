package com.project.Bom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;

public interface ProductRepository extends JpaRepository<Product, Integer> {
	List<Product> findByOwner(User owner);
	
	Optional<Product> findByProductCode(String productCode); 
	
	boolean existsByProductCode(String productCode);
	
	long countByOwner(User owner);

}

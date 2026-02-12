package com.project.Bom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Bom.entity.Component;
import com.project.Bom.entity.Product;

public interface ComponentRepository extends JpaRepository<Component, Integer>{
	 List<Component> findByProductId(Integer productId);
	 
	 void deleteByProduct(Product product);
}

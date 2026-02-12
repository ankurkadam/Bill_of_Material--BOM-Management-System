package com.project.Bom.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Bom.dto.ProductDTO;
import com.project.Bom.entity.Product;
import com.project.Bom.service.ProductService;

@RestController
@RequestMapping("api/products")
public class ProductController {
	
	@Autowired
	private ProductService productServ;
	
	@PostMapping
	public ProductDTO create(@RequestBody ProductDTO productdto)
	{
		return productServ.create(productdto);
	}
	@GetMapping
	public List<Product> getAll()
	{
		return productServ.getAll();
	}
	@GetMapping("/{id}")
	public ProductDTO getById(@PathVariable Integer id)
	{
		return productServ.getById(id);
	}
	
	@DeleteMapping("/{id}")
	public void delProduct(@PathVariable Integer id)
	{
		productServ.delProduct(id);
	}
	
	@PutMapping("/{id}")
	public ProductDTO updateProduct(@PathVariable Integer id,@RequestBody ProductDTO productdto)
	{
		return productServ.updateProduct(id, productdto);
	}
}

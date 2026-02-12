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

import com.project.Bom.dto.ComponentDTO;
import com.project.Bom.entity.Component;
import com.project.Bom.exception.InvalidComponentException;
import com.project.Bom.service.ComponentService;

@RestController
@RequestMapping("/api/component")
public class ComponentController {
	

	@Autowired
	private ComponentService compService;
	
	@PostMapping("/{id}")
	public ComponentDTO createComp(@PathVariable Integer id,@RequestBody ComponentDTO componentdto)
	{
		return compService.createComponent(componentdto, id);
	}
	@PostMapping
	public ComponentDTO createCompEx(@RequestBody ComponentDTO componentdto)
	{
		throw new InvalidComponentException("Component must be associate with productId!");
	}
	
	@GetMapping
	public List<Component> getAllComponent()
	{
		return compService.getAllComponent();
	}
	
	@GetMapping("/{id}")
	public Component getById(@PathVariable Integer id)
	{
		return compService.getById(id);
	}
	
	@DeleteMapping("/{id}")
	public void deleteById(@PathVariable Integer id)
	{
		compService.deleteById(id);
	}
	
	@PutMapping("/{id}")
	public ComponentDTO updateComponent(@PathVariable Integer id,@RequestBody ComponentDTO componentdto)
	{
		return compService.updateComponent(id, componentdto);
	}
}

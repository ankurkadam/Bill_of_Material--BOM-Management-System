package com.project.Bom.exception;

public class ComponentNotFoundException  extends RuntimeException {

   

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ComponentNotFoundException(Integer id) {
        super("Component not found with id: " + id);
    }
}
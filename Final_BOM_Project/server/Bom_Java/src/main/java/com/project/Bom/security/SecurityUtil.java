package com.project.Bom.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;

import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;

public class SecurityUtil {
	public static User getCurrentUser(){
		return (User) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();
	}
	
	 public static void ensureOwner(Product product) {

	        User currentUser = getCurrentUser();

	        if (!product.getOwner().getId().equals(currentUser.getId())) {
	            throw new AccessDeniedException(
	                "You are not allowed to access this product"
	            );
	        }
	    }
}

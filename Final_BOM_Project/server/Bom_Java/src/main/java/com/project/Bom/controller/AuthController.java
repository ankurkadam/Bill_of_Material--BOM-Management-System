package com.project.Bom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Bom.dto.AuthResponseDTO;
import com.project.Bom.dto.LoginRequestDTO;
import com.project.Bom.dto.RegisterRequestDTO;
import com.project.Bom.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	 @Autowired
	    private AuthService authService;
	
	 @PostMapping("/login")
	    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {
		 String token = authService.login(dto);
	        return new AuthResponseDTO(token);
	    }

	    @PostMapping("/register")
	    public void register(@RequestBody RegisterRequestDTO dto) {
	    	authService.register(dto);
	    }
}

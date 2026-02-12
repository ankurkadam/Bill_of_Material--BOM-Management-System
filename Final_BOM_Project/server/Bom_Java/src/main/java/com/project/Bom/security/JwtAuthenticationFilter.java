package com.project.Bom.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.Bom.entity.User;
import com.project.Bom.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	 @Autowired
	 private JwtUtil jwtutil;
	 
	 @Autowired
	 private UserRepository userRepo;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");
		
		if(authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String username = jwtutil.extractUsername(token);
			
			if(username != null &&
					SecurityContextHolder.getContext().getAuthentication() == null) {
				User user = userRepo.findByUsername(username).orElse(null);
				
				if(user != null && jwtutil.validateToken(token, user)) {
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
							user, null,List.of()
							);
					
					SecurityContextHolder.getContext()
					.setAuthentication(auth);
				}
				
			}
		}
		
		filterChain.doFilter(request, response);
	}

}

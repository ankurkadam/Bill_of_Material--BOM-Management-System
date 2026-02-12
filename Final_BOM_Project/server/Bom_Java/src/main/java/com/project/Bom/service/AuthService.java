package com.project.Bom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.LoginRequestDTO;
import com.project.Bom.dto.RegisterRequestDTO;
import com.project.Bom.entity.PlanType;
import com.project.Bom.entity.User;
import com.project.Bom.exception.DuplicateResourceException;
import com.project.Bom.repository.UserRepository;
import com.project.Bom.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    public void register(RegisterRequestDTO dto) {

        if (userRepo.findByUsername(dto.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already registered");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        user.setPlan(PlanType.FREE);


        userRepo.save(user);
    }

   
    public String login(LoginRequestDTO dto) {

        User user = userRepo.findByUsername(dto.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return jwtUtil.generateToken(user);
    }
}

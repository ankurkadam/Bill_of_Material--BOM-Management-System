package com.project.Bom.controller;

//import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Bom.dto.UserDTO;
//import com.project.Bom.entity.PlanType;
//import com.project.Bom.entity.User;
//import com.project.Bom.repository.UserRepository;
//import com.project.Bom.security.SecurityUtil;
import com.project.Bom.service.UserServices;

@RestController
@RequestMapping("api/user")
public class UserController {
	
//	@Autowired
//	private UserRepository userRepo;
	
//	@PutMapping("/upgrade")
//	public String upgradeToPremium() {
//
//	    User user = SecurityUtil.getCurrentUser();
//
//	    user.setPlan(PlanType.PREMIUM);
//	    user.setUpgradedAt(LocalDateTime.now());
//
//	    userRepo.save(user);
//
//	    return "Upgraded to PREMIUM";
//	}
	
	@Autowired
	private UserServices userServ;
	
	@GetMapping
	public UserDTO getUserInfo() {
		return userServ.getUser();
	}
	@PutMapping
	public UserDTO UpdateUserInfo(@RequestBody UserDTO user) {
		return userServ.updateUser(user);
	}
}

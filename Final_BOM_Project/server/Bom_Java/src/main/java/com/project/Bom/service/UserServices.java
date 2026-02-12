package com.project.Bom.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.UserDTO;
import com.project.Bom.entity.User;
import com.project.Bom.repository.UserRepository;
import com.project.Bom.security.SecurityUtil;

@Service
public class UserServices {

	@Autowired
	private UserRepository userRepo;
	
	public UserDTO getUser()
	{
		User currentUser = SecurityUtil.getCurrentUser();
		UserDTO userdto = new UserDTO();
		userdto.setName(currentUser.getName());
		userdto.setEmail(currentUser.getEmail());
		userdto.setPlan(currentUser.getPlan());
		userdto.setUsername(currentUser.getUsername());
		
		return userdto;
	}
	public UserDTO updateUser(UserDTO userdto)
	{
		Integer data =SecurityUtil.getCurrentUser().getId();
		User user=userRepo.findById(data).orElseThrow(()-> new RuntimeException("User Not FOUND"));
		user.setName(userdto.getName());
		user.setEmail(userdto.getEmail());
		
		userRepo.save(user);
		return userdto;
	}
}

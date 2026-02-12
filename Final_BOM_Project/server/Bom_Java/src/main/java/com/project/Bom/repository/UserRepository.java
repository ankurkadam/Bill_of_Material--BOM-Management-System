package com.project.Bom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Bom.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByUsername(String username);
}

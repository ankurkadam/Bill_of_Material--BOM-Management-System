package com.project.Bom.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.Bom.dto.BomResponseDTO;
import com.project.Bom.entity.BomVersion;
import com.project.Bom.entity.Product;
import com.project.Bom.entity.User;
import com.project.Bom.repository.BomVersionRepository;

@Service
public class BomVersionService {

	@Autowired
	private BomVersionRepository bomVersionRepo;
	
	@Autowired
	private BomService bomService;
	
	@Autowired
	private BomSnapshotBuilder snapshotBuilder;
	
	public void createNewVersion(Product product,User user) {
		int nextVersion = bomVersionRepo
				.findByProductOrderByVersionNumberDesc(product)
				.stream()
				.findFirst()
				.map(v-> v.getVersionNumber()+1)
				.orElse(1);
		
		BomResponseDTO bomDto = bomService.getBom(product.getId());
		
		String snapshot = snapshotBuilder.buildSnapshot(bomDto.getComponents());
		
		bomVersionRepo.findByProductAndLatestTrue(product)
		.ifPresent(v -> {
				v.setLatest(false);
				bomVersionRepo.save(v);
		});
		
		BomVersion version = new BomVersion();
		version.setProduct(product);
		version.setVersionNumber(nextVersion);
		version.setBomSnapshot(snapshot);
		version.setCreatedAt(LocalDateTime.now());
		version.setCreatedBy(user);
		version.setLatest(true);
		
		bomVersionRepo.save(version);
	}
}

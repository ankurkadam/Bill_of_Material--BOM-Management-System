package com.project.Bom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Bom.entity.BomVersion;
import com.project.Bom.entity.Product;

public interface BomVersionRepository extends JpaRepository<BomVersion, Integer> {

    List<BomVersion> findByProductOrderByVersionNumberDesc(Product product);

    Optional<BomVersion> findByProductAndVersionNumber(Product product, Integer versionNumber);

    Optional<BomVersion> findByProductAndLatestTrue(Product product);
    
    void deleteByProduct(Product product);

}

package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Products;

import java.util.List;
@Repository
public interface ProductsRepository extends JpaRepository<Products, Long> {
    public List<Products> findByBusiness_IdBusiness(Long idBusiness);
}

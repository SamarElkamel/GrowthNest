package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.ProductsRepository;

import java.util.List;
@Service
public class BusinessServiceImpl implements IBusinessService{
    @Autowired
    private BusinessRepository businessRepository;
    private ProductsRepository productsRepository;
    @Override
    public List<Business> getAllBusiness() {
        return businessRepository.findAll();
    }

    @Override
    public Business getBusinessById(Long id) {
        return businessRepository.findById(id).get();
    }

    @Override
    public Business addBusiness(Business business) {
        return businessRepository.save(business);
    }

    @Override
    public Business updateBusiness(Business business) {
        return businessRepository.save(business);
    }

    @Override
    public void deleteBusiness(Long id) {
        businessRepository.deleteById(id);
    }


}

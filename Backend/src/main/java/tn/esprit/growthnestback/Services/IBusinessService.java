package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Business;

import java.util.List;

public interface IBusinessService {
    public List<Business> getAllBusiness();
    public Business getBusinessById(Long id);
    public Business addBusiness(Business business);
    public Business updateBusiness(Business business);
    public void deleteBusiness(Long id);

}

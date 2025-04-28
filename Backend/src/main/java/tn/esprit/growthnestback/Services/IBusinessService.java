package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.BusinessStatisticsDTO;

import java.util.List;

public interface IBusinessService {
    public List<Business> getAllBusiness();
    public Business getBusinessById(Long id);
    public Business addBusiness(Business business);
    public Business updateBusiness(Business business);
    public void deleteBusiness(Long id);
    public void addRating(Long businessId, Integer ratingValue);
    public Integer getUserRating(Long businessId);
    public byte[] generateQRCodeForBusiness(Long businessId, int width, int height) throws Exception ;
    public List<Business> getTopThreeBusinessesByRating();
    public BusinessStatisticsDTO getBusinessStatistics();
    public List<Business> getBusinessesByUser(Long userId);
}

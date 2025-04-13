package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.UserRating;

import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.ProductsRepository;
import tn.esprit.growthnestback.Repository.UserRatingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BusinessServiceImpl implements IBusinessService{
    @Autowired
    private BusinessRepository businessRepository;
    @Autowired
    private UserRatingRepository userRatingRepository;
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
    public Business updateBusiness(Business updatedBusiness) {
        // Charge l’entité existante avec ses relations
        Business existingBusiness = businessRepository.findById(updatedBusiness.getIdBusiness())
                .orElseThrow(() -> new RuntimeException("Business non trouvé avec l’ID : " + updatedBusiness.getIdBusiness()));

        // Log pour vérifier les produits avant mise à jour
        System.out.println("Produits existants avant mise à jour : " + existingBusiness.getProducts().size());

        // Met à jour uniquement les champs fournis
        existingBusiness.setName(updatedBusiness.getName());
        existingBusiness.setDescription(updatedBusiness.getDescription());
        existingBusiness.setCategorieBusiness(updatedBusiness.getCategorieBusiness());
        existingBusiness.setLogo(updatedBusiness.getLogo());

        // Sauvegarde sans modifier Products
        Business savedBusiness = businessRepository.save(existingBusiness);

        // Log pour vérifier après sauvegarde
        System.out.println("Produits après mise à jour : " + savedBusiness.getProducts().size());

        return savedBusiness;
    }

    @Override
    public void deleteBusiness(Long id) {
        businessRepository.deleteById(id);
    }
    @Override
    public void addRating(Long businessId, Integer ratingValue) {
        // Validate rating
        if (ratingValue < 1 || ratingValue > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Static user ID
        Long userId = 2L;

        // Find business
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // Check for existing rating
        Optional<UserRating> existingRating = userRatingRepository.findByUserIdAndBusinessId(userId, businessId);
        int currentCount = business.getRatingCount() != null ? business.getRatingCount() : 0;
        double currentAverage = business.getAverageRating() != null ? business.getAverageRating() : 0.0;

        if (existingRating.isPresent()) {
            // Update existing rating
            UserRating userRating = existingRating.get();
            int oldRating = userRating.getRatingValue();
            userRating.setRatingValue(ratingValue);
            userRatingRepository.save(userRating);

            // Recalculate average: remove old rating, add new one
            if (currentCount > 0) {
                double totalRating = currentAverage * currentCount;
                totalRating = totalRating - oldRating + ratingValue;
                business.setAverageRating(totalRating / currentCount);
            }
        } else {
            // New rating
            UserRating userRating = new UserRating();
            userRating.setUserId(userId);
            userRating.setBusinessId(businessId);
            userRating.setRatingValue(ratingValue);
            userRatingRepository.save(userRating);

            // Update average and count
            double newAverage = ((currentAverage * currentCount) + ratingValue) / (currentCount + 1);
            business.setAverageRating(newAverage);
            business.setRatingCount(currentCount + 1);
        }

        businessRepository.save(business);
    }
@Override
    public Integer getUserRating(Long businessId) {
        Long userId = 2L;
        Optional<UserRating> rating = userRatingRepository.findByUserIdAndBusinessId(userId, businessId);
        return rating.map(UserRating::getRatingValue).orElse(null);
    }



}

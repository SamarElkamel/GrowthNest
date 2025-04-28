package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.BusinessStatisticsDTO;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Entities.UserRating;
import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.ProductsRepository;
import tn.esprit.growthnestback.Repository.UserRatingRepository;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BusinessServiceImpl implements IBusinessService {
    @Autowired
    private BusinessRepository businessRepository;
    @Autowired
    private UserRatingRepository userRatingRepository;
    @Autowired
    private ProductsRepository productsRepository;
    @Autowired
    private QRCodeService qrCodeService;
    @Autowired
    private UserService userService;

    public Business findById(Long id) {
        System.out.println("Fetching business with ID: " + id);
        return businessRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("Business not found for ID: " + id);
                    return new IllegalArgumentException("Business non trouvé avec l'ID : " + id);
                });
    }

    @Override
    public byte[] generateQRCodeForBusiness(Long businessId, int width, int height) throws Exception {
        System.out.println("Generating QR code for business ID: " + businessId);
        Business business = findById(businessId);
        if (business.getInstagramPageName() == null || business.getInstagramPageName().trim().isEmpty()) {
            System.out.println("No Instagram page for business ID: " + businessId);
            throw new IllegalArgumentException("La page Instagram n'est pas définie pour cette entreprise.");
        }
        String instagramUrl = "https://www.instagram.com/" + business.getInstagramPageName() + "/";
        byte[] qrCode = qrCodeService.generateQRCode(instagramUrl, width, height);
        System.out.println("QR code generated for business ID: " + businessId);
        return qrCode;
    }

    @Override
    public BusinessStatisticsDTO getBusinessStatistics() {
            BusinessStatisticsDTO stats = new BusinessStatisticsDTO();
            stats.setTotalBusinesses(businessRepository.countTotalBusinesses());
            stats.setPendingCount(businessRepository.countPendingBusinesses());
            stats.setApprovedCount(businessRepository.countApprovedBusinesses());
            stats.setRejectedCount(businessRepository.countRejectedBusinesses());
            stats.setAverageRating(businessRepository.getAverageRating() != null ? businessRepository.getAverageRating() : 0.0);
            stats.setHighRatingCount(businessRepository.countHighRatingBusinesses());
            return stats;

    }

    @Override
    public List<Business> getBusinessesByUser(Long userId) {
        System.out.println("Fetching businesses for user ID: " + userId);
        List<Business> businesses = businessRepository.findByUserId(userId);
        System.out.println("Found " + businesses.size() + " businesses for user ID: " + userId);
        return businesses;
    }

    @Override
    public List<Business> getTopThreeBusinessesByRating() {
        return businessRepository.findTopThreeByAverageRating()
                .stream()
                .limit(3)
                .collect(Collectors.toList());
    }

    @Override
    public List<Business> getAllBusiness() {
        System.out.println("Fetching all businesses");
        return businessRepository.findAll();
    }

    @Override
    public Business getBusinessById(Long id) {
        return findById(id);
    }

    @Override
    public Business addBusiness(Business business) {
        System.out.println("Adding business: Name=" + business.getName() +
                ", Description=" + business.getDescription() +
                ", Category=" + business.getCategorieBusiness() +
                ", Logo=" + business.getLogo() +
                ", PDF=" + business.getBusinessPdf() +
                ", Instagram=" + business.getInstagramPageName() +
                ", Status=" + business.getStatus());

        // Set the current user as the business owner
        Long currentUserId = UserService.currentUserId();
        User currentUser = userService.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found with ID: " + currentUserId));
        business.setUser(currentUser);

        Business saved = businessRepository.save(business);
        System.out.println("Business added: ID=" + saved.getIdBusiness() +
                ", Name=" + saved.getName() +
                ", Status=" + saved.getStatus());
        return saved;
    }

    @Override
    public Business updateBusiness(Business updatedBusiness) {
        System.out.println("Updating business ID: " + updatedBusiness.getIdBusiness());
        Business existingBusiness = findById(updatedBusiness.getIdBusiness());

        // Ensure the user cannot change the owner
        if (updatedBusiness.getUser() != null && !existingBusiness.getUser().getId().equals(updatedBusiness.getUser().getId())) {
            throw new IllegalArgumentException("Cannot change the business owner");
        }

        existingBusiness.setName(updatedBusiness.getName());
        existingBusiness.setDescription(updatedBusiness.getDescription());
        existingBusiness.setCategorieBusiness(updatedBusiness.getCategorieBusiness());
        existingBusiness.setLogo(updatedBusiness.getLogo());
        existingBusiness.setInstagramPageName(updatedBusiness.getInstagramPageName());
        existingBusiness.setBusinessPdf(updatedBusiness.getBusinessPdf());
        existingBusiness.setStatus(updatedBusiness.getStatus());

        Business savedBusiness = businessRepository.save(existingBusiness);
        System.out.println("Business updated: ID=" + savedBusiness.getIdBusiness() +
                ", Name=" + savedBusiness.getName() +
                ", Status=" + savedBusiness.getStatus());
        return savedBusiness;
    }

    @Override
    public void deleteBusiness(Long id) {
        System.out.println("Deleting business ID: " + id);
        businessRepository.deleteById(id);
        System.out.println("Business deleted: ID " + id);
    }

    @Override
    public void addRating(Long businessId, Integer ratingValue) {
        if (ratingValue < 1 || ratingValue > 5) {
            System.out.println("Invalid rating value: " + ratingValue);
            throw new IllegalArgumentException("La note doit être entre 1 et 5.");
        }

        Long userId = UserService.currentUserId();
        System.out.println("Adding rating: userId=" + userId + ", businessId=" + businessId + ", ratingValue=" + ratingValue);
        Business business = findById(businessId);
        Optional<UserRating> existingRating = userRatingRepository.findByUserIdAndBusinessId(userId, businessId);
        int currentCount = business.getRatingCount() != null ? business.getRatingCount() : 0;
        double currentAverage = business.getAverageRating() != null ? business.getAverageRating() : 0.0;
        System.out.println("Before update: count=" + currentCount + ", average=" + currentAverage);

        try {
            if (existingRating.isPresent()) {
                UserRating userRating = existingRating.get();
                int oldRating = userRating.getRatingValue();
                userRating.setRatingValue(ratingValue);
                userRatingRepository.save(userRating);
                System.out.println("Updated rating: old=" + oldRating + ", new=" + ratingValue);
                if (currentCount > 0) {
                    double totalRating = currentAverage * currentCount;
                    totalRating = totalRating - oldRating + ratingValue;
                    double newAverage = totalRating / currentCount;
                    business.setAverageRating(newAverage);
                    System.out.println("Updated: totalRating=" + totalRating + ", newAverage=" + newAverage);
                } else {
                    business.setAverageRating((double) ratingValue);
                    business.setRatingCount(1);
                    System.out.println("Set initial: average=" + ratingValue + ", count=1");
                }
            } else {
                UserRating userRating = new UserRating();
                userRating.setUserId(userId);
                userRating.setBusinessId(businessId);
                userRating.setRatingValue(ratingValue);
                userRatingRepository.save(userRating);
                System.out.println("Created rating for userId: " + userId);
                double totalRating = currentAverage * currentCount + ratingValue;
                int newCount = currentCount + 1;
                double newAverage = totalRating / newCount;
                business.setAverageRating(newAverage);
                business.setRatingCount(newCount);
                System.out.println("New: totalRating=" + totalRating + ", count=" + newCount + ", average=" + newAverage);
            }
            Business savedBusiness = businessRepository.save(business);
            System.out.println("Saved business: ID=" + savedBusiness.getIdBusiness() +
                    ", averageRating=" + savedBusiness.getAverageRating() +
                    ", ratingCount=" + savedBusiness.getRatingCount());
        } catch (Exception e) {
            System.out.println("Error saving rating: " + e.getMessage());
            throw new RuntimeException("Erreur lors de l'enregistrement de la note: " + e.getMessage());
        }
    }

    @Override
    public Integer getUserRating(Long businessId) {
        Long userId = UserService.currentUserId();
        System.out.println("Fetching rating: userId=" + userId + ", businessId=" + businessId);
        Optional<UserRating> rating = userRatingRepository.findByUserIdAndBusinessId(userId, businessId);
        Integer ratingValue = rating.map(UserRating::getRatingValue).orElse(null);
        System.out.println("Rating found: " + ratingValue);
        return ratingValue;
    }

    private boolean isValidBase64(String base64) {
        try {
            String base64Data = base64.startsWith("data:image") ? base64.split(",")[1] : base64;
            Base64.getDecoder().decode(base64Data);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
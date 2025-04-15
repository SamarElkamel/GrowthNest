package tn.esprit.growthnestback.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Rating;
import tn.esprit.growthnestback.Repository.RatingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor

public class RatingServiceImpl {

        private final RatingRepository ratingRepo;

        public List<Rating> getAllRatings() {
            return ratingRepo.findAll();
        }

        public Rating getRating(Long id) {
            return ratingRepo.findById(id).orElse(null);
        }

        public Rating addRating(Rating rating) {
            return ratingRepo.save(rating);
        }

        public Rating updateRating(Rating rating) {
            return ratingRepo.save(rating);
        }

        public void deleteRating(Long id) {
            ratingRepo.deleteById(id);
        }
    }



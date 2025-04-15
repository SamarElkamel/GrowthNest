package tn.esprit.growthnestback.Controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Rating;
import tn.esprit.growthnestback.Services.RatingServiceImpl;

import java.util.List;

@AllArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rating")
public class RatingController {

        private final RatingServiceImpl ratingService;

        @GetMapping
        public List<Rating> getAll() {
            return ratingService.getAllRatings();
        }

        @GetMapping("/{id}")
        public Rating get(@PathVariable Long id) {
            return ratingService.getRating(id);
        }

        @PostMapping
        public Rating create(@RequestBody Rating rating) {
            return ratingService.addRating(rating);
        }

        @PutMapping
        public Rating update(@RequestBody Rating rating) {
            return ratingService.updateRating(rating);
        }

        @DeleteMapping("/{id}")
        public void delete(@PathVariable Long id) {
            ratingService.deleteRating(id);
        }
    }



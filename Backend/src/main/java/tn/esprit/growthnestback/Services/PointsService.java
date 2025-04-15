package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.BadgeLevel;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Entities.UserProgress;
import tn.esprit.growthnestback.Repository.OrderRepository;
import tn.esprit.growthnestback.Repository.UserProgressRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PointsService {


    @Autowired
    private UserProgressRepository progressRepository ;
    @Autowired
    private OrderRepository orderRepository ;
    @Autowired
    private UserRepository userRepository ;


    public int earnSeedsFromOrder(Long userId, BigDecimal orderAmount) {
        UserProgress progress = progressRepository.findByUserId(userId)
                .orElseGet(() -> initializeProgress(userId));

        int seeds = orderAmount.multiply(BigDecimal.valueOf(10)).intValue();

        // Check if this is the user's first order
        //boolean isFirstOrder = orderRepository.countByUserId(userId) == 0;
        boolean isFirstOrder = false ;
        if (isFirstOrder) {
            seeds += 500;
        }

        progress.setTotalPoints(progress.getTotalPoints() + seeds);
        progress.setBadge(BadgeLevel.fromPointCount(progress.getTotalPoints()).name());
        progress.setLastUpdated(LocalDateTime.now());

        progressRepository.save(progress);
        return seeds ;
    }
    private UserProgress initializeProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProgress progress = new UserProgress();
        progress.setUser(user);
        progress.setTotalPoints(0);
        progress.setBadge("LEVEL1");
        progress.setLastUpdated(LocalDateTime.now());

        return progress;
    }

}

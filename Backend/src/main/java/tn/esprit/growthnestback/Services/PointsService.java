package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.UserPoints;
import tn.esprit.growthnestback.Repository.UserPointsRepository;

import java.math.BigDecimal;


@Service
public class PointsService {
@Autowired
private UserPointsRepository userPointsRepo ;
    public void addPoints(Long userId, BigDecimal orderAmount) {
        int earned = orderAmount.intValue() * 10; // 10 pts per $1
        UserPoints points = userPointsRepo.findById(userId)
                .orElse(new UserPoints(userId, 0, 0));

        points.setTotalPoints(points.getTotalPoints() + earned);
        userPointsRepo.save(points);
    }
}

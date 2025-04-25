package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.growthnestback.Entities.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByIsReadFalse();

    long countByIsReadFalse();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.isRead = false AND n.registration.status = 'PENDING'")
    long countByIsReadFalseAndRegistrationStatusPending();
}
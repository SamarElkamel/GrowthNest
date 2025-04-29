package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.NotificationE;

import java.util.List;

public interface BusinessNotificationRepository extends JpaRepository<NotificationE, Long> {
    List<NotificationE> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<NotificationE> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);
}

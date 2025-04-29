package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.NotificationE;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.BusinessNotificationRepository;

import java.util.List;

@Service
public class BusinessNotificationService {

    @Autowired
    private BusinessNotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendAndSaveNotification(User recipient, String message, NotificationE.NotificationType type, Business business) {
        NotificationE notification = NotificationE.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .business(business)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend(
                "/topic/business-notifications-" + recipient.getId(),
                notification
        );
    }

    public void sendAndSaveNotificationToMultiple(List<User> recipients, String message, NotificationE.NotificationType type, Business business) {
        for (User recipient : recipients) {
            sendAndSaveNotification(recipient, message, type, business);
        }
    }

    public List<NotificationE> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<NotificationE> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public void markNotificationAsRead(Long notificationId) {
        NotificationE notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
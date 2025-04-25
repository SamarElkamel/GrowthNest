package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Notification;
import tn.esprit.growthnestback.Repository.NotificationRepository;

import java.util.List;

@Service
@Slf4j
@Transactional
@NoArgsConstructor
@AllArgsConstructor
public class NotificationServiceImpl {
    @Autowired
    NotificationRepository notificationRepository;

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalse();
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        List<Notification> notifications = notificationRepository.findByIsReadFalse();
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public long getUnreadNotificationCount() {
        return notificationRepository.countByIsReadFalseAndRegistrationStatusPending();
    }
}
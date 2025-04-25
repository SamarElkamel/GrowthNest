package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Notification;
import tn.esprit.growthnestback.Services.NotificationServiceImpl;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Notification")
@Tag(name = "Notification Management")
public class NotificationRestController {
    @Autowired
    NotificationServiceImpl notificationService;

    @Operation(description = "Get all unread notifications")
    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    @Operation(description = "Mark notification as read")
    @PutMapping("/markAsRead/{id}")
    public void markAsRead(@PathVariable("id") Long id) {
        notificationService.markAsRead(id);
    }

    @Operation(description = "Mark all notifications as read")
    @PutMapping("/markAllAsRead")
    public void markAllAsRead() {
        notificationService.markAllAsRead();
    }

    @Operation(description = "Get unread notification count")
    @GetMapping("/count")
    public long getUnreadNotificationCount() {
        return notificationService.getUnreadNotificationCount();
    }
}
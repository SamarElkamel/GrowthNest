package tn.esprit.growthnestback.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Notification;

@Service
@RequiredArgsConstructor
@Slf4j

public class NotificationService {
    private  final SimpMessagingTemplate messagingTemplate;

    public void sendNotification( String userId, Notification notification) {
      log.info("sendNotification to {} with payload {}", userId,notification);
       messagingTemplate.convertAndSendToUser(
               userId,
               "/notification",
               notification
               );
    }
}

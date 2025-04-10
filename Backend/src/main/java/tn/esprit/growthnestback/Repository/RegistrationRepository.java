package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.User;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration,Long> {
    @Query("SELECT r FROM Registration r WHERE r.user.id = :userId AND r.event.idEvent = :eventId")
    Optional<Registration> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);




    @Query("SELECT r FROM Registration r WHERE r.event.idEvent = :eventId")
    List<Registration> findByEventId(@Param("eventId") Long eventId);
}

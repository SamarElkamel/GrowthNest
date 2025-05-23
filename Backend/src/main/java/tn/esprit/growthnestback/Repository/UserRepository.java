package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.RoleName;
import tn.esprit.growthnestback.Entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);


  //  Optional<User> findById(Long userId) ;

    Optional<User> findByResetToken(String resetToken);
    public List<User> findAllByRoleName(RoleName roleName);

}

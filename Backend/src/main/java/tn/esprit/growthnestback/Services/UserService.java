package tn.esprit.growthnestback.Services;

import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleLockState(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAccountLocked(!user.isAccountLocked());
            return userRepository.save(user);
        }
        return null;
    }
}

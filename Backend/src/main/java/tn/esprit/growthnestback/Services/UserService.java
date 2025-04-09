package tn.esprit.growthnestback.Services;

import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

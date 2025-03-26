package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Repository.UserRepository;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String useremail) throws UsernameNotFoundException {
        return userRepository.findByEmail(useremail)
                .orElseThrow (() -> new UsernameNotFoundException("User not found"));
    }

    /*User user = userRepository.findByEmail(useremail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

if (!user.isEnabled()) {
        throw new DisabledException("User account is not activated.");
    }

return user;*/

}

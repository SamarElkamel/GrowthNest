package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.DTO.ReactRequest;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.React;
import tn.esprit.growthnestback.Entities.ReactionType;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.ReactRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Transactional
@Slf4j
public class ReactService implements IReactService {

    @Autowired
    ReactRepository reactRepository;

    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    private UserRepository userRepository;

    // 🆕 Nouvelle méthode pour ajouter une réaction avec DTO
    @Override
    public React addReact(ReactRequest request) {
        React react = new React();

        // 1. Get authenticated user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // this gives you the email from the JWT
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + email)
        );

        // 2. Get post from DB
        Post post = entityManager.find(Post.class, request.getIdp());
        if (post == null) {
            throw new EntityNotFoundException("Post not found with id: " + request.getIdp());
        }

        // 3. Build and save the react
        react.setType(ReactionType.valueOf(request.getType()));
        react.setUser(user);
        react.setPost(post);

        return reactRepository.save(react);
    }

    @Override
    public void deleteReact(long idreact) {
        reactRepository.deleteById(idreact);
    }

    @Override
    public List<React> getAllReacts() {
        return reactRepository.findAll();
    }

    @Override
    public React getReactById(long idreact) {
        return reactRepository.findById(idreact).orElse(null);
    }

    @Override
    public List<React> getReactsByPostId(long postId) {
        return reactRepository.findByPost_Idp(postId);
    }

    @Override
    public List<React> getReactsByUserId(long userId) {
        return reactRepository.findByUser_Id(userId);


    }
}

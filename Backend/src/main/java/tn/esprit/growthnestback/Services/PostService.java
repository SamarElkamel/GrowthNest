package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.PostRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Transactional
@Service
@Slf4j
public class PostService implements IPostService {
    @Autowired
    PostRepository repo;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Post addPost(Post post, Authentication authentication) {
        String email = authentication.getName(); // Email from token
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setValidated(false); // Default not validated

        return repo.save(post);
    }

    @Override
    public List<Post> findAll() {
        return repo.findAll();
    }

    @Override
    public Post findById(long id) {
        return repo.findById(id).get();
    }

    @Override
    public Post updatePost(Post post) {
        return repo.save(post);
    }

    @Override
    public Post deletePost(long id) {
        Post post = repo.findById(id).get();
        repo.delete(post);
        return post;
    }
    @Override
    public Post validatePost(long id) {
        Post post = repo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setValidated(true);
        return repo.save(post);
    }


}


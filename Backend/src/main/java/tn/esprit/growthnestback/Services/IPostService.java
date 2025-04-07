package tn.esprit.growthnestback.Services;

import org.springframework.security.core.Authentication;
import tn.esprit.growthnestback.Entities.Post;

import java.util.List;

public interface IPostService {
    Post addPost(Post post, Authentication authentication);
    Post updatePost(Post post);
    Post deletePost(long id);
    Post findById(long id);



    List<Post> findAll();
    Post validatePost(long id);
}

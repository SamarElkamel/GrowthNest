package tn.esprit.growthnestback.Services;

import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.Tags;

import java.security.Principal;
import java.util.List;

public interface IPostService {
    //Post addPost(Post post, Authentication authentication);
    Post updatePost(Post post);
    Post deletePost(long id);

    List<Post> findUnvalidatedPosts();

    List<Post> findValidatedPosts();

    Post findById(long id);


    Post addPost(String title, String content, String tags, MultipartFile image, MultipartFile video, Authentication authentication);

    List<Post> getPostsByTag(Tags tag);

    long countLikesForPost(Long postId);

    String saveFile(MultipartFile file, String folder);

    long countDisLikesForPost(Long postId);

    void savePostWithMedia(Post post, MultipartFile image, MultipartFile video, Principal principal);



    List<Post> findAll();
    Post validatePost(long id);

    void toggleSavePost(Long postId, Authentication authentication);

    List<Long> getSavedPostIds(Authentication authentication);

    List<Post> getPostsByCurrentUser(Authentication authentication);
}

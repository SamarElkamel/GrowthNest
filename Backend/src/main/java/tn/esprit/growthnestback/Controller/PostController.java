package tn.esprit.growthnestback.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Services.IPostService;

import java.util.List;
@PreAuthorize("hasAnyRole('USER')")

@RestController
@AllArgsConstructor
@RequestMapping("/post")
public class PostController {
    @Autowired
    IPostService postService;
    @GetMapping("/retrieveAllPost")
    public List<Post> retrieveAllPost() {return postService.findAll();}
    @GetMapping("/retrievePost/{id}")
    public Post retrievePost(@PathVariable("id") long id) { return postService.findById(id);}
    @PostMapping("/addPost")
    @PreAuthorize("hasAnyRole('USER')")
    public Post addPost(@RequestBody Post post, Authentication authentication) {
        return postService.addPost(post, authentication);
    }
    @PutMapping("/updatepost")
    public Post updatePost(@RequestBody Post post) {return postService.updatePost(post);}
    @DeleteMapping("/deletepost/{id}")
    public void deletePost(@PathVariable("id") long id) { postService.deletePost(id);}

    /*@PatchMapping("/validate/{id}")
    public Post validatePost(@PathVariable("id") long id) {
        return postService.validatePost(id);
    }*/

    @PatchMapping("/validate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Post validatePost(@PathVariable("id") long id) {
        return postService.validatePost(id);
    }


 /* @PostMapping("/addPosts")
    @PreAuthorize("hasAnyRole('USER')")
    public Post addPost(@RequestBody Post post, Authentication authentication) {
        return postService.addPost(post, authentication);
    }*/

}

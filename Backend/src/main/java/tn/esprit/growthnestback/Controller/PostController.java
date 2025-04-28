package tn.esprit.growthnestback.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.DTO.TagStats;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.Tags;
import tn.esprit.growthnestback.Services.IPostService;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")



@RestController
@AllArgsConstructor
@RequestMapping("/post")
public class PostController {
    @Autowired
    IPostService postService;
    @GetMapping("/retrieveAllPost")
    public List<Post> retrieveAllPost() {return postService.findValidatedPosts();}
    @GetMapping("/retrievePost/{id}")
    public Post retrievePost(@PathVariable("id") long id) { return postService.findById(id);}
    @PostMapping("/addPost")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<Post> addPost(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile video,
            Authentication authentication) {

        Post createdPost = postService.addPost(title, content, tags, image, video, authentication);
        return ResponseEntity.ok(createdPost);
    }
    @PostMapping("/addPostAdmin")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Post> addPostadmin(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile video,
            Authentication authentication) {

        Post createdPost = postService.addPostadmine(title, content, tags, image, video, authentication);
        return ResponseEntity.ok(createdPost);
    }
    @GetMapping("/byTag/{tag}")
    public List<Post> getPostsByTag(@PathVariable Tags tag) {
        return postService.getPostsByTag(tag);
    }
    @GetMapping("/likes/{postId}")
    public long countLikes(@PathVariable Long postId) {
        return postService.countLikesForPost(postId);
    }
    @GetMapping("/dislikes/{postId}")
    public long countDisLikes(@PathVariable Long postId) {
        return postService.countDisLikesForPost(postId);
    }
    @GetMapping("/myPosts")
    @PreAuthorize("hasRole('USER')")
    public List<Post> getMyPosts(Authentication authentication) {
        return postService.getPostsByCurrentUser(authentication);
    }

    @PostMapping(value = "/addPostWithMedia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addPostWithMedia(
            @RequestPart("post") Post post,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "video", required = false) MultipartFile video,
            Principal principal) {

        // Set author, createdAt, etc.
        postService.savePostWithMedia(post, image, video, principal);
        return ResponseEntity.ok("Post with media added");
    }
    @PutMapping("/updatepost")
    public Post updatePost(@RequestBody Post post) {return postService.updatePost(post);}
    @DeleteMapping("/deletepost/{id}")
    public void deletePost(@PathVariable("id") long id) { postService.deletePost(id);}

    /*@PatchMapping("/validate/{id}")
    public Post validatePost(@PathVariable("id") long id) {
        return postService.validatePost(id);
    }*/

    @PostMapping("/validate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Post validatePost(@PathVariable("id") long id) {
        return postService.validatePost(id);
    }


 /* @PostMapping("/addPosts")
    @PreAuthorize("hasAnyRole('USER')")
    public Post addPost(@RequestBody Post post, Authentication authentication) {
        return postService.addPost(post, authentication);
    }*/
 @GetMapping("/unvalidated")
 @PreAuthorize("hasRole('ADMIN')")
 public List<Post> getUnvalidatedPosts() {
     return postService.findUnvalidatedPosts();
 }
    @PostMapping("/save/{postId}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> toggleSave(@PathVariable Long postId, Authentication auth) {
        postService.toggleSavePost(postId, auth);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/saved")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<List<Long>> getSaved(Authentication auth) {
        return ResponseEntity.ok(postService.getSavedPostIds(auth));
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/images/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header("Content-Type", "image/jpeg") // Adjust MIME type as needed
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @CrossOrigin(origins = "http://localhost:4200") // <-- AJOUT ICI
    @GetMapping("/stats/details")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TagStats> getTagStats() {
        return postService.getTagStats();
    }

}

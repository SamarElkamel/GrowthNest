package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.DTO.TagStats;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.ReactionType;
import tn.esprit.growthnestback.Entities.Tags;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.PostRepository;
import tn.esprit.growthnestback.Repository.ReactRepository;
import tn.esprit.growthnestback.Repository.ResponsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    @Autowired
    private ReactRepository reactRepository;
    @Autowired
    private ResponsRepository responsRepository;
    @Override
    public Post addPost(String title, String content, String tags, MultipartFile image, MultipartFile video, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setTags(Tags.valueOf(tags.toUpperCase())); // or adapt if needed
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setValidated(false);

        // 👇 Save image and video locally or on cloud, for now simulate:
        if (image != null && !image.isEmpty()) {
            System.out.println("🖼️ Image received: " + image.getOriginalFilename());
            String imagePath = saveFile(image, "images");
            post.setImage(imagePath);
        }

        if (video != null && !video.isEmpty()) {
            System.out.println("🎞️ Video received: " + video.getOriginalFilename());
            String videoPath = saveFile(video, "videos");
            post.setVideo(videoPath);
        }

        return repo.save(post);
    }
    @Override
    public List<Post> getPostsByTag(Tags tag) {
        return repo.findByTags(tag);
    }
    @Override
    public long countLikesForPost(Long postId) {
        return reactRepository.countByPost_IdpAndType(postId, ReactionType.LIKE);
    }
    @Override
    public String saveFile(MultipartFile file, String folder) {
        try {
            System.out.println("📂 Attempting to save file: " + file.getOriginalFilename());
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", folder);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path fullPath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), fullPath);

            System.out.println("✅ File saved to: " + fullPath.toAbsolutePath());

            return filename;
        } catch (IOException e) {
            System.err.println("❌ Failed to save file: " + e.getMessage());
            throw new RuntimeException("Failed to save file", e);
        }
    }
    @Override
    public long countDisLikesForPost(Long postId) {
        return reactRepository.countByPost_IdpAndType(postId, ReactionType.DISLIKE);
    }
    @Override
    public void savePostWithMedia(Post post, MultipartFile image, MultipartFile video, Principal principal) {
        if (image != null && !image.isEmpty()) {
            String imagePath = saveFile(image, "images");
            post.setImage(imagePath); // stored as "uploads/images/..."
        }

        if (video != null && !video.isEmpty()) {
            String videoPath = saveFile(video, "videos");
            post.setVideo(videoPath); // stored as "uploads/videos/..."
        }

        repo.save(post);
    }

    /*private String saveFile(MultipartFile file) {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/" + filename);
        try {
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
        return filename;
    }*/

    @Override
    public List<Post> findAll() {
        return repo.findAll();
    }
    @Override
    public List<Post> findUnvalidatedPosts() {
        return repo.findByValidatedFalse();
    }
    @Override
    public List<Post> findValidatedPosts() {
        return repo.findByValidatedTrue();
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

    @Override
    public void toggleSavePost(Long postId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = repo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post); // unsave
        } else {
            user.getSavedPosts().add(post); // save
        }

        userRepository.save(user); // persist change
    }

    @Override
    public List<Long> getSavedPostIds(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getSavedPosts().stream()
                .map(Post::getIdp)
                .toList();
    }

    @Override
    public List<Post> getPostsByCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return repo.findByUser(user);
    }

    public List<TagStats> getTagStats() {
        log.info("Début de getTagStats");
        log.info("Tags disponibles : {}", Arrays.toString(Tags.values()));

        List<TagStats> stats = Arrays.asList(Tags.values()).stream()
                .map(tag -> {
                    log.info("Traitement du tag : {}", tag);
                    long postCount = repo.countByTags(tag);
                    long likeCount = reactRepository.countByPost_TagsAndType(tag, ReactionType.LIKE);
                    long dislikeCount = reactRepository.countByPost_TagsAndType(tag, ReactionType.DISLIKE);
                    long responseCount = responsRepository.countByPost_Tags(tag);
                    log.info("Stats pour {}: posts={}, likes={}, dislikes={}, responses={}",
                            tag, postCount, likeCount, dislikeCount, responseCount);

                    TagStats tagStats = new TagStats();
                    tagStats.setTag(tag.name());
                    tagStats.setPostCount(postCount);
                    tagStats.setLikeCount(likeCount);
                    tagStats.setDislikeCount(dislikeCount);
                    tagStats.setResponseCount(responseCount);

                    return tagStats;
                })
                .collect(Collectors.toList());

        log.info("Stats finales : {}", stats);
        return stats;
    }

}


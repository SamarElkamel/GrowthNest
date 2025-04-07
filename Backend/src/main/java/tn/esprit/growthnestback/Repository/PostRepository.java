package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.Tags;

import java.util.List;


@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findPostsByTags(Tags tags);

}

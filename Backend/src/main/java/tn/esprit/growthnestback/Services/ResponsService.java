package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.DTO.ResponsRequest;
import tn.esprit.growthnestback.Entities.Post;
import tn.esprit.growthnestback.Entities.Respons;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.PostRepository;
import tn.esprit.growthnestback.Repository.ResponsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Service
@Transactional
@Slf4j
public class ResponsService implements IResponsService {
    @Autowired
     ResponsRepository responsRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    @Override
    public Respons createRespons(Respons respons, String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        respons.setUser(user);
        return responsRepository.save(respons);
    }
    @Override
    public List<Respons> displayallRespons(){return responsRepository.findAll();}
    @Override
    public Respons displayRespons(long id){ return responsRepository.findById(id).get();}
    @Override
    public Respons updateRespons(Respons respons){return responsRepository.save(respons);}
    @Override
    public void deleteRespons(long id){ responsRepository.deleteById(id);}
    @Override
    public List<Respons> getResponsesByPostId(Long postId) {
        return responsRepository.findResponsByPost_Idp(postId);
    }

    @Override
    public Respons addResponsToPost(ResponsRequest dto, Authentication auth) {
        String email = auth.getName(); // Récupérer l'utilisateur connecté
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Respons respons = new Respons();
        respons.setRespons(dto.getRespons());
        respons.setPost(post);
        respons.setUser(user);
        respons.setCreatedAt(LocalDateTime.now());

        return responsRepository.save(respons);
    }



}

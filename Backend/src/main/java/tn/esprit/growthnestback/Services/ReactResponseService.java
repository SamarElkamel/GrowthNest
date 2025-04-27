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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.ReactResponse;
import tn.esprit.growthnestback.Entities.Reaction;
import tn.esprit.growthnestback.Entities.Respons;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.ReactResponseRepository;
import tn.esprit.growthnestback.Repository.ResponsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Transactional
@Slf4j
public class ReactResponseService implements IReactResponseService {

    @Autowired
    private ReactResponseRepository reactResponseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResponsRepository responsRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ReactResponse addReactResponse(Long responsId, Reaction type, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Respons respons = entityManager.find(Respons.class, responsId);
        if (respons == null) {
            throw new EntityNotFoundException("Respons not found with id: " + responsId);
        }

        ReactResponse reactResponse = new ReactResponse();
        reactResponse.setType(type);
        reactResponse.setUser(user);
        reactResponse.setRespons(respons);

        return reactResponseRepository.save(reactResponse);
    }

    @Override
    public void deleteReactResponse(long idReactResponse) {
        reactResponseRepository.deleteById(idReactResponse);
    }

    @Override
    public List<ReactResponse> getAllReactResponses() {
        return reactResponseRepository.findAll();
    }

    @Override
    public ReactResponse getReactResponseById(long idReactResponse) {
        return reactResponseRepository.findById(idReactResponse).orElse(null);
    }

    @Override
    public List<ReactResponse> getReactResponsesByResponsId(Long responsId) {
        return reactResponseRepository.findByRespons_Id(responsId);
    }

    @Override
    public List<ReactResponse> getReactResponsesByUserId(Long userId) {
        return reactResponseRepository.findByUser_Id(userId);
    }

    @Override
    public ReactResponse toggleReaction(Long responsId, Reaction newType, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Respons respons = responsRepository.findById(responsId)
                .orElseThrow(() -> new RuntimeException("Respons not found"));

        Optional<ReactResponse> existingReactOpt = reactResponseRepository.findByUserAndRespons(user, respons);

        if (existingReactOpt.isPresent()) {
            ReactResponse existing = existingReactOpt.get();
            if (existing.getType() == newType) {
                reactResponseRepository.delete(existing); // Si même type, retirer
                return null;
            } else {
                existing.setType(newType); // Sinon changer
                return reactResponseRepository.save(existing);
            }
        } else {
            ReactResponse newReact = new ReactResponse();
            newReact.setUser(user);
            newReact.setRespons(respons);
            newReact.setType(newType);
            return reactResponseRepository.save(newReact);
        }
    }
}

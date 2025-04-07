package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Respons;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.ResponsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

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



}

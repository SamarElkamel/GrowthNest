package tn.esprit.growthnestback.Services;

import org.springframework.security.core.Authentication;
import tn.esprit.growthnestback.DTO.ResponsRequest;
import tn.esprit.growthnestback.Entities.Respons;

import java.util.List;

public interface IResponsService {
    Respons createRespons(Respons respons, String token);

    List<Respons> displayallRespons();

    Respons displayRespons(long id);

    Respons updateRespons(Respons respons);

    void deleteRespons(long id);

    List<Respons> getResponsesByPostId(Long postId);



    Respons addResponsToPost(ResponsRequest dto, Authentication auth);
}

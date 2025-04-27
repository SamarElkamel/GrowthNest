package tn.esprit.growthnestback.Services;

import org.springframework.security.core.Authentication;
import tn.esprit.growthnestback.Entities.ReactResponse;
import tn.esprit.growthnestback.Entities.Reaction;

import java.util.List;

public interface IReactResponseService {

    ReactResponse addReactResponse(Long responsId, Reaction type, Authentication authentication);

    void deleteReactResponse(long idReactResponse);

    List<ReactResponse> getAllReactResponses();

    ReactResponse getReactResponseById(long idReactResponse);

    List<ReactResponse> getReactResponsesByResponsId(Long responsId);

    List<ReactResponse> getReactResponsesByUserId(Long userId);

    ReactResponse toggleReaction(Long responsId, Reaction newType, Authentication authentication);
}

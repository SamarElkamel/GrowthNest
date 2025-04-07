package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Respons;

import java.util.List;

public interface IResponsService {
    Respons createRespons(Respons respons, String token);

    List<Respons> displayallRespons();

    Respons displayRespons(long id);

    Respons updateRespons(Respons respons);

    void deleteRespons(long id);
}

package tn.esprit.growthnestback;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import tn.esprit.growthnestback.Entities.Role;
import tn.esprit.growthnestback.Entities.RoleName;
import tn.esprit.growthnestback.Repository.RoleRepository;
import lombok.*;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class GrowthNestBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrowthNestBackApplication.class, args);
    }

}

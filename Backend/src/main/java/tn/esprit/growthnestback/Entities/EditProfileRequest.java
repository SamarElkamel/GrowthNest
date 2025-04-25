package tn.esprit.growthnestback.Entities;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@Builder
public class EditProfileRequest {
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;

}

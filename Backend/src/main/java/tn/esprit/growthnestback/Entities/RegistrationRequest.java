package tn.esprit.growthnestback.Entities;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class RegistrationRequest {

    @NotEmpty(message="Firstname is mandatory")
    @NotBlank(message="Firstname is mandatory")
    private String firstName;
    private String lastname;
    @Email (message= "Email is not formated")
    @NotEmpty(message="Email is mandatory")
    @NotBlank(message="Email is mandatory")
    private String email;
    @NotEmpty(message="Password is mandatory")
    @NotBlank(message="Password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one number")
    @Pattern(regexp = ".*[@$!%*?&].*", message = "Password must contain at least one special character (@$!%*?&)")
    private String password;
    private String image;
    private RoleName role;


}

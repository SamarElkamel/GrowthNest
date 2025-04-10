package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryAgency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idAgency;

    @NotBlank(message = "The agency name is required")
    @Size(min = 3, max = 50, message = "The agency name must be between 3 and 50 characters")
    String agencyName;

    @NotBlank(message = "The address is required")
    @Size(min = 5, max = 100, message = "The address must be between 5 and 100 characters")
    String address;

    @NotBlank(message = "The phone number is required")
    @Pattern(regexp = "^\\d{8}$", message = "The phone number must contain exactly 8 digits")
    String phoneNumber;

    public Long getIdAgency() {
        return idAgency;
    }

    public void setIdAgency(Long idAgency) {
        this.idAgency = idAgency;
    }

    public String getAgencyName() {
        return agencyName;
    }

    public void setAgencyName(String agencyName) {
        this.agencyName = agencyName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

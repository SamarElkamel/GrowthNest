package tn.esprit.growthnestback.dto;

public record PayementRequestDTO(
         Long userId ,
         Long cartId ,
         Double amount) {
}

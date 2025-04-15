package tn.esprit.growthnestback.DTO;

import tn.esprit.growthnestback.Entities.Tags;

import java.time.LocalDateTime;

public class postDTO {
    private String title;
    private String content;
    private Tags tags;
    private String image;
    private String video;
    private LocalDateTime createdAt;
    private boolean validated;
    private String fullName;
}

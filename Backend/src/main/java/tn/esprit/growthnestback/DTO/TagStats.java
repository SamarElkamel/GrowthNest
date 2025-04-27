package tn.esprit.growthnestback.DTO;

import lombok.Data;

@Data
public class TagStats {
    private String tag;
    private long postCount;
    private long likeCount;
    private long dislikeCount;
    private long responseCount;
}
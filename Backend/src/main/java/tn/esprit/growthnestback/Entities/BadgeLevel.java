package tn.esprit.growthnestback.Entities;

public enum BadgeLevel {
    LEVEL1 ,
    LEVEL2,
    LEVEL3 ;
    public static BadgeLevel fromPointCount(int points) {
        if (points >= 3000) return LEVEL3;
        if (points >= 1000) return LEVEL2;
        return LEVEL1;
    }
}

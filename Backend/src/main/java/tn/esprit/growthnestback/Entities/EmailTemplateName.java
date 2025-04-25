package tn.esprit.growthnestback.Entities;

import lombok.Getter;

@Getter
public enum EmailTemplateName {

    ACTIVATE_ACCOUNT("activate_account")
    ,
    FORGOT_PASSWORD("forget_password");



    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
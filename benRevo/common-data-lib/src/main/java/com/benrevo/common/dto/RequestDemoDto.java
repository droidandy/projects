package com.benrevo.common.dto;

import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Created by elliott on 10/9/17 at 12:38 PM.
 */
public class RequestDemoDto {

    @NotEmpty
    private String name;
    @NotEmpty
    private String companyName;
    @NotEmpty @Email
    private String email;
    @Pattern(regexp = "^(\\+1\\s\\(\\d{3}\\)\\s\\d{3}\\-\\d{4}|)$")
    private String phoneNumber;

    public RequestDemoDto() {}

    private RequestDemoDto(Builder builder) {
        setName(builder.name);
        setCompanyName(builder.companyName);
        setEmail(builder.email);
        setPhoneNumber(builder.phoneNumber);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public static final class Builder {

        private String name;
        private String companyName;
        private String email;
        private String phoneNumber;

        public Builder() {}

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withCompanyName(String val) {
            companyName = val;
            return this;
        }

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public Builder withPhoneNumber(String val) {
            phoneNumber = val;
            return this;
        }

        public RequestDemoDto build() {
            return new RequestDemoDto(this);
        }
    }
}

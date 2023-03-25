package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

/**
 * Created by ebrandell on 3/28/18 at 7:51 PM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserMetadata {

    static ObjectMapper mapper = new ObjectMapper();

    @JsonProperty("eula_accepted")
    private String eulaAccepted;
    @JsonProperty("first_name")
    private String firstName;
    @JsonProperty("last_name")
    private String lastName;

    public UserMetadata() {}

    @JsonCreator
    public static UserMetadata fromJson(String json) throws IOException {
        return mapper.readValue(json, UserMetadata.class);
    }

    @JsonIgnore
    private UserMetadata(Builder builder) {
        setEulaAccepted(builder.eulaAccepted);
        setFirstName(builder.firstName);
        setLastName(builder.lastName);
    }

    public String getEulaAccepted() {
        return eulaAccepted;
    }

    public void setEulaAccepted(String eulaAccepted) {
        this.eulaAccepted = eulaAccepted;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public static final class Builder {

        private String eulaAccepted;
        private String firstName;
        private String lastName;

        public Builder() {}

        public Builder withEulaAccepted(String val) {
            eulaAccepted = val;
            return this;
        }

        public Builder withFirstName(String val) {
            firstName = val;
            return this;
        }

        public Builder withLastName(String val) {
            lastName = val;
            return this;
        }

        public UserMetadata build() {
            return new UserMetadata(this);
        }

        public UserMetadata build(Map<String, Object> val) {
            return val != null ? mapper.convertValue(val, UserMetadata.class) : null;
        }
    }
}

package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by elliott on 6/29/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppMetadata {

    static ObjectMapper mapper = new ObjectMapper();

    private String email;
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<String> roles;
    private String brokerage;
    private String brokerageRole;
    private String brokerageId;
    private List<String> carrierAcl;

    public AppMetadata() {}

    @JsonCreator
    public static AppMetadata fromJson(String json) throws IOException {
        return mapper.readValue(json, AppMetadata.class);
    }

    @JsonIgnore
    private AppMetadata(Builder builder) {
        setEmail(builder.email);
        setRoles(builder.roles);
        setBrokerage(builder.brokerage);
        setBrokerageRole(builder.brokerageRole);
        setBrokerageId(builder.brokerageId);
        setCarrierAcl(builder.carrierAcl);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getBrokerage() {
        return brokerage;
    }

    public void setBrokerage(String brokerage) {
        this.brokerage = brokerage;
    }

    public String getBrokerageRole() {
        return brokerageRole;
    }

    public void setBrokerageRole(String brokerageRole) {
        this.brokerageRole = brokerageRole;
    }

    public String getBrokerageId() {
        return brokerageId;
    }

    public void setBrokerageId(String brokerageId) {
        this.brokerageId = brokerageId;
    }

    public List<String> getCarrierAcl() {
        return carrierAcl;
    }

    public void setCarrierAcl(List<String> carrierAcl) {
        this.carrierAcl = carrierAcl;
    }

    public static final class Builder {

        private String email;
        private List<String> roles;
        private String brokerage;
        private String brokerageRole;
        private String brokerageId;
        private List<String> carrierAcl;

        public Builder() {}

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public Builder withRoles(List<String> val) {
            roles = val;
            return this;
        }

        public Builder withBrokerage(String val) {
            brokerage = val;
            return this;
        }

        public Builder withBrokerageRole(String val) {
            brokerageRole = val;
            return this;
        }

        public Builder withBrokerageId(String val) {
            brokerageId = val;
            return this;
        }

        public Builder withCarrierAcl(List<String> val) {
            carrierAcl = val;
            return this;
        }

        public AppMetadata build() {
            return new AppMetadata(this);
        }

        public AppMetadata build(Map<String, Object> val) {
            return val != null ? mapper.convertValue(val, AppMetadata.class) : null;
        }
    }
}

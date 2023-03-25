package com.benrevo.common.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.Map;

import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

public class ClientMemberDto {

    private Long id;
    private Long brokerageId;
    private String brokerName;
    private boolean generalAgent;
    private String authId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;

    public ClientMemberDto() {}

    private ClientMemberDto(Builder builder) {

        setId(builder.id);
        setBrokerageId(builder.brokerageId);
        setAuthId(builder.authId);
        setFirstName(builder.firstName);
        setLastName(builder.lastName);
        setFullName(builder.fullName);
        setEmail(builder.email);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public boolean isGeneralAgent() {
        return generalAgent;
    }

    public void setGeneralAgent(boolean generalAgent) {
        this.generalAgent = generalAgent;
    }

    public Long getBrokerageId() {
        return brokerageId;
    }

    public void setBrokerageId(Long brokerageId) {
        this.brokerageId = brokerageId;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static final class Builder {

        private Long id;
        private Long brokerageId;
        private String authId;
        private String firstName;
        private String lastName;
        private String email;
        private String name;
        private String fullName = "";

        public Builder() {}

        public Builder withId(Long val) {
            id = val;
            return this;
        }

        public Builder withBrokerageId(Long val) {
            brokerageId = val;
            return this;
        }

        public Builder withAuthId(String val) {
            authId = val;
            return this;
        }

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withUserMetadata(Map<String, Object> val) {
            if(val != null) {
                firstName = defaultString((String) val.get("first_name"), null);
                lastName = defaultString((String) val.get("last_name"), null);
            }

            if(isNotBlank(firstName) && isNotBlank(lastName)) {
                fullName += firstName + " " + lastName;
            }

            if(isBlank(fullName)) {
                fullName = isNotBlank(name) ? name : email;
            }

            return this;
        }

        public ClientMemberDto build() {
            return new ClientMemberDto(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof ClientMemberDto)) {
            return false;
        }

        ClientMemberDto that = (ClientMemberDto) o;

        return new EqualsBuilder()
            .append(getId(), that.getId())
            .append(getBrokerageId(), that.getBrokerageId())
            .append(getAuthId(), that.getAuthId())
            .append(getFirstName(), that.getFirstName())
            .append(getLastName(), that.getLastName())
            .append(getFullName(), that.getFullName())
            .append(getEmail(), that.getEmail())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getBrokerageId())
            .append(getAuthId())
            .append(getFirstName())
            .append(getLastName())
            .append(getFullName())
            .append(getEmail())
            .toHashCode();
    }
}

package com.benrevo.common.security;


import java.util.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class AuthenticatedUser implements Authentication {

    private String authId;
    private Long brokerageId;
    private String brokerName;
    private String firstName;
    private String lastName;
    private String brokerageLogo;
    private String brokerRole;
    private List<String> roles = new ArrayList<>();
    private String email;
    private String principal;
    private List<String> carrierAcls = new ArrayList<>();
    private Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    private boolean authenticated;

    public AuthenticatedUser() {}

    private AuthenticatedUser(Builder builder) {
        authId = builder.authId;
        brokerageId = builder.brokerageId;
        brokerName = builder.brokerName;
        firstName = builder.firstName;
        lastName = builder.lastName;
        brokerRole = builder.brokerRole;
        email = builder.email;
        brokerageLogo = builder.brokerageLogo;
        principal = builder.principal;
        // to avoid null from builder
        if(builder.carrierAcls != null) {
            carrierAcls = builder.carrierAcls;
        }
        if(builder.roles != null) {
            roles = builder.roles;
        }
        if(builder.authorities != null) {
            authorities = builder.authorities;   
        }
        authenticated = builder.authenticated;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return brokerageId;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public boolean isAuthenticated() {
        return this.authenticated;
    }

    @Override
    public void setAuthenticated(boolean b) throws IllegalArgumentException {
        this.authenticated = b;
    }

    @Override
    public String getName() {
        return this.authId;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public String getBrokerRole() {
        return brokerRole;
    }

    public String getBrokerageLogo() {
        return brokerageLogo;
    }

    public void setBrokerageLogo(String brokerageLogo) {
        this.brokerageLogo = brokerageLogo;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public List<String> getCarrierAcls() {
        return carrierAcls;
    }

    public static class Builder {
        private String authId;
        private Long brokerageId;
        private String brokerName;
        private String firstName;
        private String lastName;
        private String brokerRole;
        private List<String> roles = new ArrayList<>();
        private String email;
        private String principal;
        private List<String> carrierAcls = new ArrayList<>();
        private Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        private boolean authenticated;
        private String brokerageLogo;

        public Builder() {}

        public Builder withAuthId(String val) {
            authId = val;
            return this;
        }

        public Builder withBrokerageId(Long val) {
            brokerageId = val;
            return this;
        }

        public Builder withBrokerName(String val) {
            brokerName = val;
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
        
        public Builder withBrokerRole(String val) {
            brokerRole = val;
            return this;
        }
        
        public Builder withRoles(List<String> val) {
            roles = val;
            return this;
        }

        public Builder withAuthorities(Set<SimpleGrantedAuthority> val) {
            this.authorities = val;
            return this;
        }

        public Builder withAuthority(SimpleGrantedAuthority val) {
            if(this.authorities == null) {
                this.authorities = new HashSet<>();
            }

            this.authorities.add(val);
            return this;
        }

        public Builder withAuthority(String val) {
            if(this.authorities == null) {
                this.authorities = new HashSet<>();
            }
            if(val != null) {
                this.authorities.add(new SimpleGrantedAuthority(val));
            }
            return this;
        }

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public Builder withPrincipal(String val) {
            principal = val;
            return this;
        }

        public Builder withCarrierAcls(List<String> val) {
            carrierAcls = val;
            return this;
        }

        public Builder withAuthenticated(boolean val) {
            authenticated = val;
            return this;
        }

        public Builder withBrokerageLogo(String val) {
            brokerageLogo = val;
            return this;
        }

        public AuthenticatedUser build() {
            return new AuthenticatedUser(this);
        }
    }
}

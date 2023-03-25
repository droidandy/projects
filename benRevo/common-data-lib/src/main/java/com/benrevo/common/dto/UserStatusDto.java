package com.benrevo.common.dto;

import java.util.Date;
import java.util.List;

import com.benrevo.common.enums.UserAttributeName;

public class UserStatusDto {
    
    private Integer loginCount;
    private Date lastLogin;
    List<UserAttributeName> attributes;

    public UserStatusDto() {}

    public Integer getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(Integer loginCount) {
        this.loginCount = loginCount;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<UserAttributeName> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<UserAttributeName> attributes) {
        this.attributes = attributes;
    }

    public static final class Builder {
        private Integer loginCount;
        private Date lastLogin;
        List<UserAttributeName> attributes;
        
        public Builder() {}

        public Builder withLoginCount(Integer loginCount) {
            this.loginCount = loginCount;
            return this;
        }

        public Builder withLastLogin(Date lastLogin) {
            this.lastLogin = lastLogin;
            return this;
        }

        public Builder withAttributes(List<UserAttributeName> attributes) {
            this.attributes = attributes;
            return this;
        }
        
        public UserStatusDto build() {
            UserStatusDto userStatusDto = new UserStatusDto();
            userStatusDto.setLoginCount(loginCount);
            userStatusDto.setLastLogin(lastLogin);
            userStatusDto.setAttributes(attributes);
            return userStatusDto;
        }
    }
}

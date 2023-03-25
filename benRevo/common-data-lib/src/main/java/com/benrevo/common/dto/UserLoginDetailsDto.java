package com.benrevo.common.dto;

import java.util.Date;

public class UserLoginDetailsDto {
    private Integer loginCount;
    private Date lastLogin;

    public UserLoginDetailsDto() {}

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

    public static final class Builder {
        private Integer loginCount;
        private Date lastLogin;

        public Builder() {}

        public Builder withLoginCount(Integer loginCount) {
            this.loginCount = loginCount;
            return this;
        }

        public Builder withLastLogin(Date lastLogin) {
            this.lastLogin = lastLogin;
            return this;
        }

        public UserLoginDetailsDto build() {
            UserLoginDetailsDto userLoginDetailsDto = new UserLoginDetailsDto();
            userLoginDetailsDto.setLoginCount(loginCount);
            userLoginDetailsDto.setLastLogin(lastLogin);
            return userLoginDetailsDto;
        }
    }
}

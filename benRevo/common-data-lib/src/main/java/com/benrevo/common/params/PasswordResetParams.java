package com.benrevo.common.params;

import com.benrevo.common.util.Secure;


public class PasswordResetParams {

    private String email;
    private String password;
    private String passwordResetVerificationCode;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordResetVerificationCode() {
        return passwordResetVerificationCode;
    }

    public void setPasswordResetVerificationCode(String passwordResetVerificationCode) {
        this.passwordResetVerificationCode = passwordResetVerificationCode;
    }

    public String getPassword() {
        return Secure.md5Salt(password);
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

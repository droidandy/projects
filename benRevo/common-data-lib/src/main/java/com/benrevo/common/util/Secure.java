package com.benrevo.common.util;

import java.math.BigInteger;
import java.security.SecureRandom;


import com.benrevo.common.Constants;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;

public class Secure {

    private static final String salt = "WKpepcyxBJPRLzCe05jKTFsbKCXHbJMJTVJYhrXMMHDxPCF1cwvF9omXNLGXmQ3KxTZyIBrNaplscbfm7Y9OzCQjVMHocnvacs3jSQfUlHS4lrDUbJ3dY97uwF0PmfjD";
    private static final String verificationSalt = "gZLkBhrRtPFsuNfZP7oIQI5eMQ6j4zNm";
    private static final String passwordResetSalt = "LD0BN5IOZKH1LU6KDB5WR85GG3UL87S6";

    public static String md5Salt(String password) {
        return DigestUtils.md5Hex(password + salt);
    }

    public static String md5VerificationSalt(String email) {
        return DigestUtils.md5Hex(email + verificationSalt);
    }

    public static String md5PasswordResetSalt(String email) {
        return DigestUtils.md5Hex(email + passwordResetSalt);
    }

    public static String generateVerificationLink(String email) {
        String link = Constants.APP_VERIFICATION_PATH;
        link = link.concat("?av=").concat(md5VerificationSalt(email)).concat("_");
        link = link.concat(email);
        return link;
    }

    public static String generatePasswordResetLink(String email) {
        String link = Constants.APP_PASSWORD_RESET_PATH;
        link = link.concat("?pr=").concat(md5PasswordResetSalt(email)).concat("_");
        link = link.concat(email);
        return link;
    }

    public static String generateRandomToken() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

    public static String generateRandomString(int strLength) {
        return RandomStringUtils.randomAlphabetic(strLength);
    }
}

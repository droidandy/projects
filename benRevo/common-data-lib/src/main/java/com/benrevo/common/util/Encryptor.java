package com.benrevo.common.util;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

// TODO: Get rid of this and use AWS KMS

public class Encryptor {

    private static String KEY = "Benrevo2015Rules";
    private static String IV = "1ZWVKJVJ24QFYKRE";

    public static String encrypt(String value) {

        try {
            IvParameterSpec ivParamSpec = new IvParameterSpec(IV.getBytes("UTF-8"));
            SecretKeySpec secretKeySpec = new SecretKeySpec(KEY.getBytes("UTF-8"), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParamSpec);
            byte[] encrypted = cipher.doFinal(value.getBytes());
            return Base64.encodeBase64URLSafeString(encrypted);
        } catch(Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static String decrypt(String encrypted) {

        try {
            IvParameterSpec ivParamSpec = new IvParameterSpec(IV.getBytes("UTF-8"));
            SecretKeySpec secretKeySpec = new SecretKeySpec(KEY.getBytes("UTF-8"), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParamSpec);
            byte[] value = cipher.doFinal(Base64.decodeBase64(encrypted));
            return new String(value);
        } catch(Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}

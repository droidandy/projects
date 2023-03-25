package com.benrevo.common.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.normalizeSpace;
import static org.apache.commons.lang3.StringUtils.substring;

public class StringHelper {

    private static Logger logger = LogManager.getLogger(StringHelper.class);
    private static String HASH_ALGORITHM = "MD5";

    public static String generateToken(String s) {
        Date now = new Date();
        MessageDigest md5;
        try {
            md5 = MessageDigest.getInstance(HASH_ALGORITHM);
        } catch (NoSuchAlgorithmException e){
            logger.fatal("Configuration for hash algorithm '"+ HASH_ALGORITHM +"' does not exist", e);
            return null;
        }

        String timestamp = String.valueOf(now.getTime());
        md5.update((s + timestamp).getBytes());
        byte[] digest = md5.digest();
        StringBuilder sb = new StringBuilder();
        for (byte aDigest : digest) {
            String hexStr = Integer.toHexString(0x00ff & aDigest);
            if (hexStr.length() < 2) {
                sb.append("0");
            }
            sb.append(hexStr);
        }
        return sb.toString();
    }

    public static String removeExtraSpaces(String str){
        // TODO replace to StringUtils.normalizeSpace()? See comment inside StringUtils.normalizeSpace():
        // LANG-1020: Improved performance significantly by normalizing manually instead of using regex
        // See https://github.com/librucha/commons-lang-normalizespaces-benchmark for performance test
        return str.replaceAll("\\s{2,}", " ").trim();
    }
 
    public static String normalizeFileName(String fileName) {
      if (fileName == null) {
        return null;
      }
      // remove spaces and 
      fileName = normalizeSpace(fileName);
      final int size = fileName.length();
      final char[] newChars = new char[size];
      final char replacementChar = '_';
      for (int i = 0; i < size; i++) {
        final char currentChar = fileName.charAt(i);
        switch (currentChar) {
          case '/': case '\\': case ':': case '?': case '*':
          case '|': case '"': case '<': case '>': case '\0':
            newChars[i] = replacementChar;
            break;
          default:
            newChars[i] = currentChar;
        }
      }
      fileName = new String(newChars);
      return fileName;
    }

    private static String constructAnthemPlanName(String[] planInfo, String originalPlanName){
        String result = originalPlanName;
        if(planInfo.length == 2){
            String planNameWithoutRx = planInfo[0];
            String rx = planInfo[1];

            // remove spaces;
            planNameWithoutRx = removeExtraSpaces(planNameWithoutRx);
            rx = removeExtraSpaces(rx);

            if(rx.startsWith(":")){
                rx = substring(rx, 1);
            }

            result = planNameWithoutRx + " Rx:" + rx;
        }
        return result;
    }

    public static String getStandardAnthemPlanName(String planName){
        String result = planName;
        if(planName == null){
            return null;
        }else{
            planName = removeExtraSpaces(planName);
            if(containsIgnoreCase(planName, "Rx:")){
                result = constructAnthemPlanName(planName.split("Rx:"), planName);
            }else if(containsIgnoreCase(planName, "Rx :")){
                result = constructAnthemPlanName(planName.split("Rx :"), planName);
            }else{
                result = removeExtraSpaces(planName);
            }
        }
        return result;
    }

    public static <T> T getValueOrDefault(T value, T defaultValue) {
        return value == null ? defaultValue : value;
    }
}

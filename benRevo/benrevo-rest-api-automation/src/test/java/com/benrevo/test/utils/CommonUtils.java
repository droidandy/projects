package com.benrevo.test.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class CommonUtils {
	public static final Random RANDOM = new Random();
	public static final String REGEX = "(?i)(\\\"[a-zA-Z0-9^\\\"]*id\\\"\\s*:\\s*)(\\\"{0,1}\\d{1,}\\\"{0,1})";

	public static String stripIds(Object obj1) {
		Gson gson = new GsonBuilder().create();
		String string1 = gson.toJson(obj1);
		return StringUtils.replacePattern(string1, REGEX, "$1null");

	}
	public static String stripIds(String obj1) {
		return StringUtils.replacePattern(obj1, REGEX, "$1null");

	}
	public static boolean getRandomBooleanValue() {
		return RANDOM.nextBoolean();
	}

	public static String getLastUpdatedTimeStamp(String format) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		String formattedDate = sdf.format(date);
		return formattedDate;
	}
}

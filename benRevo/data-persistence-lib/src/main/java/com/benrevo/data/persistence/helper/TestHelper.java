package com.benrevo.data.persistence.helper;

import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.StringHelper;
import com.benrevo.data.persistence.dao.*;
import com.benrevo.data.persistence.entities.*;

/**
 * Internal use, for testing purposes only.
 */
public class TestHelper {

	//Trigger build

	private static final String EMAIL_PREFIX = "test_";
	private static final String DOMAIN = "@benrevo.com";

	private static String getTimeStamp() {
		return StringHelper.generateToken(DateHelper.getFormatedTimestampForDB());
	}

	public static String getToken() {
		return getToken(DateHelper.getFormatedTimestampForDB());
	}

	public static String getToken(String key) {
		return StringHelper.generateToken(key);
	}

	public static String getEmail() {
		return getEmail(getTimeStamp());
	}

	public static String getEmail(String str) {
		return EMAIL_PREFIX + str + DOMAIN;
	}
}

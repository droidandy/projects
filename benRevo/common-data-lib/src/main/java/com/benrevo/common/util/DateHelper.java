package com.benrevo.common.util;

import static com.benrevo.common.Constants.MDY_SLASH_DATE_FORMAT;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class DateHelper {

    private static final Logger LOGGER = LogManager.getLogger(DateHelper.class);
    
    private static DateFormat createUTCDateFormatter(String format) {
    	DateFormat dateFormat = new SimpleDateFormat(format);
    	dateFormat.setTimeZone(TimeZone.getTimeZone("America/Los_Angeles"));
    	return dateFormat;
    }

    public static String fromDateToString(Date date) {
        if(date == null){
            return null;
        }
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        return month + "/" + day + "/" + year;
    }

    public static Date fromStringToDate(String date) {
        DateFormat dateFormat = createUTCDateFormatter(MDY_SLASH_DATE_FORMAT);
        try {
            return dateFormat.parse(date);
        } catch (ParseException e) {
            LOGGER.info("Exception in fromStringToDate", e);
        }

        return null;
    }

    public static String fromDateToString(Date date, String format) {
        DateFormat dateFormat = createUTCDateFormatter(format);
        try {
            return dateFormat.format(date);
        } catch (Exception e) {
            LOGGER.info("Exception in fromDateToString", e);
        }

        return "";
    }

    public static Date fromStringToDate(String date, String format) {
        DateFormat dateFormat = createUTCDateFormatter(format);
        try {
            return dateFormat.parse(date);
        } catch (ParseException e) {
            LOGGER.info("Exception in fromStringToDate", e);
        }

        return null;
    }

    public static String fromStringToStringFormat(String fromDate, String fromFormat, String toFormat) {
        DateFormat fromDateFormat = createUTCDateFormatter(fromFormat);
        DateFormat toDateFormat = createUTCDateFormatter(toFormat);

        try {
            Date date = fromDateFormat.parse(fromDate);
            return toDateFormat.format(date);
        } catch (ParseException e) {
            LOGGER.info("Exception in fromStringToStringFormat", e);
        }

        return null;
    }

    public static String getFormatedTimestampForDB() {
        DateFormat dateFormat = createUTCDateFormatter("yyyyMMdd_HHmmssSSS");
        try {
            return dateFormat.format(Calendar.getInstance().getTime());
        } catch (Exception e) {
            LOGGER.info("Exception in getFormatedTimestampForDB", e);
        }

        return null;
    }
}

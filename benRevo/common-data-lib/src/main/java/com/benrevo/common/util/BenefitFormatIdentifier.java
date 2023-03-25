package com.benrevo.common.util;

/**
 * Created by lemdy on 7/26/17.
 */
public class BenefitFormatIdentifier {

    private String value;
    private String format;
    private String benValue;

    public BenefitFormatIdentifier(String value) {
        this.value = value;
    }

    public String getFormat() {
        return format;
    }

    public String getBenValue() {
        return benValue;
    }

    public BenefitFormatIdentifier invoke() {
        try {
            if (value == null || value.length() == 0) {
                format = "STRING";
                benValue = "";
            } else if (value.equalsIgnoreCase("n/a")) {
                format = "STRING";
                benValue = "N/A";
            }else if (value.equalsIgnoreCase("not covered")) {
                format = "STRING";
                benValue = "Not Covered";
            } else if (value.startsWith("$")) {
                format = "DOLLAR";
                benValue = value.substring(1).replace(",", "");
                try {
                    Float.parseFloat(benValue);
                } catch (Exception e) {
                    //LOGGER.info("Found DOLLAR sign but is not number value: " + value + ", is valid?");
                    throw e;
                }
            } else if (value.endsWith("%")) {
                format = "PERCENT";
                benValue = value.substring(0, value.length()-1);
                try {
                    Float.parseFloat(benValue);
                } catch (Exception e) {
                    //LOGGER.info("Found PERCENT sign but is not number value: " + value + ", is valid?");
                    throw e;
                }
            } else if (value.endsWith("x") || value.endsWith("X")) {
                format = "MULTIPLE";
                benValue = value.substring(0, value.length()-1);
                try {
                    Float.parseFloat(benValue);
                } catch (Exception e) {
                    //LOGGER.error("Bad benefit value, found MULTIPLE sign but is not number value: " + value + ", is valid?");
                    throw e;
                }
            } else {
                format = "NUMBER";
                benValue = value.replaceAll(",", "");
                Float.parseFloat(value);
            }
        } catch (Exception e) {
            format = "STRING";
            benValue = value;
        }
        return this;
    }
}

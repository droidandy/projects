package com.benefit.data.util;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;

public class BenefitUtil {

    /**
     * Turns a String into a Double.
     */
    public static Double getDoubleFromString(String stringDouble) throws NumberFormatException {
        Double returnDouble = null;
        if (stringDouble != null && stringDouble.length() != 0) {
            NumberFormat numFormat = DecimalFormat.getNumberInstance();
            if (numFormat instanceof DecimalFormat) {
                DecimalFormat decFormat = (DecimalFormat) numFormat;
                Number parsedNumber = null;
                try {
                    parsedNumber = decFormat.parse(stringDouble);
                    if (parsedNumber instanceof Double) {
                        returnDouble = (Double) parsedNumber;
                    } else if (parsedNumber instanceof Long) {
                        returnDouble = ((Long) parsedNumber).doubleValue();
                    } else {
                        String cleanedStringDouble = stringDouble.replace(",", "");  // remove commas
                        returnDouble = Double.parseDouble(cleanedStringDouble);
                    }
                } catch (ParseException pe) {
                    System.out.println("Unalbe to parse Double with DecimalFormat: " + stringDouble + ". " + pe.getMessage());
                }
            }
        }
        return returnDouble;
    }
}

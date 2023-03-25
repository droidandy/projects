package com.benrevo.be.modules.rfp.util;


import com.benrevo.common.Constants;

public class RfpTypeValidator {
    public static boolean checkType(String type) {
        return type != null && (type.equals(Constants.MEDICAL) || type.equals(Constants.DENTAL) || type.equals(Constants.VISION) 
        		|| type.equals(Constants.LIFE) || type.equals(Constants.STD) || type.equals(Constants.LTD));
    }
}

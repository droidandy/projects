package com.benrevo.common.enums;

public enum RfpQuoteAttributeName {
	WELLNESS_BUDGET("Wellness budget"),
	COMMUNICATION_BUDGET("Communication Budget"),
	IMPLEMENTATION_BUDGET("Implementation Budget");

    private String displayName;

    RfpQuoteAttributeName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static RfpQuoteAttributeName getEnum(String value) {
        for(RfpQuoteAttributeName name : values()) {
            if(name.getDisplayName().equals(value)) {
                return name;
            }
        }
        throw new IllegalArgumentException("Can't find enum constant for DisplayName=" + value);
    }

    public String getDisplayName() {
        return displayName;
    }
}
	

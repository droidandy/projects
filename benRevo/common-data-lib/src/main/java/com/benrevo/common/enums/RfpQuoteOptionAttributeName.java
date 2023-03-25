package com.benrevo.common.enums;

public enum RfpQuoteOptionAttributeName {
	STARTING_TOTAL("Starting Total");

    private String displayName;

    RfpQuoteOptionAttributeName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static RfpQuoteOptionAttributeName getEnum(String value) {
        for(RfpQuoteOptionAttributeName name : values()) {
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
	

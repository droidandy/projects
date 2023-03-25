package com.benrevo.common.enums;

public enum QuotePlanAttributeName {
	CONTRACT_LENGTH("Contract Length"),
	PROGRAM("Program"),
    DOLLAR_RX_RATE("Dollar Rx Rate");
    
    private String displayName;
    
    QuotePlanAttributeName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static QuotePlanAttributeName getEnum(String value) {
        for(QuotePlanAttributeName name : values()) {
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
	

package com.benrevo.common.enums;

public enum CompetitiveInfoOption {
	
    DIFFERENCE("% difference vs current"),
    PRODUCTS_OFFERED("Products offered"), 
    WELLNESS_OFFERED("Wellness offered"),
    BONUS_OFFERED("Bonus offered"),
    OTHER("Other");
    
    private String displayName;
    
    CompetitiveInfoOption(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static CompetitiveInfoOption getEnum(String value) {
        for(CompetitiveInfoOption name : values()) {
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
	

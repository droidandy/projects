package com.benrevo.common.enums;

public enum DocumentAttributeName {
    BENEFIT_SUMMARY("Benefit Summary"),
    DOCUMENT_HUB("Document Hub"),
    DOCUMENT_HUB_NORTH_CAL_HMO("Document Hub North Cal HMO"),
    DOCUMENT_HUB_SOUTH_CAL_HMO("Document Hub South Cal HMO");
    
    private String displayName;
    
    DocumentAttributeName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static DocumentAttributeName getEnum(String value) {
        for(DocumentAttributeName name : values()) {
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
	

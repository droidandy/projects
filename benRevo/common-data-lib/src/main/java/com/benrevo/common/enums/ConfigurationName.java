package com.benrevo.common.enums;

public enum ConfigurationName {
    OVERDUE_NOTIFICATION_THRESHOLD("Overdue Notification Threshold"),
    RUN_REMINDER_SERVICE("Run reminder service");
    
    private String displayName;
    
    ConfigurationName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static ConfigurationName getEnum(String value) {
        for(ConfigurationName name : values()) {
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
	

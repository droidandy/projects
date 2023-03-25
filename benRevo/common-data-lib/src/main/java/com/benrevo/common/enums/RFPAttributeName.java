package com.benrevo.common.enums;

public enum RFPAttributeName {
	FIXED_UW_COMMENTS("Comments to UW"),
	TEXT_UW_COMMENTS("Additional Comments to UW"),
	KAISER_OR_SIMNSA("Kaiser or SIMNSA"),
	VALID_WAIVERS("Valid waivers"),
	INVALID_WAIVERS("Invalid waivers"),
	TOTAL_EMPLOYEES("Total Employees"),
	FACTOR_LOAD_TAKEOVER_HMO("First-Adjustment Factor Load (Takeover)"),
	FACTOR_LOAD_TAKEOVER_PPO("First-Adjustment Factor Load (Takeover)"),
	FACTOR_LOAD_ALONGSIDE_HMO("First-Adjustment Factor Load (Alongside Kaiser)"),
	FACTOR_LOAD_ALONGSIDE_PPO("First-Adjustment Factor Load (Alongside Kaiser)"),
	TYPE_OF_PLAN("Type of plan"),
	CONTRACT_LENGTH_12_MONTHS("Contract Length: 12 months"),
	CONTRACT_LENGTH_24_MONTHS("Contract Length: 24 months"),
	QUOTING_SCENARIOS("Dental Quoting Scenarios"),
	DENTAL_PARTICIPATION("Dental Participation"),
	CENSUS_PASSWORD("Census Password");
    
    private String displayName;
    
    RFPAttributeName(String displayName) {
        this.displayName = displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    public static RFPAttributeName getEnum(String value) {
        for(RFPAttributeName name : values()) {
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
	

package com.benrevo.common.enums;

public enum QuoteType {
	EASY,
	KAISER,
	STANDARD,
    BEYOND_BENEFIT_TRUST_PROGRAM,
    TECHNOLOGY_TRUST_PROGRAM,
    CLSA_TRUST_PROGRAM,
	CLEAR_VALUE,
	KAISER_EASY,
	DECLINED;
    
    public static boolean isTrustProgramType(QuoteType quoteType) {
        return quoteType == BEYOND_BENEFIT_TRUST_PROGRAM || quoteType == TECHNOLOGY_TRUST_PROGRAM
            || quoteType == CLSA_TRUST_PROGRAM;
    }
}
	

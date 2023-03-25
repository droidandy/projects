package com.benrevo.be.modules.shared.service.cache;

public enum CacheKeyType {
	RFP_QUOTE_OPTION("rfp_quote_option");
    
    private String keyPrefix;
    
    CacheKeyType(String keyPrefix) {
        this.keyPrefix = keyPrefix;
    }
    
    @Override
    public String toString() {
        return keyPrefix;
    }

    public String getKeyPrefix() {
        return keyPrefix;
    }

    public void setKeyPrefix(String keyPrefix) {
        this.keyPrefix = keyPrefix;
    }

}
	

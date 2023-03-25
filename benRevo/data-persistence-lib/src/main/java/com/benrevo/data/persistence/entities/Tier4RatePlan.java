package com.benrevo.data.persistence.entities;

public interface Tier4RatePlan {

	PlanNameByNetwork getPnn();
	 
	void setTier1Rate(Float tier1Rate);

	void setTier2Rate(Float tier2Rate);

	void setTier3Rate(Float tier3Rate);

	void setTier4Rate(Float tier4Rate);
	
	Float getTier1Rate();
	
	Float getTier2Rate();
	
	Float getTier3Rate();
	
	Float getTier4Rate();

	default Integer calcRatingTiers() {
        Integer ratingTiers = 4; // default if all rates is null or 0
        if(getTier4Rate() != null && getTier4Rate() > 0f) {
            ratingTiers = 4;
        } else if(getTier3Rate() != null && getTier3Rate() > 0f) {
            ratingTiers = 3;
        } else if(getTier2Rate() != null && getTier2Rate() > 0f) {
            ratingTiers = 2;
        } else if(getTier1Rate() != null && getTier1Rate() > 0f) {
            ratingTiers = 1;
        }
        return ratingTiers;
    }
}
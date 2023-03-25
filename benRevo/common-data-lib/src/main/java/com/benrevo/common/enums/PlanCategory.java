package com.benrevo.common.enums;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

public enum PlanCategory {

	MEDICAL("HMO", "PPO", "HSA"),
	DENTAL("DHMO", "DPPO"),
	VISION("VISION"),
    LIFE("LIFE"),
    VOL_LIFE("VOL_LIFE"),
    STD("STD"),
    VOL_STD("VOL_STD"),
    LTD("LTD"),
    VOL_LTD("VOL_LTD");
	
	private final List<String> planTypes;

	private PlanCategory(String... planTypes) {
		this.planTypes = Collections.unmodifiableList(Arrays.asList(planTypes));
	}

	public List<String> getPlanTypes() {
		return planTypes;
	}

	public static PlanCategory findByPlanType(String planType) {
		for (PlanCategory pc : PlanCategory.values()) {
			if (pc.planTypes.contains(planType)) {
				return pc;
			}
		}
		return null;
	}
	
	public static boolean isAncillary(String category) {
		return PlanCategory.valueOf(category).isAncillary();
	}
	
	public boolean isAncillary() {
		return this == LIFE || this == VOL_LIFE || this == STD || this == VOL_STD 
				|| this == LTD || this == VOL_LTD;
	}
}
	

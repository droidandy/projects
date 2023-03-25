package com.benrevo.be.modules.shared.service.pptx;

import java.util.ArrayList;
import java.util.List;


public class Option {
    public float employer = 0f;
    public float total = 0f;
    public float annualEmployer = 0f;
    public float annualTotal = 0f;
    public long enrollment = 0L;
    public String carrierDisplayName = "";
    public String carrierAmBestRating = "";
    public List<PrepPlan> plans = new ArrayList<>();
    public String name;
    public List<Option> duplicateOptions = new ArrayList<>();
    public String notes;
    //public String quoteOptionName;
    public List<String> carriers = new ArrayList<>();
    public boolean isDuplicate = false;
    public float discountPercent = 0f;
    public float discount = 0f;
}

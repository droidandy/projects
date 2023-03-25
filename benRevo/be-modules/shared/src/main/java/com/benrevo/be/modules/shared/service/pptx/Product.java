package com.benrevo.be.modules.shared.service.pptx;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.tuple.Pair;


public class Product {
    public String prefix;
    public String category;
    public int ratingTiers;
    public List<Pair<String, String>> binding = new ArrayList<>();
    public int pageNum = 0; // for renewal analysis
    public List<String> currentCarriers = new ArrayList<>();
    public boolean isCarrierNameAppCarrier;
    public boolean isRenewal;

    public Option current = new Option();
    public Option renewal = new Option();

    public AlternativesHolder alternatives = new AlternativesHolder();
    public AlternativesHolder renewalAlternatives = new AlternativesHolder();

    public Product(String prefix, String category) {
        this.prefix = prefix;
        this.category = category;
    }
}

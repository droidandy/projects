package com.benrevo.be.modules.shared.service.pptx;

import com.benrevo.common.Constants;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public class Data {
    public static final String MEDICAL_PREFIX = "m";
    public static final String DENTAL_PREFIX = "d";
    public static final String VISION_PREFIX = "v";
    public static final String LIFE_PREFIX = "f";
    public static final String VOL_LIFE_PREFIX = "h";
    public static final String STD_PREFIX = "s";
    public static final String LTD_PREFIX = "l";

    public Product medical = new Product(MEDICAL_PREFIX, Constants.MEDICAL);
    public Product dental = new Product(DENTAL_PREFIX, Constants.DENTAL);
    public Product vision = new Product(VISION_PREFIX, Constants.VISION);
    public Product life = new Product(LIFE_PREFIX, Constants.LIFE);
    public Product volLife = new Product(VOL_LIFE_PREFIX, "VOL_LIFE");
    public Product ltd = new Product(LTD_PREFIX, Constants.LTD);
    public Product std = new Product(STD_PREFIX, Constants.STD);
    public List<Product> products = Collections.unmodifiableList(
        Stream.of(medical, dental, vision, life, volLife, ltd, std).collect(Collectors.toList()));
}

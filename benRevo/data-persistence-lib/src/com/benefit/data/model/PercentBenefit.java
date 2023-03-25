package com.benefit.data.model;

public class PercentBenefit extends Benefit {
    public PercentBenefit(int value) {
        super(value, Benefit.Format.PERCENT);
    }
}

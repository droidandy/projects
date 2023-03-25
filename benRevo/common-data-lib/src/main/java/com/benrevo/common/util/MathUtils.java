package com.benrevo.common.util;

import java.util.Arrays;
import java.util.Collection;
import org.apache.commons.math3.stat.descriptive.rank.Median;
import org.apache.commons.math3.stat.descriptive.rank.Percentile.EstimationType;

public class MathUtils {
    
    private static Median median = new Median()
        .withEstimationType(EstimationType.R_7); // R_7 implements Microsoft Excel style 
	
	private MathUtils() {}
	
	/**
	 * Calculate the difference in percentage between newValue and curValue.
	 * The result will be rounded using specified precision
	 * 
	 * @param newValue first value
	 * @param curValue second value
	 * @param precision number of decimals for rounding
	 * @return positive value if newValue is greate then curValue and negative otherwise
	 */
	public static double diffPecent(double newValue, double curValue, int precision) {
	    if(curValue == 0){
	        return 100.0;
        }

	    double result = (newValue / curValue - 1.0) * 100.0;
		return round(result, precision);
	}
	/**
	 * @deprecated use {@link #diffPecent(double, double, int)}
	 */
	public static float diffPecent(float newValue, float curValue, int precision) {
		return (float) diffPecent((double) newValue, (double) curValue, precision);
	}
	
	/**
	 * @deprecated use {@link #round(double, int)}
	 */
	public static float round(float value, int precision) {	
		return (float) round((double) value, precision);
	}
	
	/**
     * Round float value using specified precision
     * 
     * @param value
     * @param precision number of decimals for rounding
     * @return
     */
	public static double round(double value, int precision) {    
	    double decimal;
        switch (precision) {
        case 0:
            return Math.round(value);
        case 1:
            decimal = 10.0;
            break;
        case 2:
            decimal = 100.0;
            break;
        default:
            decimal = Math.pow(10, precision);
        }
        /* From Math.round() javadoc: "... rounding to positive infinity"
         * As result we get unexpected value in boundary cases:
         * Example: round(-1.025, 2) return -1.02, but we want to get -1.03
         * So we need to apply Math.round() for abs() value to get "correct" result 
         */
        if (value < 0) { // abs() rounding for negative value 
            return -Math.round(-value * decimal) / decimal;
        } else {
            return Math.round(value * decimal) / decimal;
        }
    }
	
	/**
	 * Find value closest below to <code>sought</code> in <code>variants</code>
	 * 
	 * @param sought
	 * @param variants - values to search
	 * @return
	 */
	public static float findClosest(float sought, Collection<Float> variants) {	
		if (variants.isEmpty()) {
			throw new IllegalArgumentException("Input list is empty");
		}
		Float[] sorted = new Float[variants.size()];
		variants.toArray(sorted);
		Arrays.sort(sorted);
		
		float min = Float.MAX_VALUE;
		float closest = sorted[0];

	    for (float v : sorted) {
	        float diff = Math.abs(v - sought);
	        if (diff < min) {
	            min = diff;
	            closest = v;
	        }
	    }
	    return closest;
	}
	
	public static float getDiscountFactor(final float discountPercent) {
        if (discountPercent == 0.0f || discountPercent < 0.01f) {
            return 1.0f;
        } else { // 0.5%, 2%, 50%, etc
            // 0.5% -> 0.005, 2% -> 0.02, 50% -> 0.5
            return  (100.0f - discountPercent) / 100.0f; 
        }
    }
	
	public static float median(final double[] values) {
	    return (float) median.evaluate(values);
    }
	
}

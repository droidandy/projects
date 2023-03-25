package com.benefit.data.compare;

import java.security.InvalidParameterException;

import com.benefit.data.model.Benefit;

public class BenefitComparer {

    public static Comparer getComparer(Benefit b) {
        Comparer c = null;
        Benefit.Format format = b.getFormat();

        switch (format) {
            case NUMBER:
            case DOLLAR:
            case MULTIPLE:
                c = new DollarComparer();
                break;
            case PERCENT:
                c = new PercentComparer();
                break;
            default:
                throw new InvalidParameterException("Unrecognized format: " + format);
        }
        return c;
    }
}

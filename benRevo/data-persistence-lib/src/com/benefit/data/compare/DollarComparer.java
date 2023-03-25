package com.benefit.data.compare;

import com.benefit.data.model.Benefit;

public class DollarComparer implements Comparer {

    @Override
    public void compare(Benefit base, Benefit compare) {
        double a = base.getValue();
        double b = compare.getValue();
        compare.setDifference((int) (b - a));
        compare.setDiffPercent((a == b) ? 0 : a / b);

        //System.out.println(compare + " xxxxxxx " + base);
    }
}

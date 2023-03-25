package com.benefit.data.compare;

import java.util.List;

import com.benefit.data.model.Benefit;
import com.benefit.data.model.carrier.Plan;

public class PlanComparer {
    public void comparePlans(Plan base, Plan compare) {
        List<Benefit> baseBenefits = base.getBenefits();

        for (Benefit benefit : baseBenefits) {
            //get the correct benefit comparer
            Comparer comparer = BenefitComparer.getComparer(benefit);
            Benefit compareWith = compare.getBenefit(benefit);
            if (null != comparer && null != compareWith) {
                comparer.compare(benefit, compareWith);
            } else {
                System.out.println("Could not find benefit " + benefit.getBenefitNameId() + " in plan ");
            }
        }
    }
}

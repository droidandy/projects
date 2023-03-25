package com.benrevo.be.modules.shared.service.pptx;

import static java.util.Objects.isNull;

import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.LifeClass;
import com.benrevo.data.persistence.entities.ancillary.LtdClass;
import com.benrevo.data.persistence.entities.ancillary.StdClass;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import java.text.NumberFormat;
import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class PptxAncillaryFiller {

    protected static final Logger logger = LoggerFactory.getLogger(PptxAncillaryFiller.class);

    private static final int ALTERNATIVES_PER_PAGE = 3;
    private static final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.CANADA); // show negative with "-"
    private static final NumberFormat currencyFormatterWithFraction = NumberFormat.getCurrencyInstance(Locale.CANADA); // show negative with "-"

    private final Map<String, AncillaryPlanType> expectedPlanTypes = Collections.unmodifiableMap(Stream.of(
        new SimpleEntry<>(Data.LIFE_PREFIX, AncillaryPlanType.BASIC),
        new SimpleEntry<>(Data.VOL_LIFE_PREFIX, AncillaryPlanType.VOLUNTARY),
        new SimpleEntry<>(Data.STD_PREFIX, AncillaryPlanType.BASIC),
        new SimpleEntry<>(Data.LTD_PREFIX, AncillaryPlanType.BASIC)
    ).collect(Collectors.toMap(SimpleEntry::getKey, SimpleEntry::getValue)));
    
    private final Map<String, AncillaryClassFiller> fillAncillaryMethods = Collections.unmodifiableMap(Stream.of(
        new SimpleEntry<String, AncillaryClassFiller>(Data.LIFE_PREFIX, this::fillBasicLifeClass),
        new SimpleEntry<String, AncillaryClassFiller>(Data.VOL_LIFE_PREFIX, this::fillVoluntaryLifeClass),
        new SimpleEntry<String, AncillaryClassFiller>(Data.STD_PREFIX, this::fillBasicStdClass),
        new SimpleEntry<String, AncillaryClassFiller>(Data.LTD_PREFIX, this::fillBasicLtdClass)
        ).collect(Collectors.toMap(SimpleEntry::getKey, SimpleEntry::getValue)));

    private final Map<String, Object> viewData;
    private final Data data;
    private final boolean forCarrierSite;


    private PptxAncillaryFiller(Map<String, Object> viewData,  Data data, boolean forCarrierSite){
        this.viewData = viewData;
        this.data = data;
        this.forCarrierSite = forCarrierSite;
        currencyFormatter.setMaximumFractionDigits(0);
        currencyFormatterWithFraction.setMaximumFractionDigits(2);
    }

    public static void fillAncillary(Map<String, Object> viewData, Data data, boolean forCarrierSite) {
        new PptxAncillaryFiller(viewData, data, forCarrierSite).fillAncillary();
    }

    private void fillAncillary(){
        fillAncillaryCurrent(data.life);
        fillAncillaryRenewal(data.life);
        fillAncillaryClasses(data.life, data.life.current, "0");
        fillAncillaryClasses(data.life, data.life.renewal, "1");
        fillAncillaryAlternativesClasses(data.life, data.life.renewalAlternatives);
        fillAncillaryAlternativesClasses(data.life, data.life.alternatives);

        fillAncillaryCurrent(data.volLife);
        fillAncillaryRenewal(data.volLife);
        fillAncillaryClasses(data.volLife, data.volLife.current, "3");
        fillAncillaryClasses(data.volLife, data.volLife.renewal, "4");
        fillAncillaryAlternativesClasses(data.volLife, data.volLife.renewalAlternatives);
        fillAncillaryAlternativesClasses(data.volLife, data.volLife.alternatives);

        fillAncillaryCurrent(data.std);
        fillAncillaryRenewal(data.std);
        fillAncillaryClasses(data.std, data.std.current, "0");
        fillAncillaryClasses(data.std, data.std.renewal, "1");
        fillAncillaryAlternativesClasses(data.std, data.std.renewalAlternatives);
        fillAncillaryAlternativesClasses(data.std, data.std.alternatives);

        fillAncillaryCurrent(data.ltd);
        fillAncillaryRenewal(data.ltd);
        fillAncillaryClasses(data.ltd, data.ltd.current, "0");
        fillAncillaryClasses(data.ltd, data.ltd.renewal, "1");
        fillAncillaryAlternativesClasses(data.ltd, data.ltd.renewalAlternatives);
        fillAncillaryAlternativesClasses(data.ltd, data.ltd.alternatives);
    }
    
    private void fillAncillaryCurrent(Product product) {

        String prefix = product.prefix;
        Option option = product.current;

        if (option.plans.isEmpty() && product.renewal.plans.isEmpty()) {
            viewData.put(prefix + "hide", Pair.of(null, 0)); // hide row
            return;
        }

        viewData.put(prefix + "cc", option.carrierDisplayName);
        if (!forCarrierSite) {
            viewData.put(prefix + "rc", option.carrierAmBestRating);
        }

        viewData.put(prefix + "mc", currencyFormatter.format(option.annualEmployer));
        viewData.put(prefix + "tc", currencyFormatter.format(option.annualTotal));
        viewData.put(prefix + "ec", currencyFormatter.format(0));
    }

    private void fillAncillaryRenewal(Product product) {

        String prefix = product.prefix;
        Option option = product.renewal;

        if (option.plans.isEmpty()) {
            return;
        }

        String renewalName = option.name;
        if (forCarrierSite) {
            if (!option.carrierDisplayName.isEmpty()) {
                renewalName += " (" + option.carrierDisplayName + ")";
            }
            viewData.put(prefix + "id", currencyFormatter.format(option.discount));
        }
        viewData.put(prefix + "cn", renewalName);
        viewData.put(prefix + "rn", option.carrierAmBestRating);

        viewData.put(prefix + "mn", currencyFormatter.format(option.annualEmployer));
        viewData.put(prefix + "tn", currencyFormatter.format(option.annualTotal));
        viewData.put(prefix + "en", currencyFormatter.format(0));

        viewData.put(prefix + "dn", currencyFormatter.format(product.renewal.annualTotal - product.current.annualTotal));
        float diff = MathUtils.diffPecent(product.renewal.total, product.current.total, 1);
        viewData.put(prefix + "pn",  diff + "%");
        viewData.put(prefix + "p+n",  ((diff > 0)?"+":"") + diff + "%");

    }

    private void fillAncillaryClasses(Product product,
        Option option, String planPrefix) {

        if (option.plans.isEmpty()) {
            return;
        }

        PrepPlan prepPlan = option.plans.get(0);
        AncillaryPlan ancillaryPlan = prepPlan.ancillary;

        AncillaryPlanType expectedPlanType = expectedPlanTypes.get(product.prefix);
        if (expectedPlanType!= null && !expectedPlanType.equals(ancillaryPlan.getPlanType())) {
            return;
        }

        product.pageNum = ancillaryPlan.getClasses().size();

        for(int classIndex = 0; classIndex < ancillaryPlan.getClasses().size();
            classIndex++) {
            fillAncillaryMethods.get(product.prefix)
                .fill(classIndex, ancillaryPlan, product, option, planPrefix, null);
        }

    }

    private void fillAncillaryAlternativesClasses(Product product, AlternativesHolder alternativesHolder) {
        String pagePrefix = "";
        if (alternativesHolder == product.renewalAlternatives) {
            pagePrefix = AlternativesHolder.RENEWAL_ALTERNATIVE_PREFIX + "-";
        }
        AncillaryClassFiller filler = fillAncillaryMethods.get(product.prefix);
        AncillaryPlan currentAncillaryPlan = null;
        List<PrepPlan> currentPrepPlans = product.current.plans;
        if (!currentPrepPlans.isEmpty()) {
            currentAncillaryPlan = currentPrepPlans.get(0).ancillary;
            AncillaryPlanType expectedPlanType = expectedPlanTypes.get(product.prefix);
            if (expectedPlanType!= null && !expectedPlanType.equals(currentAncillaryPlan.getPlanType())) {
                return;
            }
        }
        List<Integer> pageIndexPerClass = new ArrayList<>();
        List<Integer> altIndexPerClass = new ArrayList<>();
        for (int i = 0; i < alternativesHolder.list.size(); i++) {
            Option option = alternativesHolder.list.get(i);
            if (option != null && !option.plans.isEmpty() && !option.isDuplicate) {
                AncillaryPlan ancillaryPlan = option.plans.get(0).ancillary;
                for(int classIndex = 0; classIndex < ancillaryPlan.getClasses().size();
                    classIndex++)
                {
                    if(pageIndexPerClass.size() == classIndex) {
                        pageIndexPerClass.add(0);
                        altIndexPerClass.add(0);
                        if(currentAncillaryPlan != null) {
                            filler.fill(classIndex, currentAncillaryPlan,
                                product, product.current, "0", pagePrefix + "0"
                            );
                        }
                    }
                    int alternativeIndex = altIndexPerClass.get(classIndex);
                    int pageIndex = pageIndexPerClass.get(classIndex);
                    alternativeIndex++;
                    if(alternativeIndex > ALTERNATIVES_PER_PAGE) {
                        alternativeIndex = 1;
                        pageIndex++;
                        if(currentAncillaryPlan != null) {
                            filler.fill(classIndex, currentAncillaryPlan, product,
                                product.current, "0", pagePrefix + pageIndex
                            );
                        }
                    }
                    altIndexPerClass.set(classIndex, alternativeIndex);
                    pageIndexPerClass.set(classIndex, pageIndex);

                    filler.fill(classIndex, ancillaryPlan, product, option,
                        String.valueOf(alternativeIndex),
                        pagePrefix + pageIndex
                    );
                }
            }
        }
        alternativesHolder.pageNumPerPlan = pageIndexPerClass.stream().map(i -> i + 1)
            .collect(Collectors.toList());
    }

    private void fillAncillaryCommon(int classIndex, AncillaryPlan ancillaryPlan,
        Product product, Option option, String prefix, String pageSuffix) {

        AncillaryRate ancillaryRate = ancillaryPlan.getRates();
        String optionName = BasePptxPresentationService.joinAlternativeNames(option);
        if ((isNull(optionName) || optionName.isEmpty()) && option == product.current) {
            optionName = "Current";
        }
        if (product.renewalAlternatives.list.contains(option)) {
            if (forCarrierSite && !product.isRenewal) {
                viewData.put(product.prefix + "at" + pageSuffix, "New Business");
            } else {
                viewData.put(product.prefix + "at" + pageSuffix, "Renewal");
            }
        } else {
            viewData.put(product.prefix + "at" + pageSuffix, "Marketing");
        }
        viewData.put(prefix + "name" + pageSuffix, optionName);
        viewData.put(prefix + "i" + pageSuffix, Integer.toString(classIndex + 1));
        if(ancillaryPlan.getClasses().size() > classIndex){
            AncillaryClass ancillaryClass = ancillaryPlan.getClasses().get(classIndex);
            viewData.put(prefix + "s" + pageSuffix,  "CLASS " + Integer.toString(classIndex + 1)
                + " - " + ancillaryClass.getName());
        } else {
            viewData.put(prefix + "s" + pageSuffix,  "CLASS " + Integer.toString(classIndex + 1));
        }

        viewData.put(
            prefix + "c" + pageSuffix, ancillaryPlan.getCarrier().getDisplayName());
        viewData.put(prefix + "n" + pageSuffix, ancillaryPlan.getPlanName());
        viewData.put(
            prefix + "rg" + pageSuffix,
            !isNull(ancillaryRate) ? ancillaryRate.getRateGuarantee() : "-"
        );

    }

    private void fillBasicLifeClass(
        int classIndex, AncillaryPlan ancillaryPlan, Product product,
        Option option, String planPrefix, String pagePreSuffix
    ) {
        String prefix = product.prefix + planPrefix;

        String pageSuffix = "-" + classIndex;
        if(pagePreSuffix != null) { pageSuffix = "-" + pagePreSuffix + pageSuffix; }

        fillAncillaryCommon(classIndex, ancillaryPlan, product, option, prefix, pageSuffix);

        LifeClass lifeClass = (LifeClass) (ancillaryPlan.getClasses().size() > classIndex ? ancillaryPlan.getClasses().get(classIndex) : null);
        BasicRate rate = (BasicRate) ancillaryPlan.getRates();

        viewData.put(prefix + "b0" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeBenefitAmount() : "-");
        viewData.put(prefix + "b1" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeMaxBenefit() : "-");
        viewData.put(prefix + "b2" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeGuaranteeIssue() : "-");
        viewData.put(prefix + "b3" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getWaiverOfPremium()) : "-");
        viewData.put(prefix + "b4" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getDeathBenefit()) : "-");
        viewData.put(prefix + "b5" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getConversion()) : "-");
        viewData.put(prefix + "b6" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getPortability()) : "-");

        viewData.put(prefix + "a0" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge65reduction() : "-");
        viewData.put(prefix + "a1" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge70reduction() : "-");
        viewData.put(prefix + "a2" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge75reduction() : "-");
        viewData.put(prefix + "a3" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge80reduction() : "-");

        viewData.put(prefix + "c0" + pageSuffix, !isNull(rate) ? rate.getVolume() : 0f);
        viewData.put(
            prefix + "c1" + pageSuffix,
            currencyFormatterWithFraction.format(!isNull(rate) ? rate.getCurrentLife() : 0f)
        );
        viewData.put(
            prefix + "c2" + pageSuffix,
            currencyFormatterWithFraction.format(!isNull(rate) ? rate.getCurrentADD() : 0f)
        );
        double monthlyCost = !isNull(rate) ?
            rate.getVolume() / 1000.0 * (rate.getCurrentLife() + rate.getCurrentADD()) : 0f;
        viewData.put(prefix + "c3" + pageSuffix, monthlyCost);
        if (option == product.current) {
            viewData.put(prefix + "td" + pageSuffix, "-");
            viewData.put(prefix + "tp" + pageSuffix, "-");
        } else if (!product.current.plans.isEmpty()) {
            BasicRate currentRate =
                (BasicRate) product.current.plans.get(0).ancillary.getRates();
            double monthlyCostCurrent = !isNull(currentRate) ?
                currentRate.getVolume() / 1000.0 * (currentRate.getCurrentLife() + currentRate
                    .getCurrentADD()) : 0.0;
            viewData.put(
                prefix + "td" + pageSuffix,
                currencyFormatterWithFraction.format(monthlyCost - monthlyCostCurrent)
            );
            viewData.put(
                prefix + "tp" + pageSuffix,
                MathUtils.diffPecent(monthlyCost, monthlyCostCurrent, 1) + "%"
            );
        }
    }

    private String replaceToYesNo(String value) {
        if ("true".equalsIgnoreCase(value)) {
            return "Yes";
        }
        if ("false".equalsIgnoreCase(value)) {
            return "No";
        }
        return value;
    }

    private void fillVoluntaryLifeClass(int classIndex, AncillaryPlan ancillaryPlan,
        Product product, Option option, String planPrefix, String pagePreSuffix
    ) {
        String prefix = product.prefix + planPrefix;

        String pageSuffix = "-" + classIndex;
        if(pagePreSuffix != null) { pageSuffix = "-" + pagePreSuffix + pageSuffix; }

        fillAncillaryCommon(classIndex, ancillaryPlan, product, option, prefix, pageSuffix);

        LifeClass lifeClass = (LifeClass) (ancillaryPlan.getClasses().size() > classIndex ? ancillaryPlan.getClasses().get(classIndex) : null);
        VoluntaryRate rate = (VoluntaryRate) ancillaryPlan.getRates();

        viewData.put(prefix + "b0" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeBenefitAmount() : "-");
        viewData.put(prefix + "b1" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeMaxBenefit() : "-");
        viewData.put(
            prefix + "b2" + pageSuffix, !isNull(lifeClass) ? lifeClass.getEmployeeGuaranteeIssue() : "-");
        viewData.put(prefix + "b3" + pageSuffix, !isNull(lifeClass) ? lifeClass.getSpouseBenefitAmount() : "-");
        viewData.put(prefix + "b4" + pageSuffix, !isNull(lifeClass) ? lifeClass.getSpouseMaxBenefit() : "-");
        viewData.put(prefix + "b5" + pageSuffix, !isNull(lifeClass) ? lifeClass.getSpouseGuaranteeIssue() : "-");
        viewData.put(prefix + "b6" + pageSuffix, !isNull(rate) ? rate.getSpouseBased() : "-");
        viewData.put(prefix + "b7" + pageSuffix, !isNull(lifeClass) ? lifeClass.getChildBenefitAmount() : "-");
        viewData.put(prefix + "b8" + pageSuffix, !isNull(lifeClass) ? lifeClass.getChildMaxBenefit() : "-");
        viewData.put(prefix + "b9" + pageSuffix, !isNull(lifeClass) ? lifeClass.getChildGuaranteeIssue() : "-");
        viewData.put(prefix + "b10" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getWaiverOfPremium()) : "-");
        viewData.put(prefix + "b11" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getDeathBenefit()) : "-");
        viewData.put(prefix + "b12" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getConversion()) : "-");
        viewData.put(prefix + "b13" + pageSuffix, !isNull(lifeClass) ? replaceToYesNo(lifeClass.getPortability()) : "-");

        viewData.put(prefix + "a0" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge65reduction() : "-");
        viewData.put(prefix + "a1" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge70reduction() : "-");
        viewData.put(prefix + "a2" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge75reduction() : "-");
        viewData.put(prefix + "a3" + pageSuffix, !isNull(lifeClass) ? lifeClass.getAge80reduction() : "-");

        // FIXME Monthly rates
        //viewData.put(prefix + "4mr", rate);

        viewData.put(prefix + "r1" + pageSuffix, !isNull(rate) ? rate.getRateEmpADD() : 0f);
        viewData.put(prefix + "r2" + pageSuffix, !isNull(rate) ? rate.getRateSpouseADD() : 0f);

        viewData.put(prefix + "r3" + pageSuffix, !isNull(rate) ? rate.getRateChildLife() : 0f);
        viewData.put(prefix + "r4" + pageSuffix, !isNull(rate) ? rate.getRateChildADD() : 0f);

        viewData.put(prefix + "tm" + pageSuffix, !isNull(rate) ? rate.getMonthlyCost() : 0f);
        if(option == product.current) {
            viewData.put(prefix + "td" + pageSuffix, "-");
            viewData.put(prefix + "tp" + pageSuffix, "-");
        } else if(!product.current.plans.isEmpty()) {
            VoluntaryRate currentRate =
                (VoluntaryRate) product.current.plans.get(0).ancillary.getRates();
            viewData.put(prefix + "td" + pageSuffix, currencyFormatterWithFraction.format(
                ((!isNull(rate) ? rate.getMonthlyCost() : 0f) - (!isNull(currentRate)
                                                                 ? currentRate.getMonthlyCost()
                                                                 : 0f))));
            viewData.put(
                prefix + "tp" + pageSuffix, MathUtils.diffPecent(
                    (!isNull(rate) ? rate.getMonthlyCost() : 0f),
                    (!isNull(currentRate) ? currentRate.getMonthlyCost() : 0f), 1
                ) + "%");
        }
    }

    private void fillBasicStdClass(int classIndex, AncillaryPlan ancillaryPlan, Product product,
        Option option, String planPrefix, String pagePreSuffix
    ) {
        String prefix = product.prefix + planPrefix;

        String pageSuffix = "-" + classIndex;
        if(pagePreSuffix != null) { pageSuffix = "-" + pagePreSuffix + pageSuffix; }

        fillAncillaryCommon(classIndex, ancillaryPlan, product, option, prefix, pageSuffix);

        StdClass stdClass = (StdClass) (ancillaryPlan.getClasses().size() > classIndex ? ancillaryPlan.getClasses().get(classIndex) : null);
        BasicRate rate = (BasicRate) ancillaryPlan.getRates();

        viewData.put(prefix + "b0" + pageSuffix, !isNull(stdClass) ? stdClass.getWeeklyBenefit() : "-");
        viewData.put(prefix + "b1" + pageSuffix, !isNull(stdClass) ? stdClass.getMaxWeeklyBenefit() : "-");
        viewData.put(prefix + "b2" + pageSuffix, !isNull(stdClass) ? stdClass.getMaxBenefitDuration() : "-");
        viewData.put(prefix + "b3" + pageSuffix, !isNull(stdClass) ? stdClass.getWaitingPeriodAccident() : "-");
        viewData.put(prefix + "b4" + pageSuffix, !isNull(stdClass) ? stdClass.getWaitingPeriodSickness() : "-");

        viewData.put(prefix + "c0" + pageSuffix, !isNull(rate) ? rate.getVolume() : 0f);
        viewData.put(
            prefix + "c1" + pageSuffix,
            currencyFormatterWithFraction.format(!isNull(rate) ? rate.getCurrentSL() : 0f)
        );
        double monthlyCost = !isNull(rate) ? rate.getVolume() / 10.0 * rate.getCurrentSL() : 0.0;
        viewData.put(prefix + "c2" + pageSuffix, monthlyCost);
        if (option == product.current) {
            viewData.put(prefix + "td" + pageSuffix, "-");
            viewData.put(prefix + "tp" + pageSuffix, "-");
        } else if (!product.current.plans.isEmpty()) {
            BasicRate currentRate =
                (BasicRate) product.current.plans.get(0).ancillary.getRates();
            double monthlyCostCurrent = !isNull(currentRate) ?
                currentRate.getVolume() / 10.0 * currentRate.getCurrentSL() : 0.0;
            viewData.put(
                prefix + "td" + pageSuffix,
                currencyFormatterWithFraction.format(monthlyCost - monthlyCostCurrent)
            );
            viewData.put(
                prefix + "tp" + pageSuffix,
                MathUtils.diffPecent(monthlyCost, monthlyCostCurrent, 1) + "%"
            );
        }
    }

    private void fillBasicLtdClass(int classIndex, AncillaryPlan ancillaryPlan, Product product,
        Option option, String planPrefix, String pagePreSuffix
    ) {

        String prefix = product.prefix + planPrefix;
        String pageSuffix = "-" + classIndex;
        if(pagePreSuffix != null) { pageSuffix = "-" + pagePreSuffix + pageSuffix; }

        fillAncillaryCommon(classIndex, ancillaryPlan, product, option, prefix, pageSuffix);

        LtdClass ltdClass = (LtdClass) (ancillaryPlan.getClasses().size() > classIndex ? ancillaryPlan.getClasses().get(classIndex) : null);
        BasicRate rate = (BasicRate) ancillaryPlan.getRates();

        viewData.put(prefix + "b0" + pageSuffix, !isNull(ltdClass) ? ltdClass.getMonthlyBenefit() : "-");
        viewData.put(prefix + "b1" + pageSuffix, !isNull(ltdClass) ? ltdClass.getMaxBenefit() : "-");
        viewData.put(prefix + "b2" + pageSuffix, !isNull(ltdClass) ? ltdClass.getMaxBenefitDuration() : "-");
        viewData.put(prefix + "b3" + pageSuffix, !isNull(ltdClass) ? ltdClass.getEliminationPeriod() : "-");
        viewData.put(prefix + "b4" + pageSuffix, !isNull(ltdClass) ? ltdClass.getOccupationDefinition() : "-");
        viewData.put(prefix + "b5" + pageSuffix, !isNull(ltdClass) ? ltdClass.getConditionExclusion() : "-");
        viewData.put(prefix + "b6" + pageSuffix, !isNull(ltdClass) ? ltdClass.getAbuseLimitation() : "-");
        viewData.put(prefix + "b7" + pageSuffix, !isNull(ltdClass) ? ltdClass.getPremiumsPaid() : "-");
        //viewData.put(prefix + "b8" + pageSuffix, ltdClass);
        //viewData.put(prefix + "b9" + pageSuffix, ltdClass);

        viewData.put(prefix + "c0" + pageSuffix, !isNull(rate) ? rate.getVolume() : 0f);
        viewData.put(
            prefix + "c1" + pageSuffix,
            currencyFormatterWithFraction.format(!isNull(rate) ? rate.getCurrentSL() :0f)
        );
        double monthlyCost = !isNull(rate) ? rate.getVolume() / 100.0 * rate.getCurrentSL() :0.0;
        viewData.put(prefix + "c2" + pageSuffix, monthlyCost);
        if (option == product.current) {
            viewData.put(prefix + "td" + pageSuffix, "-");
            viewData.put(prefix + "tp" + pageSuffix, "-");
        } else if (!product.current.plans.isEmpty()) {
            BasicRate currentRate =
                (BasicRate) product.current.plans.get(0).ancillary.getRates();
            double monthlyCostCurrent = !isNull(currentRate) ? currentRate.getVolume() / 100.0
                * currentRate.getCurrentSL() : 0.0;
            viewData.put(
                prefix + "td" + pageSuffix,
                currencyFormatterWithFraction.format(monthlyCost - monthlyCostCurrent)
            );
            viewData.put(
                prefix + "tp" + pageSuffix,
                MathUtils.diffPecent(monthlyCost, monthlyCostCurrent, 1) + "%"
            );
        }
    }

    @FunctionalInterface
    interface AncillaryClassFiller {
        void fill(
            int classIndex, AncillaryPlan ancillaryPlan, Product product,
            Option option, String planPrefix, String pagePreSuffix
        );
    }
}

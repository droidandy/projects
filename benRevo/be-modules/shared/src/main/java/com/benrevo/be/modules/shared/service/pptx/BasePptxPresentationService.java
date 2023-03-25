package com.benrevo.be.modules.shared.service.pptx;

import static com.benrevo.common.util.MapBuilder.field;

import com.amazonaws.util.IOUtils;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.MarketingList;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.MarketingListRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BasePptxPresentationService {

    private static final String ALTERNATIVE_NAME_PREFIX = "Alternative ";
    private static final int MONTHS_IN_YEAR = 12;
    private static final int ALTERNATIVES_PER_PAGE = 3;
    private static final int PLANS_PER_PAGE = 4;

    protected static final Logger logger = LoggerFactory.getLogger(BasePptxPresentationService.class);

    protected final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.CANADA); // show negative with "-"
    private final NumberFormat currencyFormatterWithFraction = NumberFormat.getCurrencyInstance(Locale.CANADA); // show negative with "-"
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("MMMMM d, yyyy");

    @Autowired
    private BasePptxDataPreparationService basePptxDataPreparationService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private MarketingListRepository marketingListRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Autowired
    @Lazy
    private BasePptxPresentationService self;

    private final String[] DHMO_BENEFITS_NAME = new String[] {
            "Oral Examination",
            "Adult Prophylaxis (Cleaning)",
            "Child Prophylaxis (Cleaning)",
            "Silver Filling One Surface",
            "White Filling One Surface Anterior",
            "Molar Root Canal",
            "Perio Maintainance",
            "Simple Extraction of Erupted",
            "Orthodontia Services Adults",
            "Orthodontia Services Children"
    };

    private final String[] DPPO_BENEFITS_NAME = new String[] {
            "Calendar Year Maximum",
            "Individual Deductible",
            "Family Deductible",
            "Waived for Preventive",
            "Class I - Preventive",
            "Class II - Basic",
            "Class III - Major",
            "Class IV - Orthodontia",
            "Orthodontia Lifetime Max",
            "Ortho Eligibility",
            "Dental Reimbursement Schedule",
            "Implant Coverage"};

            /*,
            
            "ORAL_EXAMINATION",
            "ADULT_PROPHY", 
            "CHILD_PROPHY", 
            "SILVER_FILL_1_SURFACE",
            "WHITE_FILL_1_SURFACE_ANTERIOR", 
            "MOLAR_ROOT_CANAL",
            "PERIO_MAINTAINANCE",
            "SIMPLE_EXTRACTION_ERUPTED_TOOTH",
            "ORTHO_SERVICES_ADULTS",
            "ORTHO_SERVICES_CHILDREN"
    };*/


    public BasePptxPresentationService() {
        currencyFormatter.setMaximumFractionDigits(0);
        currencyFormatterWithFraction.setMaximumFractionDigits(2);
    }

    public Data fillData(Map<String, Object> viewData, Client client, boolean forCarrierSite) {

        Data data = basePptxDataPreparationService.prepareData(client);
        
        // put data
        viewData.put("client_name", client.getClientName());
        viewData.put("brokerage_name", client.getBroker().getName());
        if (client.getEffectiveDate() != null) {
            viewData.put("effective_date", dateFormat.format(client.getEffectiveDate()));
        }
        String brokerName = client.getBroker().getName();
        fillProductOverviewAndMarketingSummary(data.medical, brokerName, viewData, null);
        fillProductOverviewAndMarketingSummary(data.dental, brokerName, viewData, null);
        fillProductOverviewAndMarketingSummary(data.vision, brokerName, viewData, null);
        fillProductOverviewAndMarketingSummary(data.life, brokerName, viewData, "Basic Life/AD&D");
        fillProductOverviewAndMarketingSummary(data.std, brokerName, viewData, "Short-Term Disability");
        fillProductOverviewAndMarketingSummary(data.ltd, brokerName, viewData, "Long-Term Disability");
        // put tiers captions
        fillTierCaption(viewData, data.medical);
        fillTierCaption(viewData, data.dental);
        fillTierCaption(viewData, data.vision);
        
        fillCurrentAndRenewal(viewData, data.medical, data, forCarrierSite);
        fillCurrentAndRenewalPlans(viewData, data.medical);
        fillDataForBars(viewData, data.medical);
        fillAlternatives(viewData, data.medical, data);
        fillAlternativePlans(viewData, data.medical, data.medical.renewalAlternatives, forCarrierSite);
        fillAlternativePlans(viewData, data.medical, data.medical.alternatives, forCarrierSite);

        fillCurrentAndRenewal(viewData, data.dental, data, forCarrierSite);
        fillCurrentAndRenewalDentalPlans(viewData, data.dental);
        fillDataForBars(viewData, data.dental);
        fillAlternatives(viewData, data.dental, data);
        fillAlternativePlans(viewData, data.dental, data.dental.renewalAlternatives, forCarrierSite);
        fillAlternativePlans(viewData, data.dental, data.dental.alternatives, forCarrierSite);
        fillDentalBenefitCaption(viewData, data.dental, data.dental.renewalAlternatives);
        fillDentalBenefitCaption(viewData, data.dental, data.dental.alternatives);

        fillCurrentAndRenewal(viewData, data.vision, data, forCarrierSite);
        fillCurrentAndRenewalPlans(viewData, data.vision);
        fillDataForBars(viewData, data.vision);
        fillAlternatives(viewData, data.vision, data);
        fillAlternativePlans(viewData, data.vision, data.vision.renewalAlternatives, forCarrierSite);
        fillAlternativePlans(viewData, data.vision, data.vision.alternatives, forCarrierSite);

        PptxAncillaryFiller.fillAncillary(viewData, data, forCarrierSite);

        fillDataForBars(viewData, data.life);
        fillDataForBars(viewData, data.std);
        fillDataForBars(viewData, data.ltd);

        fillAlternatives(viewData, data.life, data);
        //fillAlternatives(viewData, data.volLife);
        fillAlternatives(viewData, data.std, data);
        fillAlternatives(viewData, data.ltd, data);

        float annualTotalCurrent = data.products.stream()
            .filter(product -> !product.equals(data.volLife))
            .map(product -> product.current.annualTotal)
            .reduce(0.0f, Float::sum);
        float annualEmployerCurrent = data.products.stream()
            .filter(product -> !product.equals(data.volLife))
            .map(product -> product.current.annualEmployer)
            .reduce(0.0f, Float::sum);
        viewData.put("tmc", currencyFormatter.format(annualEmployerCurrent));
        viewData.put("ttc", currencyFormatter.format(annualTotalCurrent));
        viewData.put("tec", currencyFormatter.format(annualTotalCurrent - annualEmployerCurrent));

        float annualTotalInitial = data.products.stream()
            .filter(product -> !product.equals(data.volLife))
            .map(product -> product.renewal.annualTotal)
            .reduce(0.0f, Float::sum);
        float annualEmployerInitial = data.products.stream()
            .filter(product -> !product.equals(data.volLife))
            .map(product -> product.renewal.annualEmployer)
            .reduce(0.0f, Float::sum);
        viewData.put("tmn", currencyFormatter.format(annualEmployerInitial));
        viewData.put("ttn", currencyFormatter.format(annualTotalInitial));
        viewData.put("ten", currencyFormatter.format(annualTotalInitial - annualEmployerInitial));
        viewData.put("tdn", currencyFormatter.format(annualTotalInitial - annualTotalCurrent));
        viewData.put("tpn", MathUtils.diffPecent(annualTotalInitial, annualTotalCurrent, 1) + "%");

        for (int i = 0; i < data.medical.alternatives.list.size(); i++ ) {
            float annualTotal = 0f;
            float annualEmployer = 0f;
            float discountTotal = 0f;
            for (Product product : data.products) {
                if (product != data.volLife) {
                    Option option = product.alternatives.list.get(i);
                    if(option != null) {
                        annualTotal += option.annualTotal;
                        annualEmployer += option.annualEmployer;
                    }
                    Option renewalOption = product.renewalAlternatives.list.get(i);
                    if (renewalOption != null) {
                        annualTotal += renewalOption.annualTotal;
                        annualEmployer += renewalOption.annualEmployer;
                        discountTotal += renewalOption.discount;
                    } else if (forCarrierSite && !product.renewal.plans.isEmpty()) {
                        Option renewal = product.renewal;
                        annualTotal += renewal.annualTotal;
                        annualEmployer += renewal.annualEmployer;
                        discountTotal += renewal.discount;
                    }
                }
            }
            String suffix = "t-" + i;
            viewData.put("tm" + suffix, currencyFormatter.format(annualEmployer));
            viewData.put("tt" + suffix, currencyFormatter.format(annualTotal));
            if (forCarrierSite) {
                viewData.put("id" + suffix, currencyFormatter.format(discountTotal));
            }
            viewData.put("te" + suffix, currencyFormatter.format(annualTotal - annualEmployer));
            viewData.put("td" + suffix, currencyFormatter.format(annualTotal - annualTotalCurrent));
            viewData.put("tp" + suffix, MathUtils.diffPecent(annualTotal, annualTotalCurrent, 1) + "%");
        }


        data.products.stream()
            .filter(product -> !product.equals(data.volLife))
            .forEach(product -> fillMarketingSummary(viewData, client, product));
        postFill(viewData, data);
        return data;
    }

    protected void postFill(Map<String, Object> viewData, Data data) {
        viewData.put("ambr", "AM BEST RATING");
        viewData.put("tpcap", "Total Program Costs - All Plans");
        viewData.put("tname", "Renewal");
    }

    protected void fillProductOverviewAndMarketingSummary(Product product, String brokerName,
        Map<String, Object> viewData, String customProductCaption
    ) {
        String lowerCaseProductName = StringUtils.lowerCase(product.category);
        String overview = String.format("The initial %s %s %s renewal was released at %s. ",
            product.current.carrierDisplayName,
            customProductCaption != null ? customProductCaption : StringUtils.capitalize(lowerCaseProductName),
            joinPlanNames(product.current.plans),
            MathUtils.diffPecent(product.renewal.total, product.current.total, 1) + "%");
        viewData.put(lowerCaseProductName + "_overview", overview);
        viewData.put(lowerCaseProductName + "_marketing_summary", String.format(
            "%1$s surveyed the marketplace to evaluate comparable %2$s plans "
                + "in terms of pricing, benefits and service delivery. The following is a list of the insurance carriers "
                + "who were requested to provide %2$s proposals to %1$s.",
            brokerName,
            customProductCaption != null ? customProductCaption : lowerCaseProductName));
        viewData.put(product.prefix + "ra", "Renewal");
        viewData.put(product.prefix + "ran", "Renewal");
    }

    private void fillDentalBenefitCaption(Map<String, Object> viewData, Product dental, AlternativesHolder alternativesHolder) {
        String pagePrefix = "";
        if (alternativesHolder == dental.renewalAlternatives) {
            pagePrefix += AlternativesHolder.RENEWAL_ALTERNATIVE_PREFIX + "-";
        }
        for (int planIndex = 0; planIndex < dental.binding.size(); planIndex++ ) {
            String bindingPlanType = dental.binding.get(planIndex).getRight();
            String[] BENEFITS_NAME = "DPPO".equals(bindingPlanType) ? DPPO_BENEFITS_NAME : DHMO_BENEFITS_NAME;
            for (int pageIndex = 0; pageIndex < alternativesHolder.pageNumPerPlan.get(planIndex); pageIndex++ ) {
                for(int i=0; i<BENEFITS_NAME.length; i++) {
                    viewData.put("db" + i + "h-" + pagePrefix + pageIndex + "-" + planIndex, BENEFITS_NAME[i]);
                }
            }
        }

        if (dental.pageNum > 0) {
            String firstPlanType = dental.binding.get(0).getRight();
            String[] BENEFITS_NAME = "DPPO".equals(firstPlanType) ? DPPO_BENEFITS_NAME : DHMO_BENEFITS_NAME;
            for(int i=0; i<BENEFITS_NAME.length; i++) {
                viewData.put("db" + i + "h-0", BENEFITS_NAME[i]);
            }
            if (dental.pageNum > 1) {
                BENEFITS_NAME = !"DPPO".equals(firstPlanType) ? DPPO_BENEFITS_NAME : DHMO_BENEFITS_NAME;
                for(int i=0; i<BENEFITS_NAME.length; i++) {
                    viewData.put("db" + i + "h-1", BENEFITS_NAME[i]);
                }
            }
        }

    }

    private void fillMarketingSummary(Map<String, Object> viewData, Client client, Product product) {

        //String capitalizedCategory = StringUtils.capitalize(product.category.toLowerCase());
        String prefix = product.prefix;
        
        // Medical Carrier Marketing Summary  
        viewData.put(prefix + "c0", product.current.carrierDisplayName);
        viewData.put(prefix + "p0", MathUtils.diffPecent(product.renewal.total, product.current.total, 1) + "%");
        viewData.put(prefix + "response0", "Incumbent");
        viewData.put(prefix + "r0", product.current.carrierAmBestRating);
        
        List<MarketingList> marketingStatuses = marketingListRepository.findByClientClientId(client.getClientId());
        List<RfpQuoteOption> options = sharedRfpQuoteService.findAllCarrierQuoteOptions(client.getClientId(), product.category);
        List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(), product.category);
        List<RfpQuoteAncillaryOption> ancillaryOptions = new ArrayList<>();
        quotes.forEach(rfpQuote -> ancillaryOptions
            .addAll(rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote)));
        //List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        //options = rfpQuoteService.filterQuoteOptionByRole(options);
        int index = 1;
        for (MarketingList marketingStatus : marketingStatuses) {
            
            RfpCarrier rfpCarrier = marketingStatus.getRfpCarrier();
            if (!product.category.equals(rfpCarrier.getCategory())) {
                continue;
            }
            
            viewData.put(prefix + "c" + index, rfpCarrier.getCarrier().getDisplayName());
            viewData.put(prefix + "r" + index, rfpCarrier.getCarrier().getAmBestRating());

            if (MarketingStatus.RFP_SUBMITTED.equals(marketingStatus.getStatus())) {
                viewData.put(prefix + "p" + index, "-");
                viewData.put(prefix + "response" + index, "Not Illustrated");
            } else if (MarketingStatus.DECLINED.equals(marketingStatus.getStatus())) {
                viewData.put(prefix + "p" + index, "DTQ");
                viewData.put(prefix + "response" + index, "Not Illustrated");
            } else if (MarketingStatus.QUOTED.equals(marketingStatus.getStatus())) {
                // find carrier option with lowest diff
            	double lowestOptionTotal = Double.MAX_VALUE;
                for (RfpQuoteOption option : options) {
                    if (rfpCarrier.getRfpCarrierId().equals(
                            option.getRfpQuote().getRfpSubmission().getRfpCarrier().getRfpCarrierId())) {
                        float optionTotal = sharedRfpQuoteService.calcOptionTotal(option);
                        if (lowestOptionTotal > optionTotal) {
                            lowestOptionTotal = optionTotal;
                        }
                    }
                }
                for (RfpQuoteAncillaryOption option : ancillaryOptions) {
                    if (rfpCarrier.getRfpCarrierId().equals(
                        option.getRfpQuote().getRfpSubmission().getRfpCarrier().getRfpCarrierId())) {
                    	double optionTotal = sharedRfpQuoteService.calcAncillaryOptionTotal(option);
                        if (lowestOptionTotal > optionTotal) {
                            lowestOptionTotal = optionTotal;
                        }
                    }
                }
                if (lowestOptionTotal < Double.MAX_VALUE) {
                	double diffPercent = MathUtils.diffPecent(lowestOptionTotal, product.current.total, 1);
                    viewData.put(prefix + "p" + index, diffPercent + "%");
                    viewData.put(prefix + "response" + index, "Illustrated");
                } else {
                    // option not found
                    viewData.put(prefix + "p" + index, "-");
                    viewData.put(prefix + "response" + index, "Not Illustrated");
                }
            }
            index ++;
        }

        /*
        String pageNotes = "";
        for(Option alternative : product.alternatives) {
            if (alternative != null) {
                float optionTotal = alternative.total;
                float diffPercent = MathUtils.diffPecent(optionTotal, product.current.total, 2);
                viewData.put(prefix + "c" + index[0], alternative.carrierDisplayName);
                viewData.put(prefix + "p" + index[0], diffPercent + "%");
                viewData.put(prefix + "response" + index[0], "Illustrated");
                viewData.put(prefix + "r" + index[0], alternative.carrierAmBestRating);
                index[0] ++;
                if (alternative.notes != null) {
                    if (!pageNotes.isEmpty()) { pageNotes += ", ";  }
                    pageNotes += capitalizedCategory + " " + alternative.name + " " + alternative.notes;
                }
            }
        }
        if (!pageNotes.isEmpty()) {
            viewData.put(prefix + "_marketing_notes", "Please Note: " + pageNotes + ".");
        }*/
        /*
        // put Option1s info
        List<RfpQuoteOption> rfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), category);
        rfpQuoteOptions.stream()
            .filter(o -> o.getRfpQuoteOptionName().equals(RfpQuoteService.OPTION_1_NAME))
            .forEach( option -> {
                // TODO use cached value
                float optionTotal = rfpQuoteService.calcOptionTotal(option);
                float diffPercent = MathUtils.diffPecent(optionTotal, product.current.total, 2);
                Carrier carrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
                viewData.put(prefix + "c" + index[0], carrierDisplayName);
                viewData.put(prefix + "p" + index[0], diffPercent + "%");
                viewData.put(prefix + "response" + index[0], "Illustrated");
                viewData.put(prefix + "r" + index[0], carrierAmBestRating);
                index[0] ++;
            });
         */

        // competitive info
        /*activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndLatestIsTrue(
                        client.getClientId(), ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), product.category)
                .stream()
                .forEach(diff -> {
                    Carrier carrier = carrierRepository.findOne(diff.getCarrierId());
                    viewData.put(prefix + "c" + index[0], carrier.getDisplayName());
                    viewData.put(prefix + "p" + index[0], diff.getValue() + "%");
                    viewData.put(prefix + "response" + index[0], "Not Illustrated");
                    viewData.put(prefix + "r" + index[0], carrier.getAmBestRating());
                    index[0] ++;
                });*/

        // DTQ
        /*rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(client.getClientId(), product.category, QuoteType.DECLINED)
                .forEach(quote -> {
                    Carrier carrier = quote.getRfpSubmission().getRfpCarrier().getCarrier();
                    viewData.put(prefix + "c" + index[0], carrier.getDisplayName());
                    viewData.put(prefix + "p" + index[0], "N/A");
                    viewData.put(prefix + "response" + index[0], "DTQ");
                    viewData.put(prefix + "r" + index[0], carrier.getAmBestRating());
                    index[0] ++;
                });*/
    }

    private void fillTierCaption(Map<String, Object> viewData, Product product) {
        String prefix = product.prefix;
        viewData.put(prefix + "r1h", "Employee Only");
        if (product.ratingTiers == 2) {
            viewData.put(prefix + "r2h", "Employee + Family");
        } else if (product.ratingTiers == 3) {
            viewData.put(prefix + "r2h", "Employee + One");
            viewData.put(prefix + "r3h", "Employee + Family");
        } else if (product.ratingTiers == 4) {
            viewData.put(prefix + "r2h", "Employee + Spouse");
            viewData.put(prefix + "r3h", "Employee + Child(ren)");
            viewData.put(prefix + "r4h", "Employee + Family");
        }
    }
  
    private String joinPlanNames(List<PrepPlan> plans) {
        
        if (plans.size() == 0) {
            return "";
        }
        if (plans.size() == 1) {
            return plans.get(0).name;
        }
        
        StringBuilder sb = new StringBuilder(plans.get(0).name);
        for (int i=1; i<plans.size() - 1; i++) {
            sb.append(", ");
            sb.append(plans.get(i).name);
        }
        sb.append(" and ");
        sb.append(plans.get(plans.size() - 1).name);
        return sb.toString();
    }

    private void fillCurrentAndRenewal(Map<String, Object> viewData, Product product, Data data, boolean forCarrierSite) {
        
        String prefix = product.prefix;

        if (product.current.plans.isEmpty() && product.renewal.plans.isEmpty()) {
            viewData.put(prefix + "hide", Pair.of(null, 0)); // hide row
            return;
        }
        
        // current
        viewData.put(prefix + "cc", product.current.carrierDisplayName);
        if (!forCarrierSite) {
            viewData.put(prefix + "rc", product.current.carrierAmBestRating);
        }
        
        viewData.put(prefix + "mc", currencyFormatter.format(product.current.annualEmployer));
        viewData.put(prefix + "tc", currencyFormatter.format(product.current.annualTotal));
        viewData.put(prefix + "ec", currencyFormatter.format(product.current.annualTotal - product.current.annualEmployer));
        viewData.put(prefix + "nc", product.current.enrollment);
        
        fillRenewal(viewData, product, prefix, "n", forCarrierSite);
    }

    private void fillRenewal(Map<String, Object> viewData, Product product, String prefix, String suffix, boolean forCarrierSite) {
        // renewal
        String renewalName = product.renewal.name;
        if (forCarrierSite) {
            if (!product.renewal.carrierDisplayName.isEmpty()) {
                renewalName += " (" + product.renewal.carrierDisplayName + ")";
            }
            if (!product.prefix.equals(Data.MEDICAL_PREFIX)) {
                viewData.put(prefix + "id", currencyFormatter.format(product.renewal.discount));
            }
        }
        viewData.put(prefix + "c" + suffix, renewalName);
        viewData.put(prefix + "m" + suffix, currencyFormatter.format(product.renewal.annualEmployer));
        viewData.put(prefix + "t" + suffix, currencyFormatter.format(product.renewal.annualTotal));
        viewData.put(prefix + "e" + suffix, currencyFormatter.format(product.renewal.annualTotal - product.renewal.annualEmployer));
        viewData.put(prefix + "d" + suffix, currencyFormatter.format(product.renewal.annualTotal - product.current.annualTotal));
        float diff = MathUtils.diffPecent(product.renewal.total, product.current.total, 1);
        viewData.put(prefix + "p" + suffix,  diff + "%");
        viewData.put(prefix + "p+" + suffix,  ((diff > 0)?"+":"") + diff + "%");
    }

    private void fillCurrentAndRenewalPlans(Map<String, Object> viewData, Product product) {
        String prefix = product.prefix;
        int planIndex = 0;
        int planPageNum = 0;
        while(planIndex < product.current.plans.size()) {
            String pageSuffix = "-" + planPageNum;
            int planNum = 0;
            while(planNum < PLANS_PER_PAGE && planIndex < product.current.plans.size()) {
                PrepPlan currentPlan = product.current.plans.get(planIndex);
                PrepPlan renewalPlan = planIndex < product.renewal.plans.size() ? product.renewal.plans.get(planIndex) : null;
                fillPlan(viewData, prefix, product, planNum, currentPlan, null, "c", pageSuffix);
                fillPlanRates(viewData, prefix, product, planNum, renewalPlan, currentPlan, "n", pageSuffix);
                planNum ++;
                planIndex++; 
            }
            // end of page
            if (planNum != 0) { // page was not empty
                planPageNum ++;
            }
        }
        product.pageNum = planPageNum;
    }

    private void fillCurrentAndRenewalDentalPlans(Map<String, Object> viewData, Product product) {
        // separate DHMO and DPPO to different pages
        String prefix = product.prefix;
        String firstPlanType = null;
        int firstPlanIndex = 0;
        int secondPlanIndex = 0;

        for (int i=0; i < product.current.plans.size(); i++) {
            PrepPlan currentPlan = product.current.plans.get(i);
            if (currentPlan != null && product.binding.get(i) != null) {
                PrepPlan renewalPlan = i < product.renewal.plans.size() ? product.renewal.plans.get(i) : null;
                String planType = product.binding.get(i).getRight();
                if (firstPlanType == null) {
                    firstPlanType = planType; 
                }
                if (planType.equals(firstPlanType)) {
                    fillPlan(viewData, prefix, product, firstPlanIndex, currentPlan, null, "c", "-0");
                    fillPlanRates(viewData, prefix, product, firstPlanIndex, renewalPlan, currentPlan, "n", "-0");
                    firstPlanIndex++;
                } else {
                    fillPlan(viewData, prefix, product, secondPlanIndex, currentPlan, null, "c", "-1");
                    fillPlanRates(viewData, prefix, product, secondPlanIndex, renewalPlan, currentPlan, "n", "-1");
                    secondPlanIndex++;
                }
            }
        }
        
        product.pageNum = secondPlanIndex > 0 ? 2 : firstPlanIndex > 0 ? 1 : 0;
    }

    protected void fillAlternatives(Map<String, Object> viewData, Product product, Data data) {
        for (int altIndex = 0; altIndex < product.alternatives.list.size(); altIndex++ ) {
            Option alternative = product.alternatives.list.get(altIndex);
            if (alternative == null)
                alternative = product.renewalAlternatives.list.get(altIndex);
            if (alternative != null) {
                fillFinancialSummary(viewData, product, false, alternative, altIndex);
            }
        }
        viewData.put(product.prefix + "bdohide", Pair.of(null, 0));//hide overview buy down option row
        if (viewData.get(product.prefix + "hide") != null &&
            product.alternatives.list.stream().noneMatch(Objects::nonNull) &&
            product.renewalAlternatives.list.stream().noneMatch(Objects::nonNull))
        {
            viewData.put(product.prefix + "althide", Pair.of(null, 0));//hide row on alternative financial summary;
        }
    }

    protected void fillFinancialSummary(Map<String, Object> viewData, Product product,
        boolean forCarrierSite, Option alternative, int altIndex) {
        String prefix = product.prefix;
        String capitalizedCategory = StringUtils.capitalize(product.category.toLowerCase());
        String suffix = "t-" + altIndex;
        viewData.computeIfAbsent("tname-" + altIndex, k -> alternative.name);
        if (alternative.notes != null) {
            viewData.put("financial_notes-" + altIndex,
                "Please Note: " + capitalizedCategory + " " + alternative.notes + ".");
        }
        String alternativeName;
        if (forCarrierSite) {
            alternativeName = alternative.name;
            if (!alternative.carrierDisplayName.isEmpty()) {
                alternativeName += " (" + alternative.carrierDisplayName + ")";
            }
        } else {
            alternativeName = alternative.carrierDisplayName;
        }
        viewData.put(prefix + "c" + suffix, alternativeName);
        if (!forCarrierSite) {
            viewData.put(prefix + "r" + suffix, alternative.carrierAmBestRating);
        } else {
            if (!product.prefix.equals(Data.MEDICAL_PREFIX)) {
                viewData.put(prefix + "id" + suffix, currencyFormatter.format(alternative.discount));
            }
        }
        viewData.put(prefix + "n" + suffix, alternative.enrollment);
        viewData.put(prefix + "m" + suffix, currencyFormatter.format(alternative.annualEmployer));
        viewData.put(prefix + "t" + suffix, currencyFormatter.format(alternative.annualTotal));
        viewData.put(prefix + "e" + suffix, currencyFormatter.format(alternative.annualTotal - alternative.annualEmployer));
        viewData.put(prefix + "d" + suffix, currencyFormatter.format(alternative.annualTotal - product.current.annualTotal));
        float diff = MathUtils.diffPecent(alternative.total, product.current.total, 1);
        viewData.put(prefix + "p" + suffix,  diff + "%");
        if (forCarrierSite) {
            viewData.put(prefix + "p+t", ((diff > 0) ? "+" : "") + diff + "%");
        }
    }

    private void fillAlternativePlans(
        Map<String, Object> viewData, Product product,
        AlternativesHolder alternativesHolder, boolean forCarrierSite
    ) {
        
        String prefix = product.prefix;
        String capitalizedCategory = StringUtils.capitalize(product.category.toLowerCase());

        String pagePrefix = "";
        if (alternativesHolder == product.renewalAlternatives) {
            pagePrefix += "-" + AlternativesHolder.RENEWAL_ALTERNATIVE_PREFIX;
        }

        for (int planIndex = 0; planIndex < product.binding.size(); planIndex++ ) {
            int alternativePageNum = 0;
            int altIndex = 0;
            String pageNotes;
            PrepPlan currentPlan = planIndex < product.current.plans.size() ? product.current.plans.get(planIndex) : null;
            PrepPlan renewalPlan = planIndex < product.renewal.plans.size() ? product.renewal.plans.get(planIndex) : null;

            while(altIndex < alternativesHolder.list.size()) {
                String pageSuffix = pagePrefix + "-" + alternativePageNum + "-" + planIndex;
                int alternativeNum = 1; // 1 based index
                pageNotes = "";
                while(alternativeNum <= ALTERNATIVES_PER_PAGE && altIndex < alternativesHolder.list.size()) {
                    Option alternative = alternativesHolder.list.get(altIndex);
                    if (alternative != null && !alternative.isDuplicate) {
                        if (planIndex < alternative.plans.size()) {
                            PrepPlan prepPlan =  alternative.plans.get(planIndex);
                            if (prepPlan != null) {

                                viewData.put(prefix + alternativeNum +"name" + pageSuffix, joinAlternativeNames(alternative));
                                fillPlan(viewData, prefix, product, alternativeNum, prepPlan, currentPlan, "i", pageSuffix);
                                
                                if (alternative.notes != null && !"Kaiser".equalsIgnoreCase(prepPlan.carrierName)) {
                                    if (!pageNotes.isEmpty()) { pageNotes += ", "; }
                                    pageNotes += joinAlternativeNotes(capitalizedCategory, alternative);
                                }
                                alternativeNum ++;
                            }
                        }
                    }
                    altIndex++; 
                }
                // end of page
                if (alternativeNum != 1) { // page was not empty
                    // copy current and renewal info on each page
                    viewData.put(prefix + "0name" + pageSuffix, product.current.name);
                    fillPlan(viewData, prefix, product, 0, currentPlan, null, "c", pageSuffix);
                    fillPlanRates(viewData, prefix, product, 0, renewalPlan, currentPlan, "n", pageSuffix);
                    if (!pageNotes.isEmpty()) {
                        viewData.put(prefix + "_marketing_notes" + pageSuffix, "Please Note: " + pageNotes + ".");
                    }
                    if (alternativesHolder == product.renewalAlternatives) {
                        if (forCarrierSite && !product.isRenewal) {
                            viewData.put(prefix + "at" + pageSuffix, "New Business");
                        } else {
                            viewData.put(prefix + "at" + pageSuffix, "Renewal");
                        }
                    } else {
                        viewData.put(prefix + "at" + pageSuffix, "Marketing");
                    }
                    alternativePageNum ++;
                }
            }
            alternativesHolder.pageNumPerPlan.add(alternativePageNum);

        }
    }
    
    /**
     *  i.e. for list of "Alternative 1", "Alternative 3", "Alternative 4" returns joined name "Alternative 1, 3, 4"
     *  
     */
    static String joinAlternativeNames(Option option) {
        
        if (option.duplicateOptions.isEmpty()) {
            return option.name;
        }

        List<String> names = new ArrayList<>();
        names.add(option.name);
        for (Option duplicateOption : option.duplicateOptions) {
            names.add(duplicateOption.name);
        }
        
        return joinAlternativeNames(names);
    }

    /**
     *  i.e. for list of "Alternative 1", "Alternative 3", "Alternative 4" returns joined name "Alternative 1, 3, 4"
     *  
     */
    static private String joinAlternativeNames(List<String> names) {
        
        if (names.size() == 1) {
            return names.get(0);
        }
        
        List<String> suffixes = new ArrayList<>();
        List<String> fullNames = new ArrayList<>();
        
        for (String name : names) {
            if (StringUtils.startsWithIgnoreCase(name, ALTERNATIVE_NAME_PREFIX)) {
                suffixes.add(name.substring(ALTERNATIVE_NAME_PREFIX.length()));
            } else {
                // add name as is
                fullNames.add(name);
            }
        }
        if (!suffixes.isEmpty()) {
            fullNames.add(ALTERNATIVE_NAME_PREFIX + StringUtils.join(suffixes, ", "));
        }
        
        return StringUtils.join(fullNames, ", ");
    }


    /**
     * if alternatives have the same option but different notes returns all variation of notes
     * 
     * i.e. for "Alternative 1" with "Notes 1" and "Alternative 2" with "Notes 1" returns "Alternative 1, 2 Notes 1"
     * 
     * i.e. for "Alternative 1" with "Notes 1" and "Alternative 2" with "Notes 2" returns "Alternative 1 Notes 1, Alternative 2 Notes 2"
     */
    private String joinAlternativeNotes(String capitalizedCategory, Option option) {

        if (option.duplicateOptions.isEmpty()) {
            return option.name + " " + option.notes;
        }

        List<String> result = new ArrayList<>();
        Stream.concat(Stream.of(option), option.duplicateOptions.stream())
                .collect(Collectors.groupingBy(
                        o -> o.notes, 
                        LinkedHashMap::new, 
                        Collectors.mapping( o -> o.name, Collectors.toList())))
                .forEach((notes, names) -> {
                    result.add(capitalizedCategory + " " + joinAlternativeNames(names) + " " + notes);
                });;

        return StringUtils.join(result, ", ");
    }

    private void fillPlan(Map<String, Object> viewData, String prefix, Product product, int i, PrepPlan prepPlan, PrepPlan currentPlan, String suffix, String pageSuffix) {
        if (prepPlan == null) { return; }
        
        String prefixWithIndex = prefix + i;
        viewData.put(prefixWithIndex +"c" + pageSuffix, prepPlan.carrierName);
        viewData.put(prefixWithIndex +"n" + pageSuffix, prepPlan.name);
        
        viewData.put(prefixWithIndex +"e1" + pageSuffix, prepPlan.enrollment1);
        if (product.ratingTiers > 1) {
            viewData.put(prefixWithIndex +"e2" + pageSuffix, prepPlan.enrollment2);
        } 
        if (product.ratingTiers > 2) {
            viewData.put(prefixWithIndex +"e3" + pageSuffix, prepPlan.enrollment3);
        } 
        if (product.ratingTiers > 3) {
            viewData.put(prefixWithIndex +"e4" + pageSuffix, prepPlan.enrollment4);
        }
        viewData.put(prefixWithIndex +"et" + pageSuffix, prepPlan.enrollment);
        
        fillPlanRates(viewData, prefix, product, i, prepPlan, currentPlan, suffix, pageSuffix);
    
        if (prepPlan.benefits != null) {
            // prepare IN-OUT network header
            if (prepPlan.twoColumnFlag) {
                viewData.put(prefixWithIndex +"hi" + pageSuffix, "IN");
                viewData.put(prefixWithIndex +"ho" + pageSuffix, "OUT");
            } else {
                viewData.put(prefixWithIndex +"hi" + pageSuffix, Pair.of("IN-NETWORK ONLY", 3)); // colspan=3
            }
            for(int j=0; j<prepPlan.benefits.length; j++) {
                Object value = prepPlan.benefits[j];
                if (value instanceof Benefit) {
                    viewData.put(prefixWithIndex + "b" + j + "i" + pageSuffix, Pair.of(getOriginalValue((Benefit)value), 3)); // colspan=3
                } else if (value instanceof Benefit[]) {
                    viewData.put(prefixWithIndex + "b" + j + "i" + pageSuffix, getOriginalValue(((Benefit[])value)[0]));
                    viewData.put(prefixWithIndex + "b" + j + "o" + pageSuffix, getOriginalValue(((Benefit[])value)[1]));
                } else {
                    if (prepPlan.twoColumnFlag) {
                        viewData.put(prefixWithIndex + "b" + j + "i" + pageSuffix, "-");
                        viewData.put(prefixWithIndex + "b" + j + "o" + pageSuffix, "-");
                    } else {
                        viewData.put(prefixWithIndex + "b" + j + "i" + pageSuffix, Pair.of("-", 3));
                    }       
                }
            }
        }
    }

    private void fillPlanRates(Map<String, Object> viewData, String prefix, Product product, int i,
            PrepPlan prepPlan, PrepPlan currentPlan, String suffix, String pageSuffix) {

        if (prepPlan == null) { return; }

        viewData.put(prefix + i +"r1" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.rate1));
        if (product.ratingTiers > 1) {
            viewData.put(prefix + i +"e2" + pageSuffix, prepPlan.enrollment2);
            viewData.put(prefix + i +"r2" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.rate2));
        } 
        if (product.ratingTiers > 2) {
            viewData.put(prefix + i +"e3" + pageSuffix, prepPlan.enrollment3);
            viewData.put(prefix + i +"r3" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.rate3));
        } 
        if (product.ratingTiers > 3) {
            viewData.put(prefix + i +"e4" + pageSuffix, prepPlan.enrollment4);
            viewData.put(prefix + i +"r4" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.rate4));
        }
        viewData.put(prefix + i +"et" + pageSuffix, prepPlan.enrollment);
        viewData.put(prefix + i +"rm" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.total));
        viewData.put(prefix + i +"ra" + suffix + pageSuffix, currencyFormatterWithFraction.format(prepPlan.total * MONTHS_IN_YEAR)); // annual
        
        if (currentPlan != null) {
            double diff = MathUtils.diffPecent(prepPlan.total, currentPlan.total, 1);
            viewData.put(prefix + i +"ad" + suffix + pageSuffix, currencyFormatterWithFraction.format((prepPlan.total - currentPlan.total) * MONTHS_IN_YEAR));
            viewData.put(prefix + i +"ap" + suffix + pageSuffix, ((diff > 0)?"+":"") + diff + "%"); 
        }

    }

    protected void fillDataForBars(Map<String, Object> viewData, Product product) {
        viewData.put(product.prefix + "_alt_bar_hide", true);
        viewData.put(product.prefix + "_alt_big_bar_hide", true);
        String prefix = product.prefix;
        if (product.current.total == product.renewal.total) {
            viewData.put(prefix + "_renewal_bar", 0.5F);
            viewData.put(prefix + "_current_bar", 0.5F);
        } else if (product.current.total > product.renewal.total) {
            viewData.put(prefix + "_renewal_bar", 0F);
            viewData.put(prefix + "_current_bar", 1F);
        } else {
            viewData.put(prefix + "_renewal_bar", 1F);
            viewData.put(prefix + "_current_bar", 0F);
        }
    }

    private String getOriginalValue(Benefit benefit) {
        switch(benefit.getFormat()) {
        case "DOLLAR":
            return currencyFormatterWithFraction.format(Double.parseDouble(benefit.getValue()));
        case "PERCENT":
            return benefit.getValue() + "%";
        case "MULTIPLE":
            return benefit.getValue() + "x";
        }
        return benefit.getValue();
    }

    public byte[] getByClientId(Long clientId) {
        
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found")
                .withFields( field("client_id", clientId));
        }

        // async
        Future<byte[]> futureBrokerLogoData = self.getBrokerLogo(client.getBroker().getLogo());
        
        Map<String, Object> viewData = new HashMap<>();
        Data data = fillData(viewData, client, false);
        
        byte[] brokerLogoData = null;
        try {
            brokerLogoData = futureBrokerLogoData.get(2, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            logger.error("Can't get broker logo", e);
        } 
        
        return PptxGenerator.generate("/templates/presentation.pptx", data, viewData, brokerLogoData);
    }

    @Async
    protected CompletableFuture<byte[]> getBrokerLogo(String brokerLogo) {
        byte[] brokerLogoData = null;
        if (!StringUtils.isEmpty(brokerLogo)) {
            
            // getting 3x logo
            int dotIndex = brokerLogo.lastIndexOf(".");
            String brokerLogo3x = brokerLogo.substring(0, dotIndex) + "_3x" + brokerLogo.substring(dotIndex); 
            
            HttpURLConnection connection = null;
            InputStream connectionIs = null;
            try {
                URL url = new URL(brokerLogo3x);
                connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(2000);
                connection.setReadTimeout(2000);
                connectionIs = connection.getInputStream();
                brokerLogoData = IOUtils.toByteArray(connectionIs);
            } catch (IOException ex) {
                logger.error(String.format("Can't get broker logo URL=%s", brokerLogo3x), ex);
            } finally {
                if (connectionIs != null) {
                    try {
                        connectionIs.close();
                    } catch (IOException e) {
                        // do nothing
                    }
                }
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }
        return CompletableFuture.completedFuture(brokerLogoData);
    }
}

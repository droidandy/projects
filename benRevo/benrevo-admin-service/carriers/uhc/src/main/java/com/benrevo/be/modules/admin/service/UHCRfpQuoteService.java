package com.benrevo.be.modules.admin.service;

import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC;
import static com.benrevo.common.enums.CarrierType.UHC;

import com.benrevo.be.modules.admin.service.BaseAdminRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteOptionNameToMatchingPlan;
import com.benrevo.common.enums.OptionType;
import com.benrevo.data.persistence.entities.AdministrativeFee;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.AdministrativeFeeRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import static java.util.stream.Collectors.toList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCRfpQuoteService extends BaseAdminRfpQuoteService{

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private AdministrativeFeeRepository administrativeFeeRepository;

    /**
     * Returns the UHC Plans
     * @param rqn
     * @return
     */
    @Override
    protected List<RfpQuoteNetworkPlan> getRfpQuoteMatchingNetworkPlans(RfpQuoteNetwork rqn) {
        
        return rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(rqn)
                .stream()
                .filter(pl -> !pl.getPnn().getPlanType().startsWith("RX_"))
                .collect(toList());
        
    }
    
    protected void createQuotedClientCopyForSales(Long clientId) {
        // Anthem only
    }

    /**
     * UHC only has one match plan per network
     * @param rfpQuote
     */
    @Override
    protected void resetMatchPlans(RfpQuote rfpQuote) {}

    @Override
    protected void setSelectedRfpQuoteNetworkPlan(RfpQuoteOptionNetwork rqon,
        QuoteOptionNameToMatchingPlan quoteOptionInfo, String category,
        RfpQuoteNetwork quoteNetwork) {

        boolean isMedical = category.equalsIgnoreCase(Constants.MEDICAL);
        RfpQuoteNetworkPlan selected = null;
        RfpQuoteNetworkPlan matching = null;
        RfpQuoteNetworkPlan rxMatching = null;
        for (RfpQuoteNetworkPlan qnp : quoteNetwork.getRfpQuoteNetworkPlans()) {
            if (quoteOptionInfo.getPnnId() != null 
                    && qnp.getPnn().getPnnId().equals(quoteOptionInfo.getPnnId())) {
                selected = qnp;
            }
            if (qnp.isMatchPlan()) {
                if (isMedical && qnp.getPnn().getPlanType().startsWith("RX_")) {
                    rxMatching = qnp;
                } else {
                    matching = qnp;
                }
            }
        }
        if (quoteOptionInfo.getPnnId() !=null) {
            if (selected == null) {
                throw new IllegalArgumentException(String.format(
                    "Can't find plan id=%s for %s",
                        quoteOptionInfo.getPnnId(),
                        quoteOptionInfo.getQuoteOptionName()));
            } 
            rqon.setSelectedRfpQuoteNetworkPlan(selected);
        } else {
            if (matching == null) {
                throw new IllegalArgumentException(String.format(
                    "Can't find matching plan for %s", quoteOptionInfo.getQuoteOptionName()));
            } 
            rqon.setSelectedRfpQuoteNetworkPlan(matching);
        }
        if (isMedical) {
            if (rxMatching == null) {
                throw new IllegalArgumentException(String.format(
                    "Can't find Rx plan for %s", quoteOptionInfo.getQuoteOptionName()));
            }
            rqon.setSelectedRfpQuoteNetworkRxPlan(rxMatching);
        } 
        
        // set match riders as selected
        for(Rider rider : rqon.getRfpQuoteNetwork().getRiders()) {
            if (rider.isMatch()) {
                rqon.getSelectedRiders().add(rider);
            }
        }
    }

    @Override
    protected AdministrativeFee getDefaultAdministrativeFee(Carrier carrier) {
        return administrativeFeeRepository
            .findByCarrierCarrierIdAndName(carrier.getCarrierId(), DEFAULT_ADMINISTRATIVE_FEE_UHC);
    }
    
    /**
     * Updates contributions for "Renewal 2" option
     */
    @Override
    protected void updateOption2(RfpQuote rfpQuote, OptionType optionType) {
        if (OptionType.RENEWAL.equals(optionType)) {
            rfpQuote.getRfpQuoteOptions()
                .stream()
                .filter(o -> o.getRfpQuoteOptionName().equalsIgnoreCase("Renewal 2"))
                .findFirst()
                .ifPresent(o -> {
                    // copy over contributions
                    for(RfpQuoteOptionNetwork rqon : o.getRfpQuoteOptionNetworks()) {
                        ClientPlan clientPlan = rqon.getClientPlan();
                        if (clientPlan != null) {
                            rqon.setErContributionFormat(clientPlan.getErContributionFormat());
                            rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
                            rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
                            rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
                            rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));
                        }
                    }
                });
        }
    }


}

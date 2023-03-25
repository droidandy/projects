package com.benrevo.admin.domain.plans;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.ANTHEM_CLEAR_VALUE;
import static com.benrevo.common.enums.CarrierType.UHC;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkCombinationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.Year;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by lemdy on 6/15/17.
 */
@Ignore
public class PlansOwnerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SharedBrokerService sharedBrokerService;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Test
    public void uhcPlanOwner() throws Exception{
        Iterable<Client> clients = clientRepository.findAll();
        for(Client client : clients) {
            handleRfpToPnn(client);
            handleClientPlans(client);
            handleQuotes(client, "DPPO", "DHMO", "VISION");
        }
    }

    @Test
    public void anthemPlanOwner() throws Exception{

        //List<Long> anthemIgnoreList = Arrays.asList(1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L, 11L, 12L, 13L, 14L, 110L, 111L, 115L, 126L, 129L, 133L, 135L,138L, 139L, 143L, 149L, 183L, 328L, 354L, 355L, 356L, 469L, 470L, 473L);
        Iterable<Client> clients = clientRepository.findAll();
        for(Client client : clients) {
            //handleRfpToPnn(client);
            //handleClientPlans(client);
            handleQuotes(client, "DPPO");
        }
    }

    // Set pnn custom to false and clientId
    private void handleRfpToPnn(Client client){
        List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());
        if(rfps != null) {
            for (RFP rfp : rfps) {
                List<RfpToPnn> rfpToPnns = rfpToPnnRepository.findByRfpRfpId(rfp.getRfpId());
                for (RfpToPnn rfpToPnn : rfpToPnns) {
                    PlanNameByNetwork pnn = rfpToPnn.getPnn();
                    PlanNameByNetwork pnnR = handlePnn(client, pnn, false);
                    if(pnnR != null) {
                        rfpToPnn.setPnn(pnnR);
                        rfpToPnnRepository.save(rfpToPnn);
                    }
                }
            }
        }
    }


    // Set pnn custom to false and clientId
    private void handleClientPlans(Client client){
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        if(clientPlans != null) {
            for (ClientPlan cp : clientPlans) {
                PlanNameByNetwork pnn = cp.getPnn();
                PlanNameByNetwork rxPnn = cp.getRxPnn();
                PlanNameByNetwork pnnR = handlePnn(client, pnn, false);
                PlanNameByNetwork pnnRx =  handlePnn(client, rxPnn, false);

                if(pnnR != null){
                    cp.setPnn(pnnR);
                }
                if(pnnRx != null){
                    cp.setRxPnn(pnnRx);
                }
                clientPlanRepository.save(cp);
            }
        }
    }

    private PlanNameByNetwork handlePnn(Client client, PlanNameByNetwork pnn, boolean customPlan){
        if(pnn !=  null){
            if(pnn.getClientId() != null && !pnn.getClientId().equals(client.getClientId())){
                PlanNameByNetwork pnnCopy = pnn.copy();
                pnnCopy.setCustomPlan(customPlan);
                pnnCopy.setClientId(client.getClientId());
                savePnn(pnnCopy);
                return pnnCopy;
            }else{
                pnn.setCustomPlan(customPlan);
                pnn.setClientId(client.getClientId());
                //planNameByNetworkRepository.save(pnn);

                updatePrinter(customPlan ? "b'1'" : "b'0'", "'" +
                        client.getClientId() + "'",
                    "'" + pnn.getPnnId() + "'");
                return pnn;
            }
        }
        return null;
    }

    /**
     * This method handles both on-boarded carrier(UHC, Anthem, Anthem CV) rfpQuoteNetworkPlans(filters rfpQuoteNetwork by type)
     * and multi-carrier quotes(No filtering. Just set customPlan to false and set clientId)
     * @param client
     * @param planTypes
     */
    private void handleQuotes(Client client, String ... planTypes){
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientId(client.getClientId()); // includes medical, dental, vision
        if(!isEmpty(rfpQuotes)){
            for(RfpQuote rfpQuote : rfpQuotes) {
                if(rfpQuote.getQuoteType().equals(QuoteType.CLEAR_VALUE)){
                    continue;
                }

                Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
                List<RfpQuoteNetwork> rfpQuoteNetworks = rfpQuoteNetworkRepository.findByRfpQuote(rfpQuote);

                if(rfpQuoteNetworks != null) {
                    if (CarrierType.isCarrierNameOnboardedAppCarrier(carrier.getName())) {
                        rfpQuoteNetworks = rfpQuoteNetworks.parallelStream()
                            .filter(r -> !r.getNetwork().getCarrier().getName().equals(ANTHEM_CLEAR_VALUE.name()) // skip CV cuz
                                && equalsAnyIgnoreCase(r.getNetwork().getType(), planTypes)
                            )
                            .collect(Collectors.toList());
                        handleRfpQuoteNetworks(client, rfpQuoteNetworks, true);

                    }else{
                        // do not filter multi carrier quotes so set customPlan to false and set clientId
                        handleRfpQuoteNetworks(client, rfpQuoteNetworks, false);
                    }
                }
            }
        }
    }

    private void handleRfpQuoteNetworks(Client client, List<RfpQuoteNetwork> rfpQuoteNetworks, boolean customPlan){
        for (RfpQuoteNetwork rfpQuoteNetwork : rfpQuoteNetworks) {
            if (rfpQuoteNetwork != null) {
                List<RfpQuoteNetworkPlan> rfpQuoteNetworkPlans = rfpQuoteNetworkPlanRepository
                    .findByRfpQuoteNetwork(rfpQuoteNetwork);

                for (RfpQuoteNetworkPlan rfpQuoteNetworkPlan : rfpQuoteNetworkPlans) {
                    if (rfpQuoteNetworkPlan.getPnn() != null) {
                        PlanNameByNetwork pnn = rfpQuoteNetworkPlan.getPnn();

                        if (!isNull(pnn.getClientId()) && !pnn.getClientId().equals(client.getClientId())) { // two rfpQuoteNetworks belonging to same client
//                            System.out.println(
//                                format("Found pnn with client_id already set. "
//                                        + "pnn_id=%s, rfpQuoteNetworkPlan_id=%s",
//                                    pnn.getPnnId(),
//                                    rfpQuoteNetworkPlan.getRfpQuoteNetworkPlanId()
//                                )
//                            );

                            // duplicate pnn and set appropriately
                            PlanNameByNetwork pnnCopy = pnn.copy();
                            pnnCopy.setCustomPlan(customPlan);
                            pnnCopy.setClientId(client.getClientId());
                            savePnn(pnnCopy);
                            rfpQuoteNetworkPlan.setPnn(pnnCopy);
                            rfpQuoteNetworkPlanRepository.save(rfpQuoteNetworkPlan);
                        } else {
                            pnn.setCustomPlan(customPlan);
                            pnn.setClientId(client.getClientId());

                            updatePrinter(customPlan ? "b'1'" : "b'0'", "'" +
                                    client.getClientId() + "'",
                                "'" + pnn.getPnnId() + "'");
                            //planNameByNetworkRepository.save(pnn);
                        }
                    }
                }
            }
        }
    }

    private void savePnn(PlanNameByNetwork pnnCopy){
        Plan plan = pnnCopy.getPlan();
        planRepository.save(plan);
        for(Benefit b : pnnCopy.getPlan().getBenefits()){
            b.setPlan(plan);
            benefitRepository.save(b);
        }
        planNameByNetworkRepository.save(pnnCopy);
    }

    private void updatePrinter(String customPlan, String clientId, String pnnId){
//        System.out.println(
//            format("UPDATE plan_name_by_network SET custom_plan = %s, client_id = %s WHERE pnn_id = %s;",
//                customPlan, clientId, pnnId
//            )
//        );
    }

}

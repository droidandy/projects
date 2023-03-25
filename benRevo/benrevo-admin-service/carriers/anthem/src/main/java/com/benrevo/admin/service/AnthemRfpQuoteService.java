package com.benrevo.admin.service;

import com.benrevo.be.modules.admin.service.BaseAdminRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteOptionNameToMatchingPlan;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.AdministrativeFeeRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.Constants.BENREVO_DEVSALE_EMAIL;
import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS;
import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static java.util.Optional.ofNullable;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemRfpQuoteService extends BaseAdminRfpQuoteService {

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private AdministrativeFeeRepository administrativeFeeRepository;
    
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Value("${app.env}")
    private String appEnv;
    
    /**
     * Returns the Anthem Matching Plans
     * @param rqn
     * @return
     */
    @Override
    protected List<RfpQuoteNetworkPlan> getRfpQuoteMatchingNetworkPlans(RfpQuoteNetwork rqn) {
        return rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(rqn);
    }
    
    protected void createQuotedClientCopyForSales(Long clientId) {
        List<Broker> salesTeam = new ArrayList<>();
        Client client = clientRepository.findOne(clientId);
        Broker currentClientBroker = client.getBroker();
        List<Person> ANTHEM_SALES_EMAILS = personRepository.findByCarrierIdAndType(
            sharedCarrierService.findByName(ANTHEM_BLUE_CROSS).getCarrierId(), PersonType.SALES);
        // create Brokerage accounts for sales team
        for (Person sales : ANTHEM_SALES_EMAILS) {
            Broker salesBrokerAccount = brokerRepository.findByName(sales.getFullName());
            if (salesBrokerAccount == null) {
                if (!"prod".equalsIgnoreCase(appEnv)) {
                    if(!sales.getEmail().equalsIgnoreCase(BENREVO_DEVSALE_EMAIL)) {
                        // for dev create BENREVO_DEVSALE_EMAIL only
                        continue;
                    }
                }
                salesBrokerAccount = new Broker();
                salesBrokerAccount.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
                salesBrokerAccount.setName(sales.getFullName());
                salesBrokerAccount.setSales(sales);
                
                salesBrokerAccount = brokerRepository.save(salesBrokerAccount);
            }
            // FIXME how to select current sales person?
            String salesEmail = sales.getEmail();
            String currentAccountSalesEmail = currentClientBroker.getSalesEmail();
            if (salesTeam.isEmpty() && salesEmail.equalsIgnoreCase(currentAccountSalesEmail)) {
                salesTeam.add(salesBrokerAccount);
            }
        }

        for (Broker sales : salesTeam) {
            List<Client> salesClients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                    client.getClientName(), sales.getBrokerId(), false);
            if (!salesClients.isEmpty()) {
                continue; //client already copied
            }
            // deep copy Client
            Client salesClient = client.copy();
            salesClient.setBroker(sales);
            if (salesClient.getClientTeamList() != null) {
                if (!salesClient.getClientTeamList().isEmpty()) {
                    ClientTeam clientTeam = salesClient.getClientTeamList().get(0);
                    clientTeam.setBroker(sales);
                    clientTeamRepository.save(clientTeam);
                }
            }
            salesClient = clientRepository.save(salesClient);

            // deep copy RFPs
            List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
            for (RFP rfp : rfps) {
                RFP rfpCopy = rfp.copy();
                rfpCopy.setClient(salesClient);
                rfpRepository.save(rfpCopy);
            }
            Map<Long, ClientPlan> clientPlanId2Copy = new HashMap<>();
            for (int i = 0; i < client.getClientPlans().size(); i++) {
                clientPlanId2Copy.put(
                    client.getClientPlans().get(i).getClientPlanId(),
                    salesClient.getClientPlans().get(i));
            }
            // deep copy RFP Quotes
            List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientId(clientId);
            for (RfpQuote rfpQuote : rfpQuotes) {
                RfpQuote quoteCopy = rfpQuote.copy();

                RfpSubmission subCopy = quoteCopy.getRfpSubmission().copy();
                subCopy.setClient(salesClient);
                subCopy = rfpSubmissionRepository.save(subCopy);

                quoteCopy.setRfpSubmission(subCopy);
                // update client plan to copy for sales client
                for (RfpQuoteOption quoteOpt : quoteCopy.getRfpQuoteOptions()) {
                    for (RfpQuoteOptionNetwork quoteOptNetw : quoteOpt.getRfpQuoteOptionNetworks()) {
                        if (quoteOptNetw.getClientPlan() != null) {
                            ClientPlan clPlanCopy = clientPlanId2Copy.get(quoteOptNetw.getClientPlan().getClientPlanId());
                            quoteOptNetw.setClientPlan(clPlanCopy);
                        }
                    }
                }
                rfpQuoteRepository.save(quoteCopy);
            }
        }
    }

    /**
     * Reset all match plans for Anthem given multiple match plans can be in a network
     * @param rfpQuote
     */
    @Override
    protected void resetMatchPlans(RfpQuote rfpQuote) {
        List<RfpQuoteNetwork> networks = rfpQuote.getRfpQuoteNetworks();
        for(RfpQuoteNetwork network : networks) {
            List<RfpQuoteNetworkPlan> matchingPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndMatchPlanTrue(network);
            matchingPlans.forEach(plan -> {
                plan.setMatchPlan(false);
                rfpQuoteNetworkPlanRepository.save(plan);
            });
        }
    }

    @Override
    protected void setSelectedRfpQuoteNetworkPlan(RfpQuoteOptionNetwork rqon,
        QuoteOptionNameToMatchingPlan quoteOptionInfo, String category,
        RfpQuoteNetwork quoteNetwork) {

        // set the new quoteNetworkPlans as the matching plan
        RfpQuoteNetworkPlan qnp = quoteNetwork.getRfpQuoteNetworkPlans()
            .stream()
            .filter(plan -> plan.getPnn().getPnnId().equals(quoteOptionInfo.getPnnId()))
            .findFirst()
            .orElseThrow(() -> new NotFoundException(String.format("Could not find any plan in network %s", quoteNetwork.getNetwork().getType())));
        qnp.setMatchPlan(true);
        rfpQuoteNetworkPlanRepository.save(qnp);
        rqon.setSelectedRfpQuoteNetworkPlan(qnp);
    }

    @Override
    protected AdministrativeFee getDefaultAdministrativeFee(Carrier carrier) {
        AdministrativeFee defaultFee = null;

        switch (carrier.getName()) {
            case Constants.ANTHEM_CARRIER:
                defaultFee = administrativeFeeRepository.findByCarrierCarrierIdAndName(carrier.getCarrierId(), DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS);
                break;
            case Constants.ANTHEM_CLEAR_VALUE_CARRIER:
                defaultFee = administrativeFeeRepository.findByCarrierCarrierIdAndName(carrier.getCarrierId(), DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE);
                break;
        }
        return  defaultFee;
    }
}

package com.benrevo.core.util;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static com.benrevo.common.util.MapBuilder.build;

import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.rfp.service.BaseRfpService;


/**
 * Created by Aleksei Korchak on 8/30/17.
 */
@Component
@Transactional
public class ClientLoaderUtility {

    @Autowired
    private CustomLogger LOGGER;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private BaseRfpService baseRfpService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpRepository rfpRepository;


    private boolean DEBUG = true;
    private List<Broker> brokerList = null;


    private void init() {
        if (brokerList == null) {
            brokerList = (List<Broker>) brokerRepository.findAll();
            print("Number of brokers found in DB: " + brokerList.size());
        }
    }

    public void loadClientToAllBrokers(InputStream is, String clientName) throws IOException {
        init();
        byte[] clientXml = IOUtils.toByteArray(is);

        for(int index = 0; index < brokerList.size(); index++) {
            Broker broker = brokerList.get(index);
            if(1 != broker.getBrokerId()) { //safety valve, so you don't accidentally run on all brokers in entire DB. Remove with caution.
                print("Only running on broker with id=1, skipping broker with id=" + broker.getBrokerId());
                continue;
            }

            ClientDto clientDto = clientService.importFromXML(clientXml, clientName, broker.getBrokerId(), false, null);
            if(clientDto.getBrokerId().equals(broker.getBrokerId())) {
                print("Create client for broker id: " + broker.getBrokerId() + " with name: " + clientDto.getClientName());
            }
        }
    }

    public void submitRFPsForClientName(String clientName) {
        init();
        for(int index = 0; index < brokerList.size(); index++) {
            Broker broker = brokerList.get(index);
            if(1 != broker.getBrokerId()) { //safety valve, so you don't accidentally run on all brokers in entire DB. Remove with caution.
                print("Only running on broker with id=1, skipping broker with id=" + broker.getBrokerId());
                continue;
            }

            List<Client> clients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                clientName, broker.getBrokerId(), false);

            Long clientId = clients.get(0).getClientId();
            List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
            List<Long> rfpIds = new ArrayList<>();

            for (RFP rfp : rfps) {
                rfpIds.add(rfp.getRfpId());
            }
            submitClearValueQuote(clientId, rfpIds);
        }
    }

    private void submitClearValueQuote(Long clientId, List<Long> rfpIds) {

        //TODO: EMAIL suppression, if the correct implementation of the RFP service emailService.sendRFPSubmission(clientId, rfpIds) should
        //commented out if you do not want to send UHC or Anthem emails in PROD.

        List<RfpSubmissionStatusDto> submissionStatusDtos = baseRfpService.rfpSubmission(clientId, rfpIds);

        //Do any validation on submission if needed.
        print("Submitted RFP for client: " + clientId);
    }

    private void print(String...strs) {
        if(DEBUG){
            StringBuilder sb = new StringBuilder();
            for (String str : strs) {
                sb.append(str);
            }
            LOGGER.debug(sb.toString());
        }
    }
}

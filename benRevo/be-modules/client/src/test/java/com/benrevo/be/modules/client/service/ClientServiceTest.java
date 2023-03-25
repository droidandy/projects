package com.benrevo.be.modules.client.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.ExtProductRepository;
import java.io.File;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;


public class ClientServiceTest extends AbstractControllerTest {

	@Autowired
	private ExtProductRepository extProductRepository;
	
	@Autowired
	private ClientRfpProductRepository clientRfpProductRepository;

	@Autowired
	private ClientService clientService;
	
	@MockBean(reset = MockReset.AFTER)
    private ClientMemberService clientMemberService;

	@Before
	@Override
	public void init() throws Auth0Exception {
//		initController(controller);
	}
	
	@Test
    public void exportToXML_importFromXML() throws Exception {
	    Broker broker = testEntityHelper.createTestBroker("xmlExportImportBroker");
        Client client = testEntityHelper.createTestClient("xmlExportImportClient", broker);

        Authentication authentication = mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(broker.getBrokerId());
        SecurityContextHolder.setContext(securityContext);
        
        // explicitly set fields need to be exported and imported
        client.setDeclinedOutside(true);
        
        RFP rfp = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork("Test HMO", Constants.UHC_CARRIER, "HMO");
        testEntityHelper.createTestRfpToPNN(rfp, pnn);        
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", pnn.getPlan(), "10", "20");
        
        testEntityHelper.createTestClientExtProduct(client, Constants.STD);
        testEntityHelper.createTestClientExtProduct(client, Constants.LTD);
        
        ExtProduct medical = extProductRepository.findByName(Constants.MEDICAL);
        ClientRfpProduct cp1 = new ClientRfpProduct(client.getClientId(), medical, true);
        clientRfpProductRepository.save(cp1);

        ExtProduct dental = extProductRepository.findByName(Constants.DENTAL);
        ClientRfpProduct cp2 = new ClientRfpProduct(client.getClientId(), dental, true);
        clientRfpProductRepository.save(cp2);
        
        byte[] bytes = clientService.exportToXML(client.getClientId());
        
        //File file = new File("export.xml");
        //FileUtils.writeByteArrayToFile(file, bytes);
        
        flushAndClear();
        
        ClientDto newClient = clientService.importFromXML(bytes, "NEW " + client.getClientName(), 
            broker.getBrokerId(), false, null);
        
        flushAndClear();
        
        ClientDto oldClient = clientService.getById(client.getClientId());

        newClient = clientService.getById(newClient.getId());

        assertThat(newClient).isEqualToIgnoringGivenFields(oldClient, 
            "id", "clientName", "clientToken", "clientMembers", "rfpProducts", "extProducts");
        
        assertThat(newClient.getExtProducts()).isNotEmpty()
            .usingElementComparatorIgnoringFields("extProductId")
            .isEqualTo(oldClient.getExtProducts());

        assertThat(newClient.getRfpProducts())
            .usingElementComparatorIgnoringFields("extProductId")
            .isEqualTo(oldClient.getRfpProducts());
    }

}

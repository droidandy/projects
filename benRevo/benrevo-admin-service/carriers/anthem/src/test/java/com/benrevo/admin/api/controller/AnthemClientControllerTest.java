package com.benrevo.admin.api.controller;

import com.benrevo.admin.AnthemAdminServiceApplication;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.dto.UpdateStatusDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertTrue;

public class AnthemClientControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private TimelineRepository timelineRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Test
    public void testUpdateClientStatus_ToQuoted() throws Exception {

        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), CarrierType.ANTHEM_BLUE_CROSS.name());
        
        for (ClientState fromState : Arrays.asList(ClientState.PENDING_APPROVAL, ClientState.ON_BOARDING)) {
          client.setClientState(fromState);
          client.setDateQuoteOptionSubmitted(new Date());
          client = clientRepository.save(client);

          testEntityHelper.createTestTimeline(client, carrier, 1L);
          testEntityHelper.createTestTimeline(client, carrier, 2L);
          
          List<Timeline> timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(client.getClientId(), carrier.getCarrierId());
          assertTrue(!timelines.isEmpty());
  
          UpdateStatusDto dto = new UpdateStatusDto();
          dto.setClientState(ClientState.QUOTED);
          
          attributeRepository.save(new ClientAttribute(client, AttributeName.TIMELINE_IS_ENABLED));
          
          MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/clients/{clientId}", client.getClientId());
  
          Client updatedClient = clientRepository.findOne(client.getClientId());
          assertEquals(dto.getClientState(), updatedClient.getClientState());
          assertNull(updatedClient.getDateQuoteOptionSubmitted());
          
          timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(client.getClientId(), carrier.getCarrierId());
          assertTrue(timelines.isEmpty());
          
          ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(client.getClientId(), AttributeName.TIMELINE_IS_ENABLED);
          assertNull(attribute);
        }
    }
}

package com.benrevo.be.modules.admin.service;


import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.ClientRepository;

public class CreateAllOption1ReleasedActivities extends AbstractControllerTest {

    protected static final Logger logger = LoggerFactory.getLogger(CreateAllOption1ReleasedActivities.class);
    
    @Autowired
    private BaseAdminEmailService emailService;

    @Autowired
    protected ClientRepository clientRepository;

    @Autowired
    protected ActivityRepository activityRepository;

    public void init() throws Exception {};

    @Test
    @Ignore // comment out to create OPTION1_RELEASED for all clients.
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void createOption1ReleasedActivity() throws Exception {

        Map<String, Set<Long>> clientIdsWithOption1Released = new HashMap();
        List<Activity> activities = activityRepository.findAll();
        for(Activity a : activities){
              if(a.getType() == ActivityType.OPTION1_RELEASED){
                  if(!clientIdsWithOption1Released.containsKey(a.getProduct())){
                      clientIdsWithOption1Released.put(a.getProduct(), new HashSet<>());
                  }
                  // add to set
                  clientIdsWithOption1Released.get(a.getProduct()).add(a.getClientId());
              }
        }

        for (Client client : clientRepository.findAll()) {

            if (!ClientState.QUOTED.equals(client.getClientState()) 
                    && !ClientState.PENDING_APPROVAL.equals(client.getClientState())
                    && !ClientState.ON_BOARDING.equals(client.getClientState())
                    && !ClientState.SOLD.equals(client.getClientState())) {
                // skip
                continue;
            }

            Set<Long> medicalClients = clientIdsWithOption1Released.get(MEDICAL);
            Set<Long> dentalClients = clientIdsWithOption1Released.get(DENTAL);
            Set<Long> visionClients = clientIdsWithOption1Released.get(VISION);
            
            logger.warn(String.format("client=%s clientId=%s clientState=%s", client.getClientName(), client.getClientId(), client.getClientState() ));
            
            // create OPTION1_RELEASED activity per product if we don't already have it
            if(medicalClients == null || !medicalClients.contains(client.getClientId())) {
                emailService.createOption1ReleasedActivity(client.getClientId(), MEDICAL);
            }

            if(dentalClients == null || !dentalClients.contains(client.getClientId())) {
                emailService.createOption1ReleasedActivity(client.getClientId(), DENTAL);
            }

            if(visionClients == null || !visionClients.contains(client.getClientId())) {
                emailService.createOption1ReleasedActivity(client.getClientId(), VISION);
            }
        }
    }
}

package com.benrevo.dashboard.service;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.RewardDetailsDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.repository.ActivityRepository;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class ClientDetailsServiceTest extends AbstractControllerTest {

    @Autowired
    private ClientDetailsService clientDetailsService;
    
    @Autowired
    private ActivityRepository activityRepository;

    @Override
    public void init() throws Exception {
 
    }
    
    @Test
    public void getLastRewardsDetails() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("RewardsEmailBroker");
        Client client = testEntityHelper.createTestClient("RewardsEmailClient", broker);
        Broker broker2 = testEntityHelper.createTestBroker("RewardsEmailBroker2");
        Client client2 = testEntityHelper.createTestClient("RewardsEmailClient2", broker2);
        
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker2, client2);
        ClientTeam clientTeam3 = testEntityHelper.createClientTeam(broker, client);
        
        Activity activity1 = testEntityHelper.createTestActivity(client, null, null, 
            ActivityType.REWARD, null, null, clientTeam1.getId(), clientTeam2.getId());

        Activity activity2 = testEntityHelper.createTestActivity(client, null, null, 
            ActivityType.REWARD, null, null, clientTeam3.getId());
        
        Activity completedActivity = testEntityHelper.createTestActivity(client2, null, null, 
            ActivityType.REWARD, null, null, clientTeam2.getId());
        completedActivity.setCompleted(new Date());
        activityRepository.save(completedActivity);
        
        User user1 = new User("test");
        user1.setEmail("member1@domain.test");
        user1.setUserMetadata(build(entry("first_name", "member1_first_name"), entry("last_name", "member1_last_name")));
        when(mgmtAPI.users().get(clientTeam1.getAuthId(), null).execute()).thenReturn(user1);
        
        User user2 = new User("test");
        user2.setEmail("member2@domain.test");
        user2.setUserMetadata(build(entry("first_name", "member2_first_name"), entry("last_name", "member2_last_name")));
        when(mgmtAPI.users().get(clientTeam2.getAuthId(), null).execute()).thenReturn(user2);
        
        User user3 = new User("test");
        user3.setEmail("member3@domain.test");
        user3.setUserMetadata(build(entry("first_name", "member3_first_name"), entry("last_name", "member3_last_name")));
        when(mgmtAPI.users().get(clientTeam3.getAuthId(), null).execute()).thenReturn(user3);
        
        List<RewardDetailsDto> rewards = clientDetailsService.getLastRewardsDetails();
        
        assertThat(rewards).hasSize(3);
        
        for(RewardDetailsDto dto : rewards) {
            assertThat(dto).hasNoNullFieldsOrProperties();
            assertThat(dto.getAddress()).isEqualTo(broker.getAddress());
            if(dto.getParticipantId().equals(user1.getEmail())) {
                assertThat(dto.isFirstReward()).isTrue();
                assertThat(dto.getActivityId()).isEqualTo(activity1.getActivityId());
                assertThat(dto.getCreated()).isEqualToIgnoringSeconds(activity1.getCreated());
                assertThat(dto.getEmail()).isEqualTo(user1.getEmail());
                assertThat(dto.getFirstName()).isEqualTo(user1.getUserMetadata().get("first_name"));
                assertThat(dto.getLastName()).isEqualTo(user1.getUserMetadata().get("last_name"));
            } else if(dto.getParticipantId().equals(user2.getEmail())) {
                assertThat(dto.getBrokerageName()).isEqualTo(broker2.getName());
                assertThat(dto.isFirstReward()).isFalse();
                assertThat(dto.getActivityId()).isEqualTo(activity1.getActivityId());
                assertThat(dto.getCreated()).isEqualToIgnoringSeconds(activity1.getCreated());
                assertThat(dto.getEmail()).isEqualTo(user2.getEmail());
                assertThat(dto.getFirstName()).isEqualTo(user2.getUserMetadata().get("first_name"));
                assertThat(dto.getLastName()).isEqualTo(user2.getUserMetadata().get("last_name"));
            } else {
                assertThat(dto.isFirstReward()).isTrue();
                assertThat(dto.getActivityId()).isEqualTo(activity2.getActivityId());
                assertThat(dto.getCreated()).isEqualToIgnoringSeconds(activity2.getCreated());
                assertThat(dto.getEmail()).isEqualTo(user3.getEmail());
                assertThat(dto.getFirstName()).isEqualTo(user3.getUserMetadata().get("first_name"));
                assertThat(dto.getLastName()).isEqualTo(user3.getUserMetadata().get("last_name"));
            }
            assertThat(dto.getPoints()).isEqualTo(100);  
        }
    }
}

package com.benrevo.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static java.util.Arrays.asList;
import static org.mockito.Mockito.when;
import java.util.Arrays;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;


@RunWith(MockitoJUnitRunner.class)
public class AnthemDashboardRfpServiceTest {

    @InjectMocks
    private AnthemDashboardRfpService rfpService = new AnthemDashboardRfpService();

    @Mock
    private RfpToPnnRepository rfpToPnnRepository;

    @Test
    public void calcRfpAttributes() throws Exception {

        OptionDto medicalOptionDto1 = new OptionDto();
        medicalOptionDto1.setId(1L);
        medicalOptionDto1.setTier1Census(1d);
        medicalOptionDto1.setTier2Census(1d);
        medicalOptionDto1.setTier3Census(1d);
        medicalOptionDto1.setTier4Census(1d);
        
        OptionDto medicalOptionDto2 = new OptionDto();
        medicalOptionDto2.setId(2L);
        medicalOptionDto2.setTier1Census(1d);
        medicalOptionDto2.setTier2Census(1d);
        medicalOptionDto2.setTier3Census(1d);
        medicalOptionDto2.setTier4Census(1d);
        
        RfpDto medicalRfpDto = new RfpDto();
        medicalRfpDto.setProduct(Constants.MEDICAL);
        medicalRfpDto.setOptions(asList(medicalOptionDto1, medicalOptionDto2));
        medicalRfpDto.getAttributes().put(RFPAttributeName.VALID_WAIVERS, "1");
        medicalRfpDto.getAttributes().put(RFPAttributeName.INVALID_WAIVERS, "80");
        Carrier carrier1 = new Carrier();
        carrier1.setName("TEST");
        Network network1 = new Network();
        network1.setCarrier(carrier1);
        PlanNameByNetwork pnn1 = new PlanNameByNetwork();
        pnn1.setPnnId(1L);
        pnn1.setNetwork(network1);
        RfpToPnn rfpToPnn1 = new RfpToPnn();
        rfpToPnn1.setPlanType("PPO");
        rfpToPnn1.setOptionId(1L);
        rfpToPnn1.setPnn(pnn1);

        Carrier carrier2 = new Carrier();
        carrier2.setName("KAISER");
        Network network2 = new Network();
        network2.setCarrier(carrier2);
        PlanNameByNetwork pnn2 = new PlanNameByNetwork();
        pnn2.setPnnId(2L);
        pnn2.setNetwork(network2);
        RfpToPnn rfpToPnn2 = new RfpToPnn();
        rfpToPnn2.setPlanType("HMO");
        rfpToPnn2.setOptionId(2L);
        rfpToPnn2.setPnn(pnn2);

        when(rfpToPnnRepository
            .findByRfpRfpIdAndOptionIdAndPlanType(medicalRfpDto.getId(), medicalOptionDto1.getId(),
                medicalOptionDto1.getPlanType())).thenReturn(rfpToPnn1);

        when(rfpToPnnRepository
                .findByRfpRfpIdAndOptionIdAndPlanType(medicalRfpDto.getId(), medicalOptionDto2.getId(),
                    medicalOptionDto2.getPlanType())).thenReturn(rfpToPnn2);
        
        
        OptionDto dentalOptionDto1 = new OptionDto();
        dentalOptionDto1.setId(1L);
        dentalOptionDto1.setTier1Census(1d);
        dentalOptionDto1.setTier2Census(1d);
        dentalOptionDto1.setTier3Census(1d);
        dentalOptionDto1.setTier4Census(1d);
        
        OptionDto dentalOptionDto2 = new OptionDto();
        dentalOptionDto2.setId(2L);
        dentalOptionDto2.setTier1Census(1d);
        dentalOptionDto2.setTier2Census(1d);
        dentalOptionDto2.setTier3Census(1d);
        dentalOptionDto2.setTier4Census(1d);
        
        RfpDto dentalRfpDto = new RfpDto();
        dentalRfpDto.setProduct(Constants.DENTAL);
        dentalRfpDto.setOptions(asList(dentalOptionDto1, dentalOptionDto2));

        rfpService.calcRfpAttributes(Arrays.asList(medicalRfpDto, dentalRfpDto));
        
        // Total Employees - enrolled+invalid waivers+valid waivers
        assertThat(medicalRfpDto.getAttributes().get(RFPAttributeName.TOTAL_EMPLOYEES)).isEqualTo("89");
        assertThat(medicalRfpDto.getAttributes().get(RFPAttributeName.FACTOR_LOAD_TAKEOVER_HMO)).isEqualTo("84%");
        assertThat(medicalRfpDto.getAttributes().get(RFPAttributeName.FACTOR_LOAD_TAKEOVER_PPO)).isEqualTo("88%");
        assertThat(medicalRfpDto.getAttributes().get(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_HMO)).isEqualTo("97%");
        assertThat(medicalRfpDto.getAttributes().get(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_PPO)).isEqualTo("93%");

        assertThat(dentalRfpDto.getAttributes().get(RFPAttributeName.DENTAL_PARTICIPATION)).isEqualTo("9%"); // 8/89 with rounding up

    }

}

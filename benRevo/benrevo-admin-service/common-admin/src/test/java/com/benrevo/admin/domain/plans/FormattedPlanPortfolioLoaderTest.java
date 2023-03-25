package com.benrevo.admin.domain.plans;

import static org.assertj.core.api.Assertions.assertThat;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.repository.CarrierRepository;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.Year;
import java.util.List;
import java.util.Map;

/**
 * Created by Aleksei on 4/19/18.
 */
@Ignore // time-consuming
public class FormattedPlanPortfolioLoaderTest  extends AbstractControllerTest {

    @Override
    public void init() throws Exception {
    }
    
    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Test
    public void testAnthemPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Anthem/2018/2018_Anthem_PlanDesign_Final_v2.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.ANTHEM_BLUE_CROSS.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);
    
        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> visions = parsedPlans.get("VISION");
        List<GenericPlanDetails> dhmos = parsedPlans.get("DHMO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(visions).isNotNull();
        assertThat(dhmos).isNotNull();
    
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());

    }

    @Test
    public void testAnthemClearValuePlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Anthem/2018/ClearValue/2018_Anthem_ClearValue_PlanDesign_Final_v2.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.ANTHEM_CLEAR_VALUE.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);
 
        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> visions = parsedPlans.get("VISION");
        List<GenericPlanDetails> dhmos = parsedPlans.get("DHMO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(visions).isNotNull();
        assertThat(dhmos).isNotNull();
 
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
        
    }

    @Test
    public void testUhcPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/UHC/2018/2018_UHC_PlanDesigns_v6.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.UHC.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);
      
        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> rxHmos = parsedPlans.get("RX_HMO");
        List<GenericPlanDetails> rxPpos = parsedPlans.get("RX_PPO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(rxHmos).isNotNull();
        assertThat(rxPpos).isNotNull();
        
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }
    
    @Test
	public void testAetnaPlans() throws Exception {
		String currDir = Paths.get("").toAbsolutePath().toString();

		File file = new File(currDir + "/data/carrierPlans/Aetna/Aetna_2018_Final_v2.xlsx"); 
		FileInputStream fis = new FileInputStream(file);
		Carrier carrier = carrierRepository.findByName(CarrierType.AETNA.name());
		
		Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);

        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> rxHmos = parsedPlans.get("RX_HMO");
        List<GenericPlanDetails> rxPpos = parsedPlans.get("RX_PPO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(rxHmos).isNotNull();
        assertThat(rxPpos).isNotNull();

	    planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
	}

    @Test
    public void testBlueShieldPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Blue Shield/Blue_Shield_2018_Final_v2.xlsx"); 
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.BLUE_SHIELD.name());
       
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);

        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> rxHmos = parsedPlans.get("RX_HMO");
        List<GenericPlanDetails> rxPpos = parsedPlans.get("RX_PPO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(rxHmos).isNotNull();
        assertThat(rxPpos).isNotNull();

        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    
    @Test
    public void testCignaPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Cigna/Cigna_2018_Final_v2.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.CIGNA.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);

        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Test
    public void testHealthnetPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Healthnet/Healthnet_2018_Final_v2.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.HEALTHNET.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);

        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        List<GenericPlanDetails> rxHmos = parsedPlans.get("RX_HMO");
        List<GenericPlanDetails> rxPpos = parsedPlans.get("RX_PPO");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        assertThat(rxHmos).isNotNull();
        assertThat(rxPpos).isNotNull();

        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    
    @Test
    public void testKaiserPlans() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/carrierPlans/Kaiser/Kaiser_2018_Final_v2.xlsx");
        FileInputStream fis = new FileInputStream(file);
        Carrier carrier = carrierRepository.findByName(CarrierType.KAISER.name());
        
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, false);
        
        List<GenericPlanDetails> hmos = parsedPlans.get("HMO");
        List<GenericPlanDetails> ppos = parsedPlans.get("PPO");
        List<GenericPlanDetails> hsas = parsedPlans.get("HSA");
        
        assertThat(hmos).isNotNull();
        assertThat(ppos).isNotNull();
        assertThat(hsas).isNotNull();
        
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

}

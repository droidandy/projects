package com.benrevo.admin.plans;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.repository.CarrierRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.Year;
import java.util.List;
import java.util.Map;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@Ignore // This is not actually validating the uploaded plans
public class BrokerAppCarrierPlanLoaderTest extends AdminAbstractControllerTest {

    public static final String AETNA_PLAN_DESIGN_FILE = "2018_Aetna_Final_v5.xlsx";
    public static final String BLUE_SHIELD_PLAN_DESIGN_FILE = "2018_Blue_Shield_Final_v5.xlsx";
    public static final String CIGNA_PLAN_DESIGN_FILE = "2018_Cigna_Final_v5.xlsx";
    public static final String HEALTHNET_PLAN_DESIGN_FILE = "2018_Healthnet_Final_v5.xlsx";
    public static final String KAISER_PLAN_DESIGN_FILE = "2018_Kaiser_Final_v5.xlsx";

    @Autowired
    private FormattedPlanPortfolioLoader planLoader;

    @Autowired
    private CarrierRepository carrierRepository;

    @Ignore
    @Test
    public void aetnaPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(CarrierType.AETNA.name());

        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Aetna/" + AETNA_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Ignore
    @Test
    public void blueShieldPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(CarrierType.BLUE_SHIELD.name());

        FileInputStream
            fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Blue_Shield/" + BLUE_SHIELD_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Ignore
    @Test
    public void cignaPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(CarrierType.CIGNA.name());

        FileInputStream
            fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Cigna/" + CIGNA_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Ignore
    @Test
    public void healthNetNetPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(CarrierType.HEALTHNET.name());

        FileInputStream
            fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Health_Net/" + HEALTHNET_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Ignore
    @Test
    public void kaiserNetPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(CarrierType.KAISER.name());

        FileInputStream
            fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Kaiser/" + KAISER_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }
}

package com.benrevo.admin.domain.plans;

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
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by lemdy on 6/15/17.
 */
@Ignore // This test is used to uploaded plans, not as unit test
public class UHCPlanLoaderTest extends AbstractControllerTest {

    private static final String UHC_PLAN_DESIGN_FILE_2018 = "2018_UHC_PlanDesigns_v20.xlsx";
    private static final String UHC_PLAN_DESIGN_FILE_2019 = "2019_UHC_PlanDesigns_v11.xlsx";

    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    
    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void uhc2018PlanProtfolioLoader() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrierUHC = carrierRepository.findByName(CarrierType.UHC.name());
       
        // upload plans 
        File myFile = new File(currDir + "/data/carrierPlans/UHC/2018/" + UHC_PLAN_DESIGN_FILE_2018);
        FileInputStream fis = new FileInputStream(myFile);
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierUHC, fis, true);
        planLoader.savePlans(carrierUHC, parsedPlans, 2018);
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void uhc2019PlanProtfolioLoader() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrierUHC = carrierRepository.findByName(CarrierType.UHC.name());

        // upload plans
        File myFile = new File(currDir + "/data/carrierPlans/UHC/2019/" + UHC_PLAN_DESIGN_FILE_2019);
        FileInputStream fis = new FileInputStream(myFile);
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierUHC, fis, true);
        planLoader.savePlans(carrierUHC, parsedPlans, 2019);
    }
}

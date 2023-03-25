package com.benrevo.admin.domain.plans;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
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
 * Created by lemdy on 6/15/17.
 */
@Ignore // This is not actually validating the uploaded plans
public class AnthemPlanLoaderTest extends AdminAbstractControllerTest {

    private static final String ANTHEM_PLAN_DESIGN_FILE = "2017_Anthem_PlanDesign_v15.xlsx";
    private static final String ANTHEM_CV_PLAN_DESIGN_FILE = "2017_Anthem_ClearValue_PlanDesign_v14.xlsx";

    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Test
    public void anthemPlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CARRIER);

        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Anthem/2017/" + ANTHEM_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

    @Test
    public void anthemClearValuePlanProtfolioLoader() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER); //Clear value carrier

        //Clear Value (Instant Quote) plans
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Anthem/2017/ClearValue/" + ANTHEM_CV_PLAN_DESIGN_FILE));
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, Year.now().getValue());
    }

}

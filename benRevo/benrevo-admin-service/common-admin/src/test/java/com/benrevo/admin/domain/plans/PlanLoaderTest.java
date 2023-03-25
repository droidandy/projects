package com.benrevo.admin.domain.plans;

import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.repository.CarrierRepository;
import org.junit.Ignore;
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
//@Transactional(rollbackFor = Exception.class) //comment out to create client with quotes uploaded in broker account.
public class PlanLoaderTest  extends AbstractControllerTest {

    private final String CIGNA = "CIGNA";

    private static final String TEST_CIGNA_PLAN_DESIGN_FILE = "Test_Cigna_PlanDesigns_v2.xlsx";
    private static final String TEST_KAISER_PLAN_DESIGN_FILE= "Test_Kaiser_PlanDesigns_v1.xlsx";

    @Override
    public void init() throws Exception {
    }
    
    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

     /**********************************************
     * Test plans for DEMO or testing purposes
     **********************************************/

    //@Test // Test plans for DEMO only
	public void testCignaPlansForIncumbent() throws Exception {
		String currDir = Paths.get("").toAbsolutePath().toString();

		File myFile = new File(currDir + "/data/carrierPlans/Cigna/" + TEST_CIGNA_PLAN_DESIGN_FILE);
		FileInputStream fis = new FileInputStream(myFile);
		Carrier carrierCIGNA = carrierRepository.findByName(CIGNA);
		
		Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierCIGNA, fis, true);
	    planLoader.savePlans(carrierCIGNA, parsedPlans, Year.now().getValue());
	}

    //@Test // Test plans for DEMO only
    public void testKaiserPlansForIncumbent() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();

        File myFile = new File(currDir + "/data/carrierPlans/Kaiser/" + TEST_KAISER_PLAN_DESIGN_FILE);
        FileInputStream fis = new FileInputStream(myFile);
        Carrier carrierKiser = carrierRepository.findByName(Constants.KAISER_CARRIER);
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierKiser, fis, true);
        planLoader.savePlans(carrierKiser, parsedPlans, Year.now().getValue());
    }
}

package com.benrevo.admin.domain.plans;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanHistory;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.PlanHistoryRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.time.Year;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lemdy on 6/15/17.
 */
public class UHCPlanHistoryTest extends AdminAbstractControllerTest {

    private static final String TEST_NEW_PLAN_DESIGN_FILE = "Test_UHC_Plan_History_New_Plan.xlsx";
    private static final String TEST_NEW_PLAN_UPDATE_BENEFITS_DESIGN_FILE = "Test_UHC_Plan_History_Plan_Update_Benefits.xlsx";

    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    PlanHistoryHelper planHistoryHelper;

    @Autowired
    PlanHistoryRepository planHistoryRepository;

    @Autowired
    private PlanRepository planRepository;

    @Test
    public void addingNewPlan() throws Exception{
        Carrier carrierUHC = carrierRepository.findByName(Constants.UHC_CARRIER);
        Map<String, List<GenericPlanDetails>> parsedPlans = addPlanHelper();

        final int currentYear = Year.now().getValue();
        
        parsedPlans.forEach((planType, planDetails) -> {
            planDetails.forEach(detail -> {
                Plan newPlan = planRepository.findByCarrierCarrierIdAndPlanTypeAndNameAndPlanYear(
                    carrierUHC.getCarrierId(), planType, detail.getCalculatedName(), currentYear);

                Assert.assertNotNull(newPlan);
                Assert.assertEquals(newPlan.getName(), detail.getCalculatedName());
                List<PlanHistory> planHistories = planHistoryRepository.findByPlanName(newPlan.getName());
                Assert.assertEquals(planHistories.size(), 0);
            });
        });
    }


    private Map<String, List<GenericPlanDetails>> addPlanHelper() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrierUHC = carrierRepository.findByName(Constants.UHC_CARRIER);

        // upload plans
        File myFile = new File(currDir + "/data/carrierPlans/UHC/2017/" + TEST_NEW_PLAN_DESIGN_FILE);
        FileInputStream fis = new FileInputStream(myFile);

        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierUHC, fis, true);
        planLoader.savePlans(carrierUHC, parsedPlans, Year.now().getValue());

        return parsedPlans;
    }

    @Test
    public void updatingPlan() throws Exception {
//        Long initialBatchNumber = planHistoryHelper.getNextBatchNumber();
//        addPlanHelper();
//
//        // upload update file
//
//        String currDir = Paths.get("").toAbsolutePath().toString();
//
//        // upload plans
//        File myFile = new File(currDir + "/data/carrierPlans/UHC/2017/" + TEST_NEW_PLAN_UPDATE_BENEFITS_DESIGN_FILE);
//        FileInputStream fis = new FileInputStream(myFile);
//        Carrier carrierUHC = carrierRepository.findByName(Constants.UHC_CARRIER);
//
//        Long batchNumber = planHistoryHelper.getNextBatchNumber();
//        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrierUHC, fis, true);
//        planLoader.savePlans(carrierUHC, parsedPlans);
//
//        parsedPlans.forEach((planType, planDetails) -> {
//            planDetails.forEach(detail -> {
//                Plan newPlan = planRepository.findByCarrierCarrierIdAndPlanTypeAndName(carrierUHC.getCarrierId(), planType, detail.getCalculatedName());
//
//                Assert.assertNotNull(newPlan);
//
//                List<PlanHistory> newPlanHistories = planHistoryRepository.findByPlanNameAndBatchNumber(newPlan.getName(), batchNumber);
//
//                for(PlanHistory history : newPlanHistories) {
//                    JSONObject h = new JSONObject(history.getBenefitTo());
//                    Benefit matchingBenefit =  null;
//                    for(Benefit b: detail.getBenefits()){
//                        if(h.getJSONObject("benefitName").getString("name").equalsIgnoreCase(b.getBenefitName().getName())
//                            && h.getString("inOutNetwork").equalsIgnoreCase(b.getInOutNetwork())){
//                            matchingBenefit = b;
//                            break;
//                        }
//                    }
//                    if(matchingBenefit != null) {
//                        verifyHistories(history.getBenefitTo(), jsonUtils.toJson(matchingBenefit));
//                    }
//                }
//            });
//        });

    }

    private void verifyHistories(String oldHistory, String newHistory) throws Exception{

        JSONObject b1 = new JSONObject(oldHistory);
        JSONObject b2 = new JSONObject(newHistory);
        Assert.assertTrue(b1.getString("value").equalsIgnoreCase(b2.getString("value")));
        //Assert.assertTrue(b1.getString("format").equalsIgnoreCase(b2.getString("format")));
    }
 
}

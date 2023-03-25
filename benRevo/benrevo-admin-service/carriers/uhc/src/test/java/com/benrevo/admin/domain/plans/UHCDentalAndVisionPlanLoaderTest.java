package com.benrevo.admin.domain.plans;

import com.benrevo.admin.domain.plans.UHC.UHCDentalVisionFormattedPlanLoader;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.CarrierRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@Ignore // This test is used to uploaded plans, not as unit test
public class UHCDentalAndVisionPlanLoaderTest extends AbstractControllerTest {

    private static final String UHC_DENTAL_PLAN_DESIGN_FILE_2018 = "2018_UHC_Dental_PlanDesign_v1.xlsx";
    private static final String UHC_DENTAL_PLAN_DESIGN_FILE_2019 = "2019_UHC_Dental_PlanDesign_v1.xlsx";

    @Autowired
    FormattedPlanPortfolioLoader genericPlanLoader;

    @Autowired
    private CarrierRepository carrierRepository;

    /**
     * This test will load DPPO and DHMO plans designs, to load a single product update
     * UHCDentalVisionFormattedPlanLoader.isValidProduct() with desired products.
     *
     * @throws Exception
     */
    @Test
    //@Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void uhc2018DentalPlanPortfolioLoader() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrierUHC = carrierRepository.findByName(CarrierType.UHC.name());

        // upload plans
        File myFile = new File(currDir + "/data/carrierPlans/UHC/2018/dental/" + UHC_DENTAL_PLAN_DESIGN_FILE_2018);
        FileInputStream fis = new FileInputStream(myFile);
        Map<String, List<GenericPlanDetails>> parsedPlans = genericPlanLoader.parsePlans(carrierUHC, fis, false);
        genericPlanLoader.savePlans(carrierUHC, parsedPlans, 2018);
    }

    /**
     *  /**
     * This test will load DPPO and DHMO plans designs, to load a single product update
     * UHCDentalVisionFormattedPlanLoader.isValidProduct() with desired products.
     *
     * @throws Exception
     */
    @Test
    //@Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void uhc2019DentalPlanPortfolioLoader() throws Exception {
        String currDir = Paths.get("").toAbsolutePath().toString();
        Carrier carrierUHC = carrierRepository.findByName(CarrierType.UHC.name());

        // upload plans
        File myFile = new File(currDir + "/data/carrierPlans/UHC/2019/dental/" + UHC_DENTAL_PLAN_DESIGN_FILE_2019);
        FileInputStream fis = new FileInputStream(myFile);
        Map<String, List<GenericPlanDetails>> parsedPlans = genericPlanLoader.parsePlans(carrierUHC, fis, false);
        genericPlanLoader.savePlans(carrierUHC, parsedPlans, 2019);
    }
}

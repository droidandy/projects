package com.benrevo.admin.plans;

import com.benrevo.admin.program.AnthemBeyondBenefitPlanParser;
import com.benrevo.admin.program.AnthemTechnologyTrustPlanParser;
import com.benrevo.admin.program.DeltaDentalBeyondBenefitPlanParser;
import com.benrevo.admin.program.VSPBeyondBenefitPlanParser;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.ProgramPlanLoader;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lemdy on 4/9/18.
 */
@Ignore
public class BrokerAppPlanLoaderTest extends AbstractControllerTest{

    /**
     * Beyond Benefit Trust
     */
    // Anthem
    private static final String ANTHEM_BBT_PLAN_DESIGN_FILE = "2018_BBLST_Anthem_PlanDesigns.xlsx";
    private static final String ANTHEM_BBT_SOCAL_PLAN_RATES = "2018 BBLST SOCAL Template Rev9 INTERNAL_RAW_RATES.xlsm";
    private static final String ANTHEM_BBT_NORCAL_PLAN_RATES = "2018 BBLST NORCAL Template Rev9 INTERNAL_RAW_RATES.xlsm";

    // VSP
    private static final String VSP_BBT_PLAN_DESIGN_FILE = "2018_BBLST_VSP_PlanDesigns.xlsx";
    private static final String VSP_BBT_PLAN_RATES = "VSP_RAW_RATES.xlsx";

    // Delta Dental
    private static final String DELTA_DENTAL_BBT_PLAN_DESIGN_FILE = "2018_BBLS_DeltaDental_PlanDesigns.xlsx";
    private static final String DELTA_DENTAL_BBT_PLAN_RATES = "2018_BBLST - Delta Dental_RAW_RATES.xlsx";

    // Technology Trust
    private static final String ANTHEM_TT_PLAN_DESIGN_FILE = "2018_SCHTBT_Anthem_PlanDesigns.xlsx";
    private static final String ANTHEM_TT_PLAN_RATES = "2018 SCHTBT RFP Rev7 unlocked.xlsm";

    //
    private static final Integer planYear = 2018;

    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    @Autowired
    private AnthemBeyondBenefitPlanParser anthemBeyondBenefitPlanParser;

    @Autowired
    private AnthemTechnologyTrustPlanParser anthemTechnologyTrustPlanParser;

    @Autowired
    private VSPBeyondBenefitPlanParser vspBeyondBenefitPlanParser;

    @Autowired
    private DeltaDentalBeyondBenefitPlanParser deltaDentalBeyondBenefitPlanParser;

    @Autowired
    private ProgramPlanLoader programPlanLoader;


    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void runTestsInOrder() throws Exception{
        // load plan designs first
        createProgramsForCarriers();
        anthemBBTPlansDesignsUpload();
        anthemTTPlansDesignsUpload();
        VSP_BBT_PlansDesignsUpload();
        Delta_Dental_BBT_PlansDesignsUpload();

        // then load plans
        anthemBBTPlans();
        anthem_Technology_Trust_Plans();
        vsp_BBT_Plans();
        delta_dental_BBT_Plans();
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void createProgramsForCarriers() throws Exception{
        // Anthem BBT Program
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM, Constants.MEDICAL);
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM, Constants.DENTAL);
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM, Constants.VISION);

        // VSP BBT Program
        programCreaterHelper(CarrierType.VSP.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM, Constants.VISION);

        // Delta Dental BBT Program
        programCreaterHelper(CarrierType.DELTA_DENTAL.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM, Constants.DENTAL);

        // Anthem Technology Trust
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.TECH_TRUST_PROGRAM, Constants.MEDICAL);
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.TECH_TRUST_PROGRAM, Constants.DENTAL);
        programCreaterHelper(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.TECH_TRUST_PROGRAM, Constants.VISION);
    }

    private void programCreaterHelper(String carrierName, String programName, String category){
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrierName, category);
        Program program = testEntityHelper.createTestProgram(programName, rfpCarrier);
    }

    /**
     *  Section for uploading Beyond Benefit Plan Designs
     *
     */

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void anthemBBTPlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/BBT/Anthem/2018/" + ANTHEM_BBT_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.ANTHEM_BLUE_CROSS.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.BEYOND_BENEFITS_TRUST_PROGRAM, planYear);
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void anthemTTPlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/Technology_Trust/Anthem/2018/" + ANTHEM_TT_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.ANTHEM_BLUE_CROSS.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.TECH_TRUST_PROGRAM, planYear);
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void VSP_BBT_PlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/BBT/VSP/2018/" + VSP_BBT_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.VSP.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.BEYOND_BENEFITS_TRUST_PROGRAM, planYear);
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void Delta_Dental_BBT_PlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/BBT/Delta_Dental/2018/" + DELTA_DENTAL_BBT_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.DELTA_DENTAL.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.BEYOND_BENEFITS_TRUST_PROGRAM, planYear);
    }


    /**
     * Plan Rates Loading Section
     * @throws Exception
     */

    @Test
    public void anthemBBTPlans() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();

        // Parse South Anthem BBT Plans and Store in Plan_Rate Table
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/BBT/Anthem/2018/" + ANTHEM_BBT_SOCAL_PLAN_RATES));
        anthemBeyondBenefitPlanParser.parseFile(BrokerLocale.SOUTH, fis);

        // Parse North Anthem BBT Plans and Store in Plan_Rate Table
        fis = new FileInputStream(new File(currDir + "/data/carrierPlans/BBT/Anthem/2018/" + ANTHEM_BBT_NORCAL_PLAN_RATES));
        anthemBeyondBenefitPlanParser.parseFile(BrokerLocale.NORTH, fis);
    }

    @Test
    public void anthem_Technology_Trust_Plans() throws Exception{

        // parse and save plan design
        String currDir = Paths.get("").toAbsolutePath().toString();

        // Parse Anthem TT Plans and Store in Plan_Rate Table
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/Technology_Trust/Anthem/2018/" + ANTHEM_TT_PLAN_RATES));
        anthemTechnologyTrustPlanParser.parseFile(BrokerLocale.SOUTH, fis);
    }


    @Test
    public void vsp_BBT_Plans() throws Exception{

        // parse and save plan design
        String currDir = Paths.get("").toAbsolutePath().toString();

        // Parse Anthem TT Plans and Store in Plan_Rate Table
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/BBT/VSP/2018/" + VSP_BBT_PLAN_RATES));
        vspBeyondBenefitPlanParser.parseFile(fis);
    }


    @Test
    public void delta_dental_BBT_Plans() throws Exception{

        // parse and save plan design
        String currDir = Paths.get("").toAbsolutePath().toString();

        // Parse Anthem TT Plans and Store in Plan_Rate Table
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/BBT/Delta_Dental/2018/" + DELTA_DENTAL_BBT_PLAN_RATES));
        deltaDentalBeyondBenefitPlanParser.parseFile(fis);
    }

    private String deriveProduct(String planType){
        if(planType.equalsIgnoreCase("HMO") || planType.equalsIgnoreCase("PPO")
            || planType.equalsIgnoreCase("HSA")){
            return Constants.MEDICAL;
        }else if(planType.equalsIgnoreCase("DHMO") || planType.equalsIgnoreCase("DPPO")){
            return Constants.DENTAL;
        }else if(planType.equalsIgnoreCase("VISION")){
            return Constants.VISION;
        }
        return null;
    }

}

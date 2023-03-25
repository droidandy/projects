package com.benrevo.admin.plans;

import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;

import com.benrevo.admin.program.CLSATrustClientParser;
import com.benrevo.admin.program.CLSATrustClientParser.CLSACLientData;
import com.benrevo.admin.program.CLSATrustClientParser.CLSACLientData.ClientRates;
import com.benrevo.admin.program.CLSATrustPlanParser;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.ProgramPlanLoader;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedBrokerProgramService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientExtProduct;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientExtProductRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.ExtProductRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by lemdy on 7/02/18.
 */
@Ignore // uncomment and run at once to upload data in DEV DB
public class BrokerAppCLSATrustLoaderTest extends AbstractControllerTest{

    /**
     * CLSA Trust
     */
    // UHC
    private static final String UHC_CLSA_PLAN_DESIGN_FILE = "2018_CLSA_UHC_Medical_PlanDesigns.xlsx";

    // METLIFE
    private static final String METLIFE_CLSA_PLAN_DESIGN_FILE = "2018_CLSA_MetLife_PlanDesigns.xlsx";

    // CIGNA
    private static final String CIGNA_CLSA_PLAN_DESIGN_FILE = "2018_Cigna_Life_Disability_PlanDesigns.xlsx";

    private static final String CLSA_TRUST_RATES_2018 = "CLSA Trust Rates_All_2018.xlsx";
    private static final String CLSA_TRUST_RATES_2019 = "CLSA Trust Rates_All_2019_Sample.xlsx";

    private static final String CLSA_RENEWAL_CLIENTS_AND_PLANS_FILE = "CLSA_renewal_clients_and_plans.xlsx";
    
    private static final Integer planYear = 2018;

    @Autowired
    FormattedPlanPortfolioLoader planLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private CLSATrustPlanParser clsaTrustPlanParser;
    
    @Autowired
    private CLSATrustClientParser clsaTrustClientParser;

    @Autowired
    private ProgramPlanLoader programPlanLoader;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SharedBrokerProgramService sharedBrokerProgramService;
    
    @Autowired
    private SharedRfpService sharedRfpService;
    
    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
    
    @Autowired
    private ProgramToPnnRepository programToPnnRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private ExtProductRepository extProductRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private ClientExtProductRepository clientExtProductRepository;

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void runTestsInOrder() throws Exception{

        UHCCLSAPlansDesignsUpload();
        MetLifeCLSAPlansDesignsUpload();
        CignaCLSAPlansDesignsUpload();

        // save the plan rates
        CLSAPlans();
    }
    
    /**
     *  Section for uploading Beyond Benefit Plan Designs
     *
     */
    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void UHCCLSAPlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/CLSA/UHC/2018/" + UHC_CLSA_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.UHC.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.CLSA_TRUST_PROGRAM, planYear);
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void MetLifeCLSAPlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/CLSA/METLIFE/2018/" + METLIFE_CLSA_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.METLIFE.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.savePlans(fis, carrier, Constants.CLSA_TRUST_PROGRAM, planYear);
    }
    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void CignaCLSAPlansDesignsUpload() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        String filePath = currDir + "/data/carrierPlans/CLSA/CIGNA/2018/" + CIGNA_CLSA_PLAN_DESIGN_FILE;

        Carrier carrier = carrierRepository.findByName(CarrierType.CIGNA.name());
        FileInputStream fis = new FileInputStream(new File(filePath));
        programPlanLoader.saveAncillaryPlans(fis, carrier, Constants.CLSA_TRUST_PROGRAM, planYear);
    }


    /**
     * Plan Rates Loading Section
     * @throws Exception
     */

    @Test
    public void CLSAPlans() throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();

        // Parse CLSA Plans and Store in Plan_Rate Table
        String planFile = "";
        switch(planYear){
            case 2018:
                planFile = CLSA_TRUST_RATES_2018;
                break;
            case 2019:
                planFile = CLSA_TRUST_RATES_2019;
                break;
            default:
                throw new BaseException("Unknown plan year");
        }

        FileInputStream fis = new FileInputStream(
                new File(currDir + "/data/carrierPlans/CLSA/" + planFile));
        clsaTrustPlanParser.parseFile(fis, planYear);
    }
    
    /**
     * NOTES
     * 1) run plans upload (w/o rates, only plan designs) with planYear = 2019
     * - UHCCLSAPlansDesignsUpload();
     * - MetLifeCLSAPlansDesignsUpload();
     * - CignaCLSAPlansDesignsUpload();
     * 2) run CLSARenewalClients for testing
     * 
     * if need to store plans in DB,  use @Transactional(propagation = Propagation.NOT_SUPPORTED) 
     */
    @Test
    //@Transactional(propagation = Propagation.NOT_SUPPORTED) // force commit
    public void CLSARenewalClients() throws Exception {
    	
    	Broker broker = brokerRepository.findByName("CLSA HUB Broker");
    	if (broker == null) {
    		broker = testEntityHelper.createTestBroker("CLSA HUB Broker");
    	}		
    	
        String currDir = Paths.get("").toAbsolutePath().toString();

        // https://stackoverflow.com/questions/44897500/using-apache-poi-zip-bomb-detected
        ZipSecureFile.setMinInflateRatio(0.001);
        
        // Parse CLSA Plans and Store in Plan_Rate Table
        FileInputStream fis = new FileInputStream(new File(currDir + "/data/carrierPlans/CLSA/" + CLSA_RENEWAL_CLIENTS_AND_PLANS_FILE));
        Map<Long, CLSACLientData> clients = clsaTrustClientParser.parseFile(
        		fis, broker.getName(), planYear, DateHelper.fromStringToDate("01/01/2019"));
        
        List<Program> programs = programRepository.findByName(Constants.CLSA_TRUST_PROGRAM);
        
        for (Program program : programs) {
        	clients.forEach((clientId, clientData) -> {
        		Client client = clientRepository.findOne(clientId);
        		RfpCarrier rfpCarrier = program.getRfpCarrier();
            	PlanCategory planCategory = PlanCategory.valueOf(rfpCarrier.getCategory());
            	String mainPlanCategoryName = getMainPlanCategoryName(planCategory);
                ExtProduct extProduct = extProductRepository.findByName(mainPlanCategoryName);
	
            	if (planCategory.isAncillary()) {
                	List<AncillaryPlan> plans = clientData.ancillary.get(planCategory);
                	if (CollectionUtils.isEmpty(plans)) { // NOTE ListMultimap returns empty list for missing key
	                	System.out.println("Ignored product " + planCategory + " for client " + client.getClientName());
	            		return; // skip forEach iteration
                	}
                	for (AncillaryPlan plan : plans) {
                		ClientPlan oldPlan = clientPlanRepository.findByClientAndPnnPlanTypeAndAncillaryPlan(client, planCategory.name(), plan);
                    	if (isNull(oldPlan)) {
                    		sharedRfpService.createAncillaryClientPlans(client, planCategory.name(), Collections.singletonList(plan));
                    	} else {
                    		if (oldPlan.getPnn().getPlan().getPlanYear() != plan.getPlanYear()) {
                    			throw new BaseException("Client plan year and ancillary plan year mismatch");
                    		}
                    		oldPlan.setAncillaryPlan(plan); // set up updated ancillary plan
                    		oldPlan.getPnn().getPlan().setName(plan.getPlanName());
                    		planRepository.save(oldPlan.getPnn().getPlan());
                    		
                    		oldPlan.getPnn().setName(plan.getPlanName());
                    		planNameByNetworkRepository.save(oldPlan.getPnn());
                    	}
					}

					// For ancillary, save to ClientExtProduct
                    if(extProduct != null){
                        ClientExtProduct clientExtProduct = clientExtProductRepository.findByClientId(clientId).stream()
                            .filter(c -> c.getExtProduct().getName().equalsIgnoreCase(mainPlanCategoryName))
                            .findFirst()
                            .orElse(new ClientExtProduct(clientId, extProduct)); // create new one if not found
                        clientExtProductRepository.save(clientExtProduct);
                    }

                } else {
                	List<ClientRates> rates = clientData.products.get(planCategory);	
                	if (CollectionUtils.isEmpty(rates)) {
	                	System.out.println("Ignored product " + planCategory + " for client " + client.getClientName());
	            		return; // skip forEach iteration
                	}
                    for (ClientRates planRate : rates) {
						List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
								clientId, planCategory.getPlanTypes());
						ClientPlan clientPlan = clientPlans.stream()
								.filter(cp -> cp.getPnn().getPnnId().equals(planRate.pnn.getPnnId()))
								.findFirst().orElse(null);
						if (clientPlan == null) {
							clientPlan = prepareClientPlan(client);
						}
						clientPlan.setPnn(planRate.pnn);
						clientPlan.setRxPnn(planRate.rxPnn);
						clientPlan.setPlanType(planRate.pnn.getPlanType());

						clientPlan.setTier1Rate(planRate.tier1);
						clientPlan.setTier2Rate(planRate.tier2);
						clientPlan.setTier3Rate(planRate.tier3);
						clientPlan.setTier4Rate(planRate.tier4);
						
						clientPlan.setTier1Census(planRate.tier1Enrollment);
						clientPlan.setTier2Census(planRate.tier2Enrollment);
						clientPlan.setTier3Census(planRate.tier3Enrollment);
						clientPlan.setTier4Census(planRate.tier4Enrollment);
						
						clientPlanRepository.save(clientPlan);
					}
                }

                // save client rfp product
            	if(extProduct != null){
                    ClientRfpProduct clientRfpProduct = clientRfpProductRepository.findByClientId(clientId).stream()
                        .filter(c -> c.getExtProduct().getName().equalsIgnoreCase(mainPlanCategoryName))
                        .findFirst()
                        .orElse(new ClientRfpProduct(clientId, extProduct, false)); // create new one if not found

                    clientRfpProductRepository.save(clientRfpProduct);
                }
                // generate Renewal options
                CLSARenewalOptions(clientId, program, clientData);
        	});	

		}  
    }

    private String getMainPlanCategoryName(PlanCategory planCategory){
        if(planCategory.name().contains("LIFE")) {
            return LIFE;
        } else if(planCategory.name().contains("STD")) {
            return STD;
        } else if(planCategory.name().contains("LTD")){
            return LTD;
        } else {
            return planCategory.name();
        }
    }
    
    public void CLSARenewalOptions(Long clientId, Program program, CLSACLientData clientData){
    	Client client = clientRepository.findOne(clientId);
        RfpSubmission rs = rfpSubmissionRepository.findByProgramAndClient(program, client);
        if (rs == null) {
            rs = new RfpSubmission();
            rs.setCreated(DateHelper.fromDateToString(new Date(), DATETIME_FORMAT));
        }
        rs.setClient(client);
        rs.setProgram(program);
        rs.setDisqualificationReason(null);
        rs.setRfpCarrier(program.getRfpCarrier());
        rs.setSubmittedBy("Benrevo CLSA Submitter");
        rs.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rs);
        
        CreateProgramQuoteDto quoteParams = new CreateProgramQuoteDto();
        quoteParams.setClientId(clientId);
        quoteParams.setProgramId(program.getProgramId());
        quoteParams.setZipCode(clientData.zipCode);
        quoteParams.setAverageAge(clientData.avgAge);
        if (program.getRfpCarrier().getCategory().equals(Constants.DENTAL)) {
            quoteParams.setNumEligibleEmployees(clientData.dentalEligible);
            quoteParams.setRegion(clientData.dentalRegion);
        } else if (program.getRfpCarrier().getCategory().equals(Constants.VISION)) {
            quoteParams.setNumEligibleEmployees(clientData.visionEligible);
            quoteParams.setRegion(clientData.visionRegion);
        }

        RfpQuote rfpQuote = sharedBrokerProgramService.createQuotes(quoteParams);

        if(rfpQuote == null){
            throw new BaseException("Issue creating CLSA Trust Quote. Quote is empty");
        }

        // Generating trust Renewal option
        sharedBrokerProgramService.createOption(rfpQuote,
            program.getRfpCarrier().getCategory(), OptionType.RENEWAL);
    }
    
    private ClientPlan prepareClientPlan(Client client) {
    
    	ClientPlan clientPlan = new ClientPlan();
		clientPlan.setClient(client);
		
		clientPlan.setTier1Census(0L);
		clientPlan.setTier2Census(0L);
		clientPlan.setTier3Census(0L);
		clientPlan.setTier4Census(0L);

		clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
		clientPlan.setTier1ErContribution(0f);
		clientPlan.setTier2ErContribution(0f);
		clientPlan.setTier3ErContribution(0f);
		clientPlan.setTier4ErContribution(0f);
		
		return clientPlan;
    }
}

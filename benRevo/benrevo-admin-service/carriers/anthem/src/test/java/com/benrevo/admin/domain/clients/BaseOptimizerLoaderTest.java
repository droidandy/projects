package com.benrevo.admin.domain.clients;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.auth0.json.mgmt.users.UsersPage;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.common.Constants;
import com.benrevo.common.anthem.*;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import com.monitorjbl.xlsx.StreamingReader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

public class BaseOptimizerLoaderTest extends AdminAbstractControllerTest {
    
    private static final float DELTA = 0.0001F;
    
    @Autowired
    private BaseOptimizerLoader baseOptimizerLoader;
    
    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;
    
    //@Autowired
    //private ClientTeamRepository clientTeamRepository;
    

    protected DateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy");

    private final String AMINI_CLIENT_NAME = "AMINI INNOVATION CORP.";
    private final String MARSH_AND_MCLEANNAN_BROKERAGE_NAME = "Marsh & McLennan";
    private final String MARSH_AND_MCLEANNAN_SIC_CODE = "5021";
    private final long MARSH_AND_MCLEANNAN_ELIGIBLE_EMPLOYEES = 79L;
    private final String MARSH_AND_MCLEANNAN_EFFECTIVE_DATE = "01/01/18";
    
    @Before
    public void setup() throws Exception{
        baseOptimizerLoader.setDebug(true);

        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName")) );
        List<User> users = new ArrayList<>();
        users.add(user);
        UsersPage usersPage = new UsersPage(users);
        when(mgmtAPI.users().list(any(UserFilter.class)).execute()).thenReturn(usersPage);
    }

    @Test
    @Ignore
    public void runAnthemOptimizerValidator() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer - Missing SIC.xlsm");

        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        OptimizerDto dto2 = baseOptimizerLoader.validate(fis, dto);
        Assert.assertNotNull(dto2);
    }

    @Test
    @Ignore
    public void runAnthemOptimizerLoader() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        baseOptimizerLoader.run(fis, dto);
    }
    
    @Test
    public void runAnthemOptimizerLoader_example_1() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_1.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        baseOptimizerLoader.run(fis, dto);
    }
   
    @Test
    public void runAnthemOptimizerLoader_example_4tier() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_4tier.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        baseOptimizerLoader.run(fis, dto);
    }

    
    @Test
    public void runAnthemOptimizerLoader_example_3tier() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_3tier.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        baseOptimizerLoader.run(fis, dto);
    }

    @Test
    public void runAnthemOptimizerLoader_example_2tier() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_2tier.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");

        baseOptimizerLoader.run(fis, dto);


    }

    @Test
    public void runAnthemOptimizerLoader_example_T18b_test1() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_test1.xlsm");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");
        
        OptimizerDto uploadResult = baseOptimizerLoader.run(fis, dto);
        String clientName = uploadResult.getClient().getClientName();
        
        Broker broker = brokerRepository.findByNameIgnoreCase("Test Broker T18b");
        
        Assert.assertEquals(dto.getBrokerage().getSpecialtyBrokerEmail(), broker.getSpecialtyEmail());
        Assert.assertNotNull(broker);
        List<Client> clients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                clientName, broker.getBrokerId(), false);
        Assert.assertEquals(clients.size(), 1);
        Client client = clients.get(0);
        Assert.assertEquals(client.getSicCode(), "1542");
        
        Broker agent = brokerRepository.findByNameIgnoreCase("LISI");
        Assert.assertNotNull(agent);
        Assert.assertTrue(agent.isGeneralAgent());
        
        ExtBrokerageAccess brokerAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(agent.getBrokerId(), broker.getBrokerId());
        Assert.assertNotNull(brokerAccess);
        
        ExtClientAccess clientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(client.getClientId(), agent.getBrokerId());
        Assert.assertNotNull(clientAccess);
        
        //List<ClientTeam> clientTeam = clientTeamRepository.findByClientClientId(client.getClientId());
        //Assert.assertEquals(clientTeam.size(), 1);
        //Assert.assertEquals(clientTeam.get(0).getName(), "FirstName LastName");
        
    }

    @Test
    public void runAnthemOptimizerLoader_example_T18b_differentGA() throws IOException{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_differentGA.xlsm");

        OptimizerDto dto = new OptimizerDto();
        dto.setBrokerage(new BrokerDto());
        dto.getBrokerage().setSpecialtyBrokerEmail(Constants.BENREVO_DEVSPECIALTY_EMAIL);
        dto.getBrokerage().setBcc("info+dev.bcc@benrevo.com");
        
        FileInputStream fis = new FileInputStream(myFile);

        OptimizerDto uploadResult = baseOptimizerLoader.run(fis, dto);
        String clientName = uploadResult.getClient().getClientName();
        
        Broker broker = brokerRepository.findByNameIgnoreCase("Test Broker");
        Assert.assertNotNull(broker);
        List<Client> clients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                clientName, broker.getBrokerId(), false);
        Assert.assertEquals(clients.size(), 1);
        Client client = clients.get(0);
        
        Broker agent = brokerRepository.findByNameIgnoreCase("Test Agent");
        Assert.assertNotNull(agent);
        Assert.assertTrue(agent.isGeneralAgent());
        
        ExtBrokerageAccess brokerAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(agent.getBrokerId(), broker.getBrokerId());
        Assert.assertNotNull(brokerAccess);
        
        ExtClientAccess clientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(client.getClientId(), agent.getBrokerId());
        Assert.assertNotNull(clientAccess);
        
    }

    
    /**
     * Unit Tests for Individual Sheets to validate parser
     */

    // ARS National Services - Optimizer.xlsm
    @Test
    public void runAnthemOptimizerLoader_example_ARS_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), MARSH_AND_MCLEANNAN_BROKERAGE_NAME);
        Assert.assertEquals(data.getClientName(), "ARS NATIONAL SERVICES INC.");
        Assert.assertEquals(data.getSicCode(), "7322");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 327L);
        Assert.assertEquals(data.getParticipatingEmployees().longValue(), 242L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), MARSH_AND_MCLEANNAN_EFFECTIVE_DATE);
        Assert.assertEquals(data.getMedicalPlans().size(), 3);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalEeContribution(), 1F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 2F, DELTA);
        
        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getMedicalPlans().get(1);
        AnthemOptimizerPlanDetails plan3 = data.getMedicalPlans().get(2);

        Assert.assertEquals(plan1.getPlanType(), "THMO");
        Assert.assertEquals(plan1.getPlanName(), "HMO");
        Assert.assertEquals(plan1.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 156L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 10L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 17L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 9L);

        Assert.assertEquals(plan1.getTier1Rate(), 472.60F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 1134.23F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 827.04F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 1441.42F, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 77F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 41F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 41F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), 41F, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "PPO");
        Assert.assertEquals(plan2.getPlanName(), "PPO");
        Assert.assertEquals(plan2.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 1L);

        Assert.assertEquals(plan2.getTier1Rate(), 547.43F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 1313.84F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 958.00F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 1672.81F, DELTA);

        Assert.assertEquals(plan2.getTier1ErContribution(), 32F, DELTA);
        Assert.assertEquals(plan2.getTier2ErContribution(), 21F, DELTA);
        Assert.assertEquals(plan2.getTier3ErContribution(), 21F, DELTA);
        Assert.assertEquals(plan2.getTier4ErContribution(), 21F, DELTA);

        Assert.assertEquals(plan3.getPlanType(), "PPO");
        Assert.assertEquals(plan3.getPlanName(), "EPO");
        Assert.assertEquals(plan3.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan3.getTier1Census().longValue(), 36L);
        Assert.assertEquals(plan3.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan3.getTier3Census().longValue(), 3L);
        Assert.assertEquals(plan3.getTier4Census().longValue(), 2L);

        Assert.assertEquals(plan3.getTier1Rate(), 601.01F, DELTA);
        Assert.assertEquals(plan3.getTier2Rate(), 1442.41F, DELTA);
        Assert.assertEquals(plan3.getTier3Rate(), 1051.76F, DELTA);
        Assert.assertEquals(plan3.getTier4Rate(), 1833.07F, DELTA);

        Assert.assertEquals(plan3.getTier1ErContribution(), 82F, DELTA);
        Assert.assertEquals(plan3.getTier2ErContribution(), 53F, DELTA);
        Assert.assertEquals(plan3.getTier3ErContribution(), 53F, DELTA);
        Assert.assertEquals(plan3.getTier4ErContribution(), 53F, DELTA);

        Assert.assertEquals(data.getMedicalCommission(), "4.0%");

        Assert.assertTrue(data.isHasDental());
        Assert.assertEquals(data.getDentalCommission(), "6.0%");

        Assert.assertFalse(data.isHasVision());
    }

    @Test
    public void runAnthemOptimizerLoader_example_ARS_DentalSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasDental(true);

        new AnthemOptimizerDentalSheetParser(data).processDentalSheet(getSheetRowIterator(fis, "DENTAL INTAKE"));

        Assert.assertEquals(data.getDentalPlans().size(), 1);
        
        AnthemOptimizerPlanDetails plan1 = data.getDentalPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "DPPO");
        Assert.assertEquals(plan1.getPlanName(), "DPPO INCUMBENT INFO OPTION 1");
        Assert.assertEquals(plan1.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 1L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 3L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 4L);

        Assert.assertEquals(plan1.getTier1Rate(), 45.68f, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 80.75, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 80.75, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 130.10, 0.0001f);
        
    }

    // Optimizer_example_1.xlsm
    
    @Test
    public void runAnthemOptimizerLoader_example_1_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_1.xlsm");

        FileInputStream fis = new FileInputStream(myFile);

        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), "LOCKTON");
        Assert.assertEquals(data.getClientName(), "Affinity Development Group, Inc.");
        Assert.assertEquals(data.getSicCode(), "8699");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 213L);
        Assert.assertEquals(data.getParticipatingEmployees().longValue(), 186L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), MARSH_AND_MCLEANNAN_EFFECTIVE_DATE);
        Assert.assertEquals(data.getMedicalPlans().size(), 4);
        Assert.assertEquals(data.getMedicalTierRates(), 4);

        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getMedicalPlans().get(1);
        AnthemOptimizerPlanDetails plan3 = data.getMedicalPlans().get(2);
        AnthemOptimizerPlanDetails plan4 = data.getMedicalPlans().get(3);

        Assert.assertEquals(plan1.getPlanType(), "SHMO");
        Assert.assertEquals(plan1.getPlanName(), "HMO (SMART CARE)");
        Assert.assertEquals(plan1.getCarrierName(), "HEALTHNET");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 79L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 11L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 14L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 12L);

        Assert.assertEquals(plan1.getTier1Rate(), 485.61F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 1165.43F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 849.78F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 1481.06F, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 99F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "THMO");
        Assert.assertEquals(plan2.getPlanName(), "HMO - FULL");
        Assert.assertEquals(plan2.getCarrierName(), "HEALTHNET");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 23L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 7L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 11L);

        Assert.assertEquals(plan2.getTier1Rate(), 686.00F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 1646.38F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 1200.50F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 2073.76F, DELTA);

        // BUY UP
        Assert.assertEquals(plan2.getTier1ErContribution(), 70.08074F, DELTA);
        Assert.assertEquals(plan2.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan3.getPlanType(), "PPO");
        Assert.assertEquals(plan3.getPlanName(), "PPO");
        Assert.assertEquals(plan3.getCarrierName(), "HEALTHNET");
        Assert.assertEquals(plan3.getTier1Census().longValue(), 1L);
        Assert.assertEquals(plan3.getTier2Census().longValue(), 3L);
        Assert.assertEquals(plan3.getTier3Census().longValue(), 2L);
        Assert.assertEquals(plan3.getTier4Census().longValue(), 3L);

        Assert.assertEquals(plan3.getTier1Rate(), 1047.30F, DELTA);
        Assert.assertEquals(plan3.getTier2Rate(), 2513.54F, DELTA);
        Assert.assertEquals(plan3.getTier3Rate(), 1832.80F, DELTA);
        Assert.assertEquals(plan3.getTier4Rate(), 3194.29F, DELTA);

        // BUY UP
        Assert.assertEquals(plan3.getTier1ErContribution(), 45.90412F, DELTA);
        Assert.assertEquals(plan3.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan3.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan3.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan4.getPlanType(), "PPO");
        Assert.assertEquals(plan4.getPlanName(), "PPO -OOS");
        Assert.assertEquals(plan4.getCarrierName(), "HEALTHNET");
        Assert.assertEquals(plan4.getTier1Census().longValue(), 5L);
        Assert.assertEquals(plan4.getTier2Census().longValue(), 4L);
        Assert.assertEquals(plan4.getTier3Census().longValue(), 2L);
        Assert.assertEquals(plan4.getTier4Census().longValue(), 7L);

        Assert.assertEquals(plan4.getTier1Rate(), 852.18F, DELTA);
        Assert.assertEquals(plan4.getTier2Rate(), 2045.20F, DELTA);
        Assert.assertEquals(plan4.getTier3Rate(), 1491.29F, DELTA);
        Assert.assertEquals(plan4.getTier4Rate(), 2599.10F, DELTA);

        // BUY UP
        Assert.assertEquals(plan4.getTier1ErContribution(), 56.414593F, DELTA);
        Assert.assertEquals(plan4.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan4.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan4.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(data.getMedicalCommission(), "4.0%");

        Assert.assertFalse(data.isHasDental());
        Assert.assertFalse(data.isHasVision());
    }

    // Optimizer_example_4tier.xlsm
    @Test
    public void runAnthemOptimizerLoader_example_4tier_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_4tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), "Alliant");
        Assert.assertEquals(data.getClientName(), "BIOLEGEND, INC.");
        Assert.assertEquals(data.getSicCode(), "2836");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 286L);
        Assert.assertEquals(data.getParticipatingEmployees().longValue(), 286L);
        
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), MARSH_AND_MCLEANNAN_EFFECTIVE_DATE);
        Assert.assertEquals(data.getMedicalPlans().size(), 3);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalEeContribution(), 5F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 6F, DELTA);
        Assert.assertEquals(data.getVisionEeContribution(), 7F, DELTA);
        Assert.assertEquals(data.getVisionDepContribution(), 8F, DELTA);

        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getMedicalPlans().get(1);
        AnthemOptimizerPlanDetails plan3 = data.getMedicalPlans().get(2);

        Assert.assertEquals(plan1.getPlanType(), "CDHP");
        Assert.assertEquals(plan1.getPlanName(), "CDHP/HSA - CA AND OOS");
        Assert.assertEquals(plan1.getCarrierName(), "UHC");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 70L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 6L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 2L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 11L);

        Assert.assertEquals(plan1.getTier1Rate(), 419.70F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 919.16F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 797.45F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 1275.90F, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 75F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "THMO");
        Assert.assertEquals(plan2.getPlanName(), "hmo- ca");
        Assert.assertEquals(plan2.getCarrierName(), "UHC");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 59L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 6L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 6L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 6L);

        Assert.assertEquals(plan2.getTier1Rate(), 458.53F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 1004.16F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 871.17F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 1393.91F, DELTA);

        // BUY UP 
        // plan1.getTier1Rate() / plan2.getTier1Rate() * plan1.getTier1ErContribution()
        // 419.70F / 458.53F * 75
        Assert.assertEquals(plan2.getTier1ErContribution(), 68.64873F, DELTA);
        Assert.assertEquals(plan2.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan3.getPlanType(), "PPO");
        Assert.assertEquals(plan3.getPlanName(), "PPO - CA & OOS");
        Assert.assertEquals(plan3.getCarrierName(), "UHC");
        Assert.assertEquals(plan3.getTier1Census().longValue(), 50L);
        Assert.assertEquals(plan3.getTier2Census().longValue(), 5L);
        Assert.assertEquals(plan3.getTier3Census().longValue(), 10L);
        Assert.assertEquals(plan3.getTier4Census().longValue(), 4L);

        Assert.assertEquals(plan3.getTier1Rate(), 488.12F, DELTA);
        Assert.assertEquals(plan3.getTier2Rate(), 1068.98F, DELTA);
        Assert.assertEquals(plan3.getTier3Rate(), 927.43F, DELTA);
        Assert.assertEquals(plan3.getTier4Rate(), 1483.87F, DELTA);

        // BUY UP
        // plan1.getTier1Rate() / plan3.getTier1Rate() * plan1.getTier1ErContribution()
        // 419.70F / 488.12F * 75
        Assert.assertEquals(plan3.getTier1ErContribution(), 64.48721F, DELTA);
        Assert.assertEquals(plan3.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan3.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan3.getTier4ErContribution(), 0F, DELTA);
        
        Assert.assertEquals(data.getMedicalCommission(), "5.0%");

        Assert.assertTrue(data.isHasDental());
        Assert.assertEquals(data.getDentalCommission(), "10%");

        Assert.assertTrue(data.isHasVision());
        Assert.assertEquals(data.getVisionCommission(), "10%");
    }

    @Test
    public void runAnthemOptimizerLoader_example_4tier_DentalSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_4tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasDental(true);
        new AnthemOptimizerDentalSheetParser(data).processDentalSheet(getSheetRowIterator(fis, "DENTAL INTAKE"));

        Assert.assertEquals(data.getDentalPlans().size(), 2);
        
        AnthemOptimizerPlanDetails plan1 = data.getDentalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getDentalPlans().get(1);

        Assert.assertEquals(plan1.getPlanType(), "DPPO");
        Assert.assertEquals(plan1.getPlanName(), "DPPO PLAN 1");
        Assert.assertEquals(plan1.getCarrierName(), "UHC");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 213L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 27L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 15L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 38L);

        Assert.assertEquals(plan1.getTier1Rate(), 42.25F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 81.41F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 79.02F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 130.54F, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "DPPO");
        Assert.assertEquals(plan2.getPlanName(), "DPPO PLAN 2");
        Assert.assertEquals(plan2.getCarrierName(), "UHC");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 213L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 27L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 15L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 38L);

        Assert.assertEquals(plan2.getTier1Rate(), 33.30F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 64.16F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 62.28F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 102.87F, DELTA);
        
    }

    @Test
    public void runAnthemOptimizerLoader_example_4tier_VisionSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_4tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();

        new AnthemOptimizerVisionSheetParser(data).processVisionSheet(getSheetRowIterator(fis, "ANCILLARY EXHIBIT"));

        Assert.assertEquals(data.getVisionPlans().size(), 1);
        
        AnthemOptimizerPlanDetails plan1 = data.getVisionPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "VISION");
        Assert.assertEquals(plan1.getPlanName(), "VISION");

        Assert.assertEquals(plan1.getTier1Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 0F, DELTA);

    }

    
    @Test
    public void runAnthemOptimizerLoader_example_3tier_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_3tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), MARSH_AND_MCLEANNAN_BROKERAGE_NAME);
        Assert.assertEquals(data.getClientName(), "ARS NATIONAL SERVICES INC.");
        Assert.assertEquals(data.getSicCode(), "7322");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 315L);
        Assert.assertEquals(data.getParticipatingEmployees().longValue(), 230L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), MARSH_AND_MCLEANNAN_EFFECTIVE_DATE);
        Assert.assertEquals(data.getMedicalPlans().size(), 3);
        Assert.assertEquals(data.getMedicalTierRates(), 3);
        Assert.assertEquals(data.getDentalEeContribution(), 1F);
        Assert.assertEquals(data.getDentalDepContribution(), 2F);
        Assert.assertEquals(data.getVisionEeContribution(), 3F);
        Assert.assertEquals(data.getVisionDepContribution(), 4F);

        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getMedicalPlans().get(1);
        AnthemOptimizerPlanDetails plan3 = data.getMedicalPlans().get(2);

        Assert.assertEquals(plan1.getPlanType(), "THMO");
        Assert.assertEquals(plan1.getPlanName(), "HMO");
        Assert.assertEquals(plan1.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 156L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 10L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 17L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 472.60F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 1134.23F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 827.04F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), DELTA, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 77F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 41F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 41F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), DELTA, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "KAISER");
        Assert.assertEquals(plan2.getPlanName(), "PPO");
        Assert.assertEquals(plan2.getCarrierName(), "KAISER");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 2L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan2.getTier1Rate(), 547.43F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 1313.84F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 958.00F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), DELTA, DELTA);

        Assert.assertEquals(plan2.getTier1ErContribution(), 32F, DELTA);
        Assert.assertEquals(plan2.getTier2ErContribution(), 21F, DELTA);
        Assert.assertEquals(plan2.getTier3ErContribution(), 21F, DELTA);
        Assert.assertEquals(plan2.getTier4ErContribution(), DELTA, DELTA);

        Assert.assertEquals(plan3.getPlanType(), "PPO");
        Assert.assertEquals(plan3.getPlanName(), "EPO");
        Assert.assertEquals(plan3.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan3.getTier1Census().longValue(), 36L);
        Assert.assertEquals(plan3.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan3.getTier3Census().longValue(), 3L);
        Assert.assertEquals(plan3.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan3.getTier1Rate(), 601.01F, DELTA);
        Assert.assertEquals(plan3.getTier2Rate(), 1442.41F, DELTA);
        Assert.assertEquals(plan3.getTier3Rate(), 1051.76F, DELTA);
        Assert.assertEquals(plan3.getTier4Rate(), 0F, DELTA);

        Assert.assertEquals(plan3.getTier1ErContribution(), 82F, DELTA);
        Assert.assertEquals(plan3.getTier2ErContribution(), 53F, DELTA);
        Assert.assertEquals(plan3.getTier3ErContribution(), 53F, DELTA);
        Assert.assertEquals(plan3.getTier4ErContribution(), 0F, DELTA);

        
        Assert.assertEquals(data.getMedicalCommission(), "4.0%");

        Assert.assertTrue(data.isHasDental());
        Assert.assertEquals(data.getDentalCommission(), "6.0%");

        Assert.assertTrue(data.isHasVision());
        Assert.assertEquals(data.getVisionCommission(), "5.0%");
    }

    @Test
    public void runAnthemOptimizerLoader_example_3tier_DentalSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_3tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasDental(true);
        new AnthemOptimizerDentalSheetParser(data).processDentalSheet(getSheetRowIterator(fis, "DENTAL INTAKE"));

        Assert.assertEquals(data.getDentalPlans().size(), 1);
        
        AnthemOptimizerPlanDetails plan1 = data.getDentalPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "DPPO");
        Assert.assertEquals(plan1.getPlanName(), "DPPO INCUMBENT INFO OPTION 1");
        Assert.assertEquals(plan1.getCarrierName(), "CIGNA");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 1L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 3L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 45.68F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 80.75F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 80.75F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 0F, DELTA);

    }

    @Test
    public void runAnthemOptimizerLoader_example_3tier_VisionSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_3tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasVision(true);
        new AnthemOptimizerVisionSheetParser(data).processVisionSheet(getSheetRowIterator(fis, "ANCILLARY EXHIBIT"));

        Assert.assertEquals(data.getVisionPlans().size(), 1);
        
        AnthemOptimizerPlanDetails plan1 = data.getVisionPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "VISION");
        Assert.assertEquals(plan1.getPlanName(), "VISION");

        Assert.assertEquals(plan1.getTier1Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getCarrierName(), "UHC");

    }

    @Test
    public void runAnthemOptimizerLoader_example_2tier_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_2tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), MARSH_AND_MCLEANNAN_BROKERAGE_NAME);
        Assert.assertEquals(data.getClientName(), AMINI_CLIENT_NAME);
        Assert.assertEquals(data.getSicCode(), MARSH_AND_MCLEANNAN_SIC_CODE);
        Assert.assertEquals(data.getEligibleEmployees().longValue(), MARSH_AND_MCLEANNAN_ELIGIBLE_EMPLOYEES);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), MARSH_AND_MCLEANNAN_EFFECTIVE_DATE);
        Assert.assertEquals(data.getMedicalPlans().size(), 2);
        Assert.assertEquals(data.getMedicalTierRates(), 2);
        Assert.assertEquals(data.getDentalEeContribution(), 2F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 3F, DELTA);
        Assert.assertEquals(data.getVisionEeContribution(), 4F, DELTA);
        Assert.assertEquals(data.getVisionDepContribution(), 5F, DELTA);

        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getMedicalPlans().get(1);

        Assert.assertEquals(plan1.getPlanType(), "THMO");
        Assert.assertEquals(plan1.getPlanName(), "Full HMO");
        Assert.assertEquals(plan1.getCarrierName(), "UHC");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 44L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 6L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 440.24F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 968.50F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 0F, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 75F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 50F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "PPO");
        Assert.assertEquals(plan2.getPlanName(), "PPO");
        Assert.assertEquals(plan2.getCarrierName(), "UHC");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 3L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 3L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan2.getTier1Rate(), 613.98F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 1350.70F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 0F, DELTA);

        Assert.assertEquals(plan2.getTier1ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier2ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier3ErContribution(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier4ErContribution(), 0F, DELTA);

        Assert.assertEquals(data.getMedicalCommission(), "5.0%");

        Assert.assertTrue(data.isHasDental());
        Assert.assertEquals(data.getDentalCommission(), "10.0%");

        Assert.assertTrue(data.isHasVision());
        Assert.assertEquals(data.getVisionCommission(), "3.0%");
    }

    @Test
    public void runAnthemOptimizerLoader_example_2tier_DentalSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_2tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasDental(true);
        new AnthemOptimizerDentalSheetParser(data).processDentalSheet(getSheetRowIterator(fis, "DENTAL INTAKE"));

        Assert.assertEquals(data.getDentalPlans().size(), 2);
        
        AnthemOptimizerPlanDetails plan1 = data.getDentalPlans().get(0);
        AnthemOptimizerPlanDetails plan2 = data.getDentalPlans().get(1);

        Assert.assertEquals(plan1.getPlanType(), "DPPO");
        Assert.assertEquals(plan1.getPlanName(), "DPPO PLAN 1");
        Assert.assertEquals(plan1.getCarrierName(), "Metlife");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 1L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 2L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 3.00F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 4.00F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), DELTA, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), DELTA, DELTA);

        Assert.assertEquals(plan2.getPlanType(), "DHMO");
        Assert.assertEquals(plan2.getPlanName(), "DHMO PLAN");
        Assert.assertEquals(plan2.getCarrierName(), "Metlife");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 5L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 6L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan2.getTier1Rate(), 7.00F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 8.00F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 0F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 0F, DELTA);
        
    }

    @Test
    public void runAnthemOptimizerLoader_example_2tier_VisionSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_example_2tier.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();

        new AnthemOptimizerVisionSheetParser(data).processVisionSheet(getSheetRowIterator(fis, "ANCILLARY EXHIBIT"));

        Assert.assertEquals(data.getVisionPlans().size(), 1);
        
        AnthemOptimizerPlanDetails plan1 = data.getVisionPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "VISION");
        Assert.assertEquals(plan1.getPlanName(), "VISION");

        Assert.assertEquals(plan1.getTier1Census().longValue(), 10L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 11L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 0L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 0L);

        Assert.assertEquals(plan1.getTier1Rate(), 6.00F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 7.00F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 0.00F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 0.00F, DELTA);

    }

    @Test
    public void runAnthemOptimizerLoader_example_T18b_test1_IntakeSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_test1.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setParseMedical(true);
        data.setParseDental(true);
        data.setParseVision(true);

        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(getSheetRowIterator(fis, "INTAKE"));

        Assert.assertEquals(data.getBrokerName(), "Test Broker T18b");
        Assert.assertEquals(data.getSalesPerson(), "DEVSALE_FIRST_NAME DEVSALE_LAST_NAME");
        Assert.assertEquals(data.getPreSalesPerson(), "DEVPRESALE_FIRST_NAME DEVPRESALE_LAST_NAME");
        Assert.assertEquals(data.getClientName(), "Test Client T18b");
        Assert.assertEquals(data.getSicCode(), "1542");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 26L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), "10/14/18");
        Assert.assertEquals(data.getMedicalPlans().size(), 1);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalEeContribution(), 1F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 2F, DELTA);
        Assert.assertEquals(data.getVisionEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getVisionDepContribution(), 5F, DELTA);

        AnthemOptimizerPlanDetails plan1 = data.getMedicalPlans().get(0);

        Assert.assertEquals(plan1.getPlanType(), "THMO");
        Assert.assertEquals(plan1.getPlanName(), "HMO Plan");
        Assert.assertEquals(plan1.getCarrierName(), "UHC");
        Assert.assertEquals(plan1.getTier1Census().longValue(), 5L);
        Assert.assertEquals(plan1.getTier2Census().longValue(), 6L);
        Assert.assertEquals(plan1.getTier3Census().longValue(), 7L);
        Assert.assertEquals(plan1.getTier4Census().longValue(), 8L);

        Assert.assertEquals(plan1.getTier1Rate(), 1.00F, DELTA);
        Assert.assertEquals(plan1.getTier2Rate(), 2.00F, DELTA);
        Assert.assertEquals(plan1.getTier3Rate(), 3.00F, DELTA);
        Assert.assertEquals(plan1.getTier4Rate(), 4.00F, DELTA);

        Assert.assertEquals(plan1.getTier1ErContribution(), 4F, DELTA);
        Assert.assertEquals(plan1.getTier2ErContribution(), 6F, DELTA);
        Assert.assertEquals(plan1.getTier3ErContribution(), 6F, DELTA);
        Assert.assertEquals(plan1.getTier4ErContribution(), 6F, DELTA);

        Assert.assertEquals(data.getMedicalCommission(), "4.0%");
        
        Assert.assertTrue(data.isHasDental());
        Assert.assertEquals(data.getDentalCommission(), "3.0%");

        Assert.assertTrue(data.isHasVision());
        Assert.assertEquals(data.getVisionCommission(), "5.0%");
        
        Assert.assertEquals(data.getAgentName(), "LISI");
        
    }

    @Test
    public void runAnthemOptimizerLoader_example_T18b_test1_DentalSheet() throws Exception{

        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_test1.xlsm");

        FileInputStream fis = new FileInputStream(myFile);
        AnthemOptimizerParserData data = new AnthemOptimizerParserData();
        data.setHasDental(true);
        new AnthemOptimizerDentalSheetParser(data).processDentalSheet(getSheetRowIterator(fis, "DENTAL INTAKE"));

        Assert.assertEquals(data.getDentalPlans().size(), 3);

        AnthemOptimizerPlanDetails plan2 = data.getDentalPlans().get(0);
        AnthemOptimizerPlanDetails plan3 = data.getDentalPlans().get(1);
        AnthemOptimizerPlanDetails plan4 = data.getDentalPlans().get(2);

        Assert.assertEquals(plan2.getPlanType(), "DPPO");
        Assert.assertEquals(plan2.getPlanName(), "DPPO PLAN 1");
        Assert.assertEquals(plan2.getCarrierName(), "UHC");
        Assert.assertEquals(plan2.getTier1Census().longValue(), 19L);
        Assert.assertEquals(plan2.getTier2Census().longValue(), 20L);
        Assert.assertEquals(plan2.getTier3Census().longValue(), 21L);
        Assert.assertEquals(plan2.getTier4Census().longValue(), 22L);

        Assert.assertEquals(plan2.getTier1Rate(), 15.00F, DELTA);
        Assert.assertEquals(plan2.getTier2Rate(), 16.00F, DELTA);
        Assert.assertEquals(plan2.getTier3Rate(), 17.00F, DELTA);
        Assert.assertEquals(plan2.getTier4Rate(), 18.00F, DELTA);

        Assert.assertEquals(plan3.getPlanType(), "DPPO");
        Assert.assertEquals(plan3.getPlanName(), "DPPO PLAN 2");
        Assert.assertEquals(plan3.getCarrierName(), "UHC");
        Assert.assertEquals(plan3.getTier1Census().longValue(), 27L);
        Assert.assertEquals(plan3.getTier2Census().longValue(), 28L);
        Assert.assertEquals(plan3.getTier3Census().longValue(), 29L);
        Assert.assertEquals(plan3.getTier4Census().longValue(), 30L);

        Assert.assertEquals(plan3.getTier1Rate(), 23.00F, DELTA);
        Assert.assertEquals(plan3.getTier2Rate(), 24.00F, DELTA);
        Assert.assertEquals(plan3.getTier3Rate(), 25.00F, DELTA);
        Assert.assertEquals(plan3.getTier4Rate(), 26.00F, DELTA);

        Assert.assertEquals(plan4.getPlanType(), "DHMO");
        Assert.assertEquals(plan4.getPlanName(), "DHMO PLAN");
        Assert.assertEquals(plan4.getCarrierName(), "UHC");
        Assert.assertEquals(plan4.getTier1Census().longValue(), 35L);
        Assert.assertEquals(plan4.getTier2Census().longValue(), 36L);
        Assert.assertEquals(plan4.getTier3Census().longValue(), 37L);
        Assert.assertEquals(plan4.getTier4Census().longValue(), 38L);

        Assert.assertEquals(plan4.getTier1Rate(), 31.00F, DELTA);
        Assert.assertEquals(plan4.getTier2Rate(), 32.00F, DELTA);
        Assert.assertEquals(plan4.getTier3Rate(), 33.00F, DELTA);
        Assert.assertEquals(plan4.getTier4Rate(), 34.00F, DELTA);

    }

    
    private Iterator<Row> getSheetRowIterator(InputStream inputStream, String tabNameLookingFor){

        String tabName = null;
        Iterator<Row> rowIterator = null;
        try(
            Workbook myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(inputStream) ) {

            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {
                Sheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                tabName = mySheet.getSheetName().trim().toUpperCase();
                rowIterator = mySheet.iterator();
                if(tabName.equalsIgnoreCase(tabNameLookingFor)) {
                    break;
                }

            }
        } catch (Exception e) {
            throw new BaseException("TabName=" + tabName +". " + e.getMessage(), e);
        }
        if(rowIterator == null){
            throw new BaseException("TabName=" + tabName +". not found in workbook");
        }
        return rowIterator;
    }
}

package com.benrevo.admin.api.controller;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.be.modules.shared.service.PersonService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.OptimizerDto.OptimizerProduct;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.RfpRepository;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.List;

import java.util.stream.Collectors;
import org.junit.After;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class OptimizerUploaderControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private PersonService personService;

    @Autowired
    BaseOptimizerLoader baseOptimizerLoader;

    @After
    public void tearDown(){
        ReflectionTestUtils.setField(baseOptimizerLoader, "appEnv", "local");
    }
    
    @Test
    public void uploadOptimizer() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("OptimizerLoaderBroker");

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("testBcc");
        override.setBrokerage(brokerDto);
        override.setNewClientName("newClientName");
        override.setOverrideClient(false);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), 
            Constants.EXTENSION_XLS, fis);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);
        
        assertThat(uploaded.getBrokerage().getId()).isEqualTo(broker.getBrokerId());
        assertThat(uploaded.getBrokerage().getName()).isEqualTo(broker.getName());
        
        assertThat(uploaded.getClient().getClientName()).isEqualTo(override.getNewClientName());
    }

    @Test
    @Ignore // TODO: this test is broken...
    public void validateOptimizer() throws Exception {

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/UHC Bad Carrier Opt Uploader.xlsm");
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
                Constants.EXTENSION_XLS, fis);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/validator/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isNotFound())
                .andReturn();

        assertThat(result.getResponse().getContentAsString().contains("No carrier found carrierName=Anthem1")).isTrue();
    }

    public void uploadOptimizerByProduct() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("OptimizerLoaderBroker");
        Client client = testEntityHelper.createTestClient("Test Client T18b", broker);
        
        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("testBcc");
        ClientDto clientDto = new ClientDto();
        clientDto.setId(client.getClientId());
        override.setBrokerage(brokerDto);
        override.setClient(clientDto);
        override.setOverrideClient(false);
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_test1.xlsm");
        FileInputStream fis = new FileInputStream(file);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), 
            Constants.EXTENSION_XLS, fis);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);
        
        assertThat(uploaded.getBrokerage().getId()).isEqualTo(broker.getBrokerId());
        assertThat(uploaded.getBrokerage().getName()).isEqualTo(broker.getName());
        
        assertThat(uploaded.getClient().getClientName()).isEqualTo(client.getClientName());
        assertThat(uploaded.getClient().getId()).isEqualTo(client.getClientId());
        
        List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());
        
        assertThat(rfps).hasSize(1);
        assertThat(rfps.get(0).getProduct()).isEqualTo(MEDICAL);
        override.getProducts().add(new OptimizerProduct(DENTAL, false));
        override.getProducts().add(new OptimizerProduct(VISION, false));
        
        result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();

        uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);
        
        assertThat(uploaded.getBrokerage().getId()).isEqualTo(broker.getBrokerId());
        assertThat(uploaded.getBrokerage().getName()).isEqualTo(broker.getName());
        
        assertThat(uploaded.getClient().getClientName()).isEqualTo(client.getClientName());
        assertThat(uploaded.getClient().getId()).isEqualTo(client.getClientId());

        rfps = rfpRepository.findByClientClientId(client.getClientId());
        assertThat(rfps).hasSize(3);
        assertThat(rfps).extracting("product").containsExactlyInAnyOrder(MEDICAL, DENTAL, VISION);

        
    }

    @Test
    public void uploadOptimizerByProductWhenRfpExists() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("Test Broker T18b");
        Client client = testEntityHelper.createTestClient("Test Client T18b", broker);
        testEntityHelper.createTestRFP(client, MEDICAL);
        testEntityHelper.createTestRFP(client, DENTAL);
        
        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        ClientDto clientDto = new ClientDto();
        override.setBrokerage(brokerDto);
        override.setClient(clientDto);
        override.setOverrideClient(false);
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/Optimizer_2018_T18b_test1.xlsm");
        FileInputStream fis = new FileInputStream(file);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), 
            Constants.EXTENSION_XLS, fis);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/validator/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .param("products", MEDICAL)
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        OptimizerDto validated = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);
        
        assertThat(validated.getGaBrokerage().getId()).isNull();
        assertThat(validated.getBrokerage().getId()).isEqualTo(broker.getBrokerId());
        assertThat(validated.getClient().getId()).isEqualTo(client.getClientId());
        assertThat(validated.getProducts()).hasSize(2);
        assertThat(
            validated.getProducts().stream().map(p -> p.getCategory()).collect(Collectors.toList())
        ).containsExactlyInAnyOrder("MEDICAL", "DENTAL");

        clientDto.setId(client.getClientId());
        override.getBrokerage().setBcc("testBcc");

        result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().is5xxServerError())
            .andReturn();

    }
    
    @Test
    public void uploadOptimizerByProductWhenProductNotInOptimizer() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("OptimizerLoaderBroker");
        Client client = testEntityHelper.createTestClient("Test Client", broker);
        testEntityHelper.createTestRFP(client, MEDICAL);
        
        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        ClientDto clientDto = new ClientDto();
        clientDto.setId(client.getClientId());
        override.setBrokerage(brokerDto);
        override.setClient(clientDto);
        override.setOverrideClient(false);
        override.getProducts().add(new OptimizerProduct(VISION, false));
        override.getBrokerage().setBcc("testBcc");

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), 
            Constants.EXTENSION_XLS, fis);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().is5xxServerError())
            .andReturn();

    }

    @Test
    public void testBccEnvIsDev() throws Exception {

        ReflectionTestUtils.setField(baseOptimizerLoader, "appEnv", "local");

        Broker broker = testEntityHelper.createTestBroker("OptimizerLoaderBroker");
        brokerRepository.save(broker);

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("testBcc");
        override.setBrokerage(brokerDto);
        override.setNewClientName("newClientName");
        override.setOverrideClient(false);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), Constants.EXTENSION_XLS, new FileInputStream(file));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        broker = brokerRepository.findOne(uploaded.getBrokerage().getId());
        assertThat(broker.getBcc()).isNull(); //bcc should not persist in dev

    }

    @Test
    public void testBccEnvIsProd() throws Exception {

        ReflectionTestUtils.setField(baseOptimizerLoader, "appEnv", "prod");
        ReflectionTestUtils.setField(personService, "appEnv", "prod");

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), Constants.EXTENSION_XLS, new FileInputStream(file));

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setBcc("testBcc");
        override.setBrokerage(brokerDto);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        Broker broker = brokerRepository.findOne(uploaded.getBrokerage().getId());
        assertThat(broker.getBcc()).isEqualTo("testBcc"); //bcc should persist in prod


        override.setNewClientName("newClientName");
        brokerDto.setBcc("bccShouldNotPersistOnExistingBroker");

        result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();

        uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        broker = brokerRepository.findOne(uploaded.getBrokerage().getId());
        assertThat(broker.getBcc()).isEqualTo("testBcc"); //bcc should persist in prod
    }

    @Test
    public void testBccEnvIsProd_NoBcc() throws Exception {

        ReflectionTestUtils.setField(baseOptimizerLoader, "appEnv", "prod");

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), Constants.EXTENSION_XLS, new FileInputStream(file));

        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(new OptimizerDto()))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isNotFound())
                .andReturn();

        Broker broker = testEntityHelper.createTestBroker("OptimizerLoaderBroker");
        broker.setBcc("testBcc");
        brokerRepository.save(broker);

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("bccShouldNotPersist");
        override.setBrokerage(brokerDto);
        override.setNewClientName("newClientName");
        override.setOverrideClient(false);
        override.getBrokerage().setBcc("bccShouldNotPersist");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(override))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        broker = brokerRepository.findOne(uploaded.getBrokerage().getId());
        assertThat(broker.getBcc()).isEqualTo("testBcc"); //bcc should persist in prod

    }

    /**
     * Uploads all products optimizer except medical renewal.
     * Client information should be created. 1 medical/dental RFP and Client Plans. No Rfp for vision
     * @throws Exception
     */
    @Test
    public void uploadMedicalAndDentalRenewalProductsOnlyOptimizer() throws Exception {
        OptimizerDto override = new OptimizerDto();
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));
        override.getProducts().add(new OptimizerProduct(DENTAL, false));
        override.getProducts().add(new OptimizerProduct(VISION, true));

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
            Constants.EXTENSION_XLS, fis);

         MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        OptimizerDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getClient()).isNotNull();
        assertThat(dto.getClient().getClientName()).isEqualTo("ARS NATIONAL SERVICES INC.");
        assertThat(dto.getClient().getEligibleEmployees()).isEqualTo(327L);
        assertThat(dto.getClient().getSicCode()).isEqualTo("7322");
        assertThat(dto.getClient().getEffectiveDate()).isEqualTo("1/1/2018");
        assertThat(dto.getBrokerage()).isNotNull();
        assertThat(dto.getBrokerage().getName()).isEqualTo("Marsh & McLennan");

        PlanCategory planCategory = PlanCategory.valueOf(MEDICAL);
        PlanCategory dentalPlanCategory = PlanCategory.valueOf(DENTAL);
        List<RFP> rfps = rfpRepository.findByClientClientId(dto.getClient().getId());
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(dto.getClient().getId());
        List<ClientPlan> clientPlansByMedicalPlanType = clientPlanRepository.
            findByClientClientIdAndPnnPlanTypeIn(dto.getClient().getId(),
                planCategory.getPlanTypes());

        List<ClientPlan> clientPlansByDentalPlanType = clientPlanRepository.
            findByClientClientIdAndPnnPlanTypeIn(dto.getClient().getId(),
                dentalPlanCategory.getPlanTypes());
        assertThat(rfps.size()).isEqualTo(2);
        assertThat(clientPlans.size()).isEqualTo(4);
        assertThat(clientPlansByMedicalPlanType.size()).isEqualTo(3);
        assertThat(clientPlansByDentalPlanType.size()).isEqualTo(1);
        assertThat(rfps.stream().map(r -> r.getProduct()).collect(Collectors.toList())).containsExactly(MEDICAL, DENTAL);

    }


    /**
     * Uploads all products optimizer except medical renewal.
     * Client information should be created. 1 medical RFP and Client Plans. No Rfp for dental or vision etc
     * @throws Exception
     */
    @Test
    public void uploadMedicalProductNotRenewalOptimizer() throws Exception {
        OptimizerDto override = new OptimizerDto();
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));
        override.getProducts().add(new OptimizerProduct(DENTAL, true));
        override.getProducts().add(new OptimizerProduct(VISION, true));

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
            Constants.EXTENSION_XLS, fis);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        OptimizerDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getClient()).isNotNull();
        assertThat(dto.getClient().getClientName()).isEqualTo("ARS NATIONAL SERVICES INC.");
        assertThat(dto.getClient().getEligibleEmployees()).isEqualTo(327L);
        assertThat(dto.getClient().getSicCode()).isEqualTo("7322");
        assertThat(dto.getClient().getEffectiveDate()).isEqualTo("1/1/2018");
        assertThat(dto.getBrokerage()).isNotNull();
        assertThat(dto.getBrokerage().getName()).isEqualTo("Marsh & McLennan");

        PlanCategory planCategory = PlanCategory.valueOf(MEDICAL);
        List<RFP> rfps = rfpRepository.findByClientClientId(dto.getClient().getId());
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(dto.getClient().getId());
        List<ClientPlan> clientPlansByMedicalPlanType = clientPlanRepository.
            findByClientClientIdAndPnnPlanTypeIn(dto.getClient().getId(),
                planCategory.getPlanTypes());
        assertThat(rfps.size()).isEqualTo(1);
        assertThat(clientPlans.size()).isEqualTo(3);
        assertThat(clientPlansByMedicalPlanType.size()).isEqualTo(3);
        assertThat(rfps.stream().map(r -> r.getProduct()).collect(Collectors.toList())).containsExactly(MEDICAL);
    }


    /**
     * Uploads all products optimizer. Only client information from section
     * 1 should be created. No RFP, Client Plans etc
     * @throws Exception
     */
    @Test
    public void uploadAllProductsRenewalOptimizer() throws Exception {
        OptimizerDto override = new OptimizerDto();
        override.getProducts().add(new OptimizerProduct(MEDICAL, true));
        override.getProducts().add(new OptimizerProduct(DENTAL, true));
        override.getProducts().add(new OptimizerProduct(VISION, true));

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/Anthem/2017/Optimizers/ARS National Services - Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
            Constants.EXTENSION_XLS, fis);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        OptimizerDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getClient()).isNotNull();
        assertThat(dto.getProducts()).isEmpty();
        assertThat(dto.getClient().getClientName()).isEqualTo("ARS NATIONAL SERVICES INC.");
        assertThat(dto.getClient().getEligibleEmployees()).isEqualTo(327L);
        assertThat(dto.getClient().getSicCode()).isEqualTo("7322");
        assertThat(dto.getClient().getEffectiveDate()).isEqualTo("1/1/2018");
        assertThat(dto.getBrokerage()).isNotNull();
        assertThat(dto.getBrokerage().getName()).isEqualTo("Marsh & McLennan");

        List<RFP> rfps = rfpRepository.findByClientClientId(dto.getClient().getId());
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(dto.getClient().getId());
        assertThat(rfps).isEmpty();
        assertThat(clientPlans).isEmpty();
    }

}

package com.benrevo.admin.api.controller;

import static com.benrevo.common.Constants.LIFE;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.be.modules.admin.domain.quotes.parsers.anthem.AnthemQuoteUploader;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.dto.QuoteUploaderDto.DPPOOption;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class AnthemQuotesUploaderControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private AnthemQuoteUploader anthemQuoteUploader;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private QuoteHelper quoteHelper;

    private final String SAMPLE_STANDARD_QUOTE_1 = "Sample_Standard_Quote_1.xls";
    private final String SAMPLE_STANDARD_QUOTE_1_NO_DHMO = "Sample_Standard_Quote_1_No_DHMO_Plans.xls";
    private final String SAMPLE_STANDARD_QUOTE_1_INVALID_NETWORK_AND_PLAN = "Sample_Standard_Quote_1_Invalid_Network_And_Plans.xls";
    private final String SAMPLE_DPPO_QUOTE_1 = "Tobinworld_0418_Complete Dental.xlsx";
    private final String SAMPLE_STANDARD_QUOTE_1_MISSING_RATES = "Sample_Standard_Quote_1_Missing_Rates.xls";
    private final String SAMPLE_DPPO_QUOTE_2 = "Sample_DPPO_Quote_2.xlsx";
    private final String SAMPLE_DPPO_3_TIER_QUOTE = "Menlo School_0718_DentalComplete - 3 Tier.xlsx";
    private final String SAMPLE_DPPO_LINKED_TO_CLIENT = "DPPO_link_to_client.xlsx";
    private final String SAMPLE_DPPO_LINKED_TO_CLIENT_CHANGED = "DPPO_link_to_client_changed_benefits_same_name.xlsx";
    private final String SAMPLE_DPPO_LINKED_TO_CLIENT_CHANGED_B = "DPPO_link_to_client_changed_benefits_same_name_B.xlsx";
    
    @Test
    public void testLoadAnthemDeclinedQuote() throws Exception {

        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.ANTHEM_CARRIER,
            Constants.ANTHEM_CARRIER
        );
        RfpCarrier rfpMedicalCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            Constants.MEDICAL
        );
        RfpSubmission rfpMedicalSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpMedicalCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpMedicalSubmission);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.STANDARD
        );
        RfpQuote rfpQuoteClearValue = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.CLEAR_VALUE
        );

        assertThat(rfpQuote.isLatest()).isTrue();

        flushAndClear();

        sendFilesAndAssertResult(
            null,
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER,
            Constants.MEDICAL,
            QuoteType.DECLINED,
            false
        );

        RfpQuote previousRfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());
        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        assertThat(previousRfpQuote.isLatest()).isTrue();
        assertThat(previousRfpQuote.getQuoteType()).isEqualTo(QuoteType.DECLINED);
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes).extracting("QuoteType")
            // declined quote filtered by findByClientIdAndCategory query
            .contains(/*QuoteType.DECLINED,*/ QuoteType.CLEAR_VALUE);
    }

    @Test
    public void testLoadAnthemStandardQuoteAfterDeclined() throws Exception {

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.ANTHEM_CARRIER,
            Constants.ANTHEM_CARRIER
        );
        RfpCarrier rfpMedicalCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            Constants.MEDICAL
        );
        RfpSubmission rfpMedicalSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpMedicalCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpMedicalSubmission);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.DECLINED
        );
        RfpQuote rfpQuoteClearValue = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.CLEAR_VALUE
        );

        assertThat(rfpQuote.isLatest()).isTrue();

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
                             "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed " +
                             "State) - Manuals_Rev6_Excel Version_4Tier.xls");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            false
        );

        RfpQuote previousRfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());
        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        assertThat(previousRfpQuote.isLatest()).isFalse();
        assertThat(currentRfpQuotes).hasSize(2);
        assertThat(currentRfpQuotes).extracting("QuoteType")
            .contains(QuoteType.STANDARD, QuoteType.CLEAR_VALUE);
        assertThat(currentRfpQuotes).extracting("Latest").contains(true, true);
    }
    
    @Test
    public void testDHMOAnd2DPPOs() throws Exception {

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.ANTHEM_CARRIER,
            Constants.ANTHEM_CARRIER
        );
        RfpCarrier rfpDentalCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            Constants.DENTAL
        );
        RfpSubmission rfpDentalSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpDentalCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpDentalSubmission);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
                             "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed " +
                             "State) - Manuals_Rev6_Excel Version_4Tier.xls");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        File file2 = new File(currDir +
                "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx");
        MockMultipartFile mockFile2 = new MockMultipartFile(
            "file2",
            file2.getName(),
            "multipart/form-data",
            new FileInputStream(file2)
        );

        File file3 = new File(currDir +
                "/data/quotes/Anthem/Dental/BenRevo Test Case2 3_8.8.17.xlsx");
        MockMultipartFile mockFile3 = new MockMultipartFile(
            "file2",
            file3.getName(),
            "multipart/form-data",
            new FileInputStream(file3)
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile, mockFile2, mockFile3),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER,
            Constants.DENTAL,
            QuoteType.STANDARD,
            false
        );

     }

    @Test
    public void test_no_quoteDto() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File standardFile = new File(
            currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}",
                client.getBroker().getBrokerId(), client.getClientId()
            )
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isBadRequest())
            .andReturn();
    }

    @Test
    public void test_validation_medicalQuoteType_and_DPPOOption() throws Exception {
        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File standardFile = new File(
            currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile, mockFile2),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);
        assertThat(dto.getNeedsMedicalQuoteType()).isTrue();
        assertThat(dto.getNeedsDPPOOption()).isTrue();
    }

    @Test
    public void test_validation_errors_invalid_clientIdAndBrokerId() throws Exception {

        String currDir = Paths.get("").toAbsolutePath().toString();
        File standardFile = new File(
            currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/quotes/{brokerId}/{clientId}/validate",
               -1, -1)
            .file(mockFile)
            .file(mockFile2)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isInternalServerError())
            .andReturn();
    }

    @Test
    public void test_validation_errors_invalid_network_plans_and_rider() throws Exception {

        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File file = new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/"
            + SAMPLE_STANDARD_QUOTE_1_INVALID_NETWORK_AND_PLAN);

        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("files", file.getName(),
            Constants.EXTENSION_XLS, fis);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);

        // invalid plan
        assertThat(
            dto.getErrors().contains("The MEDICAL quote includes an invalid plan. Please check cell C96.")
        );

        // invalid rider
        assertThat(
            dto.getErrors().contains(
                "The Medical quote includes an invalid rider, $10 Chir56765435678o. Please check cell A321")
        );
    }

    @Test
    public void test_validation_error_dppo_files_different_tiers() throws Exception {

        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        File dppoFile2 = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_3_TIER_QUOTE);
        FileInputStream fis3 = new FileInputStream(dppoFile2);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        MockMultipartFile mockFile3 = new MockMultipartFile("files", dppoFile2.getName(),
            Constants.EXTENSION_XLSX, fis3);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile2, mockFile3),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);

        assertThat(dto.getNeedsMedicalQuoteType()).isNull();
        assertThat(dto.getNeedsDPPOOption()).isTrue();

        assertThat(
            dto.getErrors().contains(
                anthemQuoteUploader.getDPPO_FILES_HAVE_DIFFERENT_TIERS())
        );

        assertThat(
            dto.getErrors().contains(
                quoteHelper.getMISSING_RATES())
        );
    }

    private Client getClient() {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        Carrier carrier = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
        RfpCarrier rfpMedicalCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpCarrier rfpDentalCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);
        RfpCarrier rfpVisionCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.VISION);
        testEntityHelper.createTestRfpSubmission(client, rfpMedicalCarrier);
        testEntityHelper.createTestRfpSubmission(client, rfpDentalCarrier);
        testEntityHelper.createTestRfpSubmission(client, rfpVisionCarrier);
        return client;
    }

    @Test
    public void test_validation_errors_multiple_standard_files() throws Exception {

        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File standardFile = new File(
            currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File noDHMOFile = new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1_NO_DHMO);
        FileInputStream fis3 = new FileInputStream(noDHMOFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        MockMultipartFile mockFile3 = new MockMultipartFile("files", noDHMOFile.getName(),
            Constants.EXTENSION_XLS, fis3);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile, mockFile2, mockFile3),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);

        assertThat(dto.getNeedsMedicalQuoteType()).isTrue();
        assertThat(dto.getNeedsDPPOOption()).isTrue();

        assertThat(
            dto.getErrors().contains(
                anthemQuoteUploader.getMORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE())
        );
    }

    @Test
    public void test_validation_error_no_dhmo_plans_found_in_standard_file() throws Exception {

        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File noDHMOFile = new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1_NO_DHMO);
        FileInputStream fis3 = new FileInputStream(noDHMOFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        MockMultipartFile mockFile3 = new MockMultipartFile("files", noDHMOFile.getName(),
            Constants.EXTENSION_XLS, fis3);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile3, mockFile2),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);
        // validate one of the errors is DHMO not found in parsed quotes

        assertThat(dto.getNeedsMedicalQuoteType()).isTrue();
        assertThat(dto.getNeedsDPPOOption()).isTrue();
        assertThat(dto.getErrors().contains(anthemQuoteUploader.getDHMO_NETWORK_MISSING_FROM_QUOTE_FILE()));
    }

    @Test
    public void test_with_multiple_standard_files_for_medical() throws Exception {
        uploadBaseQuoteAndValidate();
    }

    @Test
    public void test_with_multiple_standard_files_for_medical_multiple_missing_rates() throws Exception {
        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File standardFile = new File(
            currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1_MISSING_RATES);
        FileInputStream fis = new FileInputStream(standardFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MvcResult result = sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/validate",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER
        );

        QuoteUploaderDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteUploaderDto.class);

        assertThat(dto.getNeedsMedicalQuoteType()).isTrue();

        // there should be only one message about missing rates even though there are about 5+ plans missing rates in test file
        assertThat(dto.getErrors()).containsOnlyOnce(new QuoteParserErrorDto("The MEDICAL quote appears to be missing rates. Check for missing and zero values."));
    }

    private Client uploadBaseQuoteAndValidate() throws Exception {
        Client client = getClient();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File standardFile = new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setDPPOOption(DPPOOption.NEW_QUOTE);
        dto.setMedicalQuoteType(QuoteType.STANDARD);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}",
                client.getBroker().getBrokerId(), client.getClientId()
            )
            .file(mockFile)
            .file(mockFile2)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(dto))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        List<RfpQuoteDto> resultList = Arrays
            .asList(jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class));

        assertThat(resultList.size()).isEqualTo(3);
        return client;
    }

    /**
     * Test Scenarios
     * 1. Upload one standard file, upload DHMO + DPPO
     * 2. Test adding to existing DPPO(
     * 3. Test overwriting DPPO
     * @throws Exception
     */
    @Test
    public void test_add_one_dppo_to_existing_scenarios() throws Exception {
        // upload first medical. dental(DHMO and DPPO), Vision
        Client client = uploadBaseQuoteAndValidate();

        // Start uploading second DPPO to replace existing Dental. Medical and Vision remain untouched
        String currDir = Paths.get("").toAbsolutePath().toString();
        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_2);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setDPPOOption(DPPOOption.ADD_TO_EXISTING_QUOTE);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}",
                client.getBroker().getBrokerId(), client.getClientId()
            )
            .file(mockFile2)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(dto))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        List<RfpQuoteDto> resultList = Arrays
            .asList(jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class));

        assertThat(resultList.size()).isEqualTo(1);
        assertThat(resultList.get(0).getCategory()).isEqualTo(Constants.DENTAL);

        RfpQuote quote = rfpQuoteRepository.findOne(resultList.get(0).getRfpQuoteId());
        RfpQuoteNetwork rfpQuoteNetwork = quote.getRfpQuoteNetworks()
            .stream()
            .filter(rqn -> rqn.getRfpQuoteOptionName().equals("DPPO Network"))
            .findFirst().get();

        List<RfpQuoteNetworkPlan> plans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(rfpQuoteNetwork);
        assertThat(plans.size()).isEqualTo(22); // 2 main plans plus 20 alternatives
        // validate plan name have "05/02/2018 Dental Complete 2"
        RfpQuoteNetworkPlan plan = plans.stream().filter(p  -> p.getPnn().getName().contains("05/02/2018 Dental Complete 2")).findAny().get();
        assertThat(plan).isNotNull();
    }

    /**
     * Makes sure that rfp submissions are created on the fly via new API
     * @throws Exception
     */
    @Test
    public void test_instant_rfp_submission_for_new_upload_api() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        Carrier carrier = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
        testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File standardFile = new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + SAMPLE_STANDARD_QUOTE_1);
        FileInputStream fis = new FileInputStream(standardFile);

        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + SAMPLE_DPPO_QUOTE_1);
        FileInputStream fis2 = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", standardFile.getName(),
            Constants.EXTENSION_XLS, fis);

        MockMultipartFile mockFile2 = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis2);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setDPPOOption(DPPOOption.NEW_QUOTE);
        dto.setMedicalQuoteType(QuoteType.STANDARD);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}",
                client.getBroker().getBrokerId(), client.getClientId()
            )
                .file(mockFile)
                .file(mockFile2)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(dto))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();


        List<RfpQuoteDto> resultList = Arrays
            .asList(jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class));

        assertThat(resultList.size()).isEqualTo(3);
        assertThat(resultList.stream().map(n -> n.getCategory()).collect(Collectors.toList()).size()).isEqualTo(3);

        // now try old API
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        File file4 = new File(currDir +
            "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed " +
            "State) - Manuals_Rev6_Excel Version_4Tier.xls");
        FileInputStream fis4 = new FileInputStream(file4);
        MockMultipartFile mockFile4 = new MockMultipartFile(
            "file",
            file4.getName(),
            "multipart/form-data",
            fis4
        );

        File file5 = new File(currDir +
            "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx");
        MockMultipartFile mockFile5 = new MockMultipartFile(
            "file2",
            file5.getName(),
            "multipart/form-data",
            new FileInputStream(file5)
        );

        File file6 = new File(currDir +
            "/data/quotes/Anthem/Dental/BenRevo Test Case2 3_8.8.17.xlsx");
        MockMultipartFile mockFile6 = new MockMultipartFile(
            "file2",
            file6.getName(),
            "multipart/form-data",
            new FileInputStream(file6)
        );

        result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
                client.getBroker().getBrokerId(), client.getClientId(),
                Constants.ANTHEM_CARRIER, Constants.DENTAL, QuoteType.STANDARD, false
            )
                .file(mockFile4)
                .file(mockFile5)
                .file(mockFile6)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(dto))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().is5xxServerError())
            .andReturn();
    }

    /**
     * A comprehensive test for client custom plans
     * First it uploads a quote for clientA same plan name(DPPO)
     * Second, it uploads a quote for clientB same plan name but different benefits
     * Finally it uploads a quote for clientB same
     *  plan name(does not create new plan cuz it exist) and it updates the benefit of existing plan.
     * @throws Exception
     */
    @Test
    public void test_dppo_files_link_to_client() throws Exception {
        Client client = getClient();
        Client clientB = getClient();

        RfpQuoteNetworkPlan plan = uploadDPPO(client, SAMPLE_DPPO_LINKED_TO_CLIENT);
        RfpQuoteNetworkPlan plan2 = uploadDPPO(clientB, SAMPLE_DPPO_LINKED_TO_CLIENT_CHANGED);

        assertThat(plan).isNotNull();
        assertThat(plan2).isNotNull();

        List<Benefit> benefits = benefitRepository.findByPlanId(plan.getPnn().getPlan().getPlanId());
        List<Benefit> benefits2 = benefitRepository.findByPlanId(plan2.getPnn().getPlan().getPlanId());

        validateBenefits(benefits, "DENTAL_INDIVIDUAL", "50");
        validateBenefits(benefits, "CALENDAR_YEAR_MAXIMUM", "2000");
        validateBenefits(benefits2, "DENTAL_INDIVIDUAL", "500000");
        validateBenefits(benefits2, "CALENDAR_YEAR_MAXIMUM", "200000");

        // make sure if the sample plan is found that the benefit is updated
        RfpQuoteNetworkPlan plan3 = uploadDPPO(clientB, SAMPLE_DPPO_LINKED_TO_CLIENT_CHANGED_B);
        assertThat(plan3).isNotNull();

        benefits2 = benefitRepository.findByPlanId(plan3.getPnn().getPlan().getPlanId());
        validateBenefits(benefits2, "ORTHODONTIA_LIFETIME_MAX", "2500");
    }

    private void validateBenefits(List<Benefit> benefits, String benName, String value){
        for(Benefit b : benefits){
            if(b.getBenefitName().getName().equals(benName)){
                assertThat(b.getValue()).isEqualTo(value);
            } else if(b.getBenefitName().getName().equals(benName)){
                assertThat(b.getValue()).isEqualTo(value);
            }
        }
    }

    private RfpQuoteNetworkPlan uploadDPPO(Client client, String fileName) throws Exception{
        String currDir = Paths.get("").toAbsolutePath().toString();
        File dppoFile = new File(currDir + "/data/quotes/Anthem/Dental/" + fileName);
        FileInputStream fis = new FileInputStream(dppoFile);

        MockMultipartFile mockFile = new MockMultipartFile("files", dppoFile.getName(),
            Constants.EXTENSION_XLSX, fis);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setDPPOOption(DPPOOption.NEW_QUOTE);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload(
                "/admin/quotes/{brokerId}/{clientId}",
                client.getBroker().getBrokerId(), client.getClientId()
            )
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("dto", jsonUtils.toJson(dto))
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        List<RfpQuoteDto> resultList = Arrays
            .asList(jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class));

        assertThat(resultList.size()).isEqualTo(1);
        assertThat(resultList.get(0).getCategory()).isEqualTo(Constants.DENTAL);

        RfpQuote quote = rfpQuoteRepository.findOne(resultList.get(0).getRfpQuoteId());
        RfpQuoteNetwork rfpQuoteNetwork = quote.getRfpQuoteNetworks()
            .stream()
            .filter(rqn -> rqn.getRfpQuoteOptionName().equals("DPPO Network"))
            .findFirst().get();

        List<RfpQuoteNetworkPlan> plans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(rfpQuoteNetwork);
        assertThat(plans.size()).isEqualTo(11);

        return plans.stream().filter(p  -> p.getPnn().getName().equals("Dental Complete Link To ClientId And Custom True")).findFirst().orElse(null);
    }


    @Test
    public void testLoadAnthemLifeStdQuote() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.ANTHEM_CARRIER,
            Constants.ANTHEM_CARRIER
        );
        RfpCarrier rfpLifeCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            LIFE
        );
        RfpSubmission rfpLifeSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpLifeCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpLifeSubmission);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "/data/quotes/Anthem/Life/sample_life_quote.pdf");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        flushAndClear();

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.ANTHEM_CARRIER,
            LIFE,
            QuoteType.STANDARD,
            false
        );

        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), LIFE);
        assertThat(rfpQuotes).hasSize(1);
    }
}


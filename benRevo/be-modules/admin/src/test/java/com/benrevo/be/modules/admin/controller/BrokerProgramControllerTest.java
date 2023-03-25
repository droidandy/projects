package com.benrevo.be.modules.admin.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.admin.service.BrokerProgramService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.util.ClientLocaleUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

public class BrokerProgramControllerTest extends AbstractControllerTest {

    @Autowired
    private BrokerProgramController brokerProgramController;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    @Autowired
    private PlanNameByNetworkRepository pnnRepository;

    @Autowired
    private ClientLocaleUtils clientLocaleUtils;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;

    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;

    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;

    @Autowired
    private PlanRateRepository planRateRepository;

    @Before
    @Override
    public void init() {
        initController(brokerProgramController);
    }

    @Test
    public void getProgramPlans() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();

        Program program = createTestProgramWithPlans("Test program", broker);

        token = createToken(broker.getBrokerToken());

        MvcResult result = performGetAndAssertResult(null, "/admin/programs/{id}/plans", program.getProgramId());

        PlanNameByNetworkDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), PlanNameByNetworkDto[].class);

        assertThat(plans).hasSize(2);
        for(PlanNameByNetworkDto plan : plans) {
            assertThat(plan).hasNoNullFieldsOrProperties();
        }
    }

    @Test
    public void createQuotes_CIGNA_CLSA_LIFE() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.CIGNA.name(),
            Constants.LIFE);

        AncillaryPlan relevantPlan = testEntityHelper.buildTestAncillaryPlan("Basic Life Current year",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, rfpCarrier1.getCarrier());
        relevantPlan.setPlanYear(client.getEffectiveYear());
        ancillaryPlanRepository.save(relevantPlan);

        AncillaryPlan oldPlan = testEntityHelper.buildTestAncillaryPlan("Basic Life 2017",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, rfpCarrier1.getCarrier());
        oldPlan.setPlanYear(client.getEffectiveYear() - 1);
        ancillaryPlanRepository.save(oldPlan);

        Program program1 = testEntityHelper.createTestProgram(Constants.CLSA_TRUST_PROGRAM, rfpCarrier1, client.getBroker());

        ProgramToAncillaryPlan p2ap1 = testEntityHelper.createTestProgramToAncillaryPlan(program1, relevantPlan);
        ProgramToAncillaryPlan p2ap2 = testEntityHelper.createTestProgramToAncillaryPlan(program1, oldPlan);

        testEntityHelper.createTestRfpSubmission(client, program1);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();

        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        params.add(param1);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(1);

        RfpQuote rfpQuote = rfpQuoteRepository.findOne(quotes[0].getRfpQuoteId());
        assertThat(rfpQuote.getQuoteType()).isEqualTo(QuoteType.CLSA_TRUST_PROGRAM);
        assertThat(rfpQuote.getRfpQuoteNetworks()).isEmpty();

        List<RfpQuoteAncillaryPlan> createdPlans = rfpQuoteAncillaryPlanRepository.findByRfpQuote(rfpQuote);
        // filtered by planYear
        assertThat(createdPlans).hasSize(1);
        AncillaryPlan ancillaryPlan = createdPlans.get(0).getAncillaryPlan();
        assertThat(ancillaryPlan.getPlanName()).isEqualTo(relevantPlan.getPlanName());
        assertThat(ancillaryPlan.getPlanType()).isEqualTo(relevantPlan.getPlanType());
        assertThat(ancillaryPlan.getPlanYear()).isEqualTo(relevantPlan.getPlanYear());

    }

    @Test
    public void createQuotes_UHC_CLSA_MEDICAL() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.UHC.name(), Constants.MEDICAL);

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Rx Plan 1", CarrierType.UHC.name(), "RX_HMO");

        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", CarrierType.UHC.name(), "PPO");
        Program program1 = testEntityHelper.createTestProgram(Constants.CLSA_TRUST_PROGRAM, rfpCarrier1, client.getBroker(), pnn1, pnn2);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());
        assertThat(programPnns1).hasSize(2);

        for(ProgramToPnn programToPnn : programPnns1) {
            if(programToPnn.getPnn().getPlanType().equals("PPO")) {
                PlanRate rates1 = testEntityHelper.createTestPlanRate(programToPnn, null, 4, 100f, 101f, 102f, 103f,
                    PlanRateType.COUNTY, BrokerLocale.NORTH.name(),
                    PlanRateType.RATE_YEAR, String.valueOf(client.getEffectiveYear()),
                    PlanRateType.AGE_GROUP, "A");
            } else if(programToPnn.getPnn().getPlanType().equals("RX_HMO")) {
                PlanRate rates2 = testEntityHelper.createTestPlanRate(programToPnn, null, 4, 150f, 151f, 152f, 153f,
                    PlanRateType.COUNTY, BrokerLocale.SOUTH.name(),
                    PlanRateType.RATE_YEAR, String.valueOf(client.getEffectiveYear()),
                    PlanRateType.AGE_GROUP, "B");
            }
        }

        testEntityHelper.createTestRfpSubmission(client, program1);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        // Quote 1 with HMO plan
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        // FIXME change type to Integer
        param1.setAverageAge("40"); // Group B 34-43
        param1.setZipCode("90001");
        params.add(param1);
        // Quote 2 with PPO plan
        CreateProgramQuoteDto param2 = new CreateProgramQuoteDto();
        param2.setClientId(client.getClientId());
        param2.setProgramId(program1.getProgramId());
        // FIXME change type to Integer
        param2.setAverageAge("33"); // Group A 0-33
        param2.setZipCode("95110");
        params.add(param2);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(2);

        for(RfpQuoteDto rfpQuoteDto : quotes) {
            RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());
            assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
            assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
            RfpQuoteNetworkPlan plan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
            if(plan.getPnn().getPlanType().equals("RX_HMO")) {
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName())
                    .isEqualTo(pnn2.getNetwork().getName());
                assertThat(plan.getTier1Rate()).isEqualTo(150f);
            } else {
                assertThat(plan.getPnn().getPlanType()).isEqualTo("PPO");
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName())
                    .isEqualTo(pnn2.getNetwork().getName());
                assertThat(plan.getTier1Rate()).isEqualTo(100f);
            }
        }
    }

    @Test
    public void createQuotes_METLIFE_CLSA_DENTAL_VISION() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.METLIFE.name(), Constants.DENTAL);
        RfpCarrier rfpCarrier2 = testEntityHelper.createTestRfpCarrier(CarrierType.METLIFE.name(), Constants.VISION);

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", CarrierType.UHC.name(), "DHMO");

        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", CarrierType.UHC.name(), "DPPO");
        Program program1 = testEntityHelper.createTestProgram(Constants.CLSA_TRUST_PROGRAM, rfpCarrier1, client.getBroker(), pnn1, pnn2);

        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 3", CarrierType.UHC.name(), "VISION");
        Program program2 = testEntityHelper.createTestProgram(Constants.CLSA_TRUST_PROGRAM, rfpCarrier2, client.getBroker(), pnn3);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());
        assertThat(programPnns1).hasSize(2);

        for(ProgramToPnn programToPnn : programPnns1) {
            if(programToPnn.getPnn().getPlanType().equals("DHMO")) {
                PlanRate rates1 = testEntityHelper.createTestPlanRate(programToPnn, null, 4, 100f, 101f, 102f, 103f,
                    PlanRateType.COUNTY, "3",
                    PlanRateType.GROUP_SIZE, "10-24", PlanRateType.RATE_YEAR, "2018");
            } else if(programToPnn.getPnn().getPlanType().equals("DPPO")) {
                PlanRate rates2 = testEntityHelper.createTestPlanRate(programToPnn, null, 4, 150f, 151f, 152f, 153f,
                    PlanRateType.COUNTY, "3",
                    PlanRateType.GROUP_SIZE, "10-24", PlanRateType.RATE_YEAR, "2018");
            }
        }
        List<ProgramToPnn> programPnns2 = programToPnnRepository.findByProgramId(program2.getProgramId());
        assertThat(programPnns2).hasSize(1);

        for(ProgramToPnn programToPnn : programPnns2) {
            PlanRate rates1 = testEntityHelper.createTestPlanRate(programToPnn, null, 4, 200f, 201f, 202f, 203f,
                PlanRateType.COUNTY, "4",
                PlanRateType.GROUP_SIZE, "50-99", PlanRateType.RATE_YEAR, "2018");
        }

        testEntityHelper.createTestRfpSubmission(client, program1);
        testEntityHelper.createTestRfpSubmission(client, program2);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        // Quote 1 with two DHMO and DPPO plans  (program1)
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        // FIXME change type to Integer
        param1.setNumEligibleEmployees("24"); // 10-24
        param1.setZipCode("90001");
        params.add(param1);
        // Quote 2 with VISION plan (program2)
        CreateProgramQuoteDto param2 = new CreateProgramQuoteDto();
        param2.setClientId(client.getClientId());
        param2.setProgramId(program2.getProgramId());
        // FIXME change type to Integer
        param2.setNumEligibleEmployees("50"); // 50-99
        param2.setZipCode("95110");
        params.add(param2);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(2);

        for(RfpQuoteDto rfpQuoteDto : quotes) {

            RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());
            if(quote.getRfpSubmission().getRfpCarrier().getCategory().equals(Constants.DENTAL)) {

                // FIXME teast failed with preloaded CLSA rated in test DB

                assertThat(quote.getRfpQuoteNetworks()).hasSize(2);
                for(RfpQuoteNetwork netw : quote.getRfpQuoteNetworks()) {
                    assertThat(netw.getRfpQuoteNetworkPlans()).hasSize(1);
                    RfpQuoteNetworkPlan plan = netw.getRfpQuoteNetworkPlans().get(0);
                    if(plan.getPnn().getPlanType().equals("DHMO")) {
                        assertThat(plan.getPnn().getName()).isEqualTo(pnn1.getName());
                        assertThat(plan.getTier1Rate()).isEqualTo(100f);
                    } else {
                        assertThat(plan.getPnn().getName()).isEqualTo(pnn2.getName());
                        assertThat(plan.getTier1Rate()).isEqualTo(150f);
                    }
                }
            } else {
                assertThat(quote.getRfpSubmission().getRfpCarrier().getCategory()).isEqualTo(Constants.VISION);
                assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
                RfpQuoteNetworkPlan plan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
                assertThat(plan.getPnn().getPlanType()).isEqualTo("VISION");
                assertThat(plan.getPnn().getName()).isEqualTo(pnn3.getName());
                assertThat(plan.getTier1Rate()).isEqualTo(200f);
            }
        }
    }

    @Test
    public void createQuotes_ANTHEM_BBT_MEDICAL_DENTAL() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpCarrier rfpCarrier2 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        BrokerLocale locale = clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO");
        // Anthem plan applicable rider by name
        pnn1.setName(BrokerProgramService.ANTHEM_RIDER_APPLICABLE_PLAN_NAME);
        pnn1 = pnnRepository.save(pnn1);

        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", CarrierType.ANTHEM_BLUE_CROSS.name(), "PPO");
        Program program1 = testEntityHelper.createTestProgram(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, rfpCarrier1, client.getBroker(), pnn1, pnn2);

        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 3", CarrierType.ANTHEM_BLUE_CROSS.name(), "DHMO");
        Program program2 = testEntityHelper.createTestProgram(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, rfpCarrier2, client.getBroker(), pnn3);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());
        assertThat(programPnns1).hasSize(2);

        for(ProgramToPnn programToPnn : programPnns1) {
            if(programToPnn.getPnn().getPlanType().equals("PPO")) {
                PlanRate rates1 = testEntityHelper.createTestPlanRate(programToPnn, 2.5f, 4, 100f, 101f, 102f, 103f,
                    PlanRateType.COUNTY, "MissingValue");
            } else if(programToPnn.getPnn().getPlanType().equals("HMO")) {
                PlanRate rates2 = testEntityHelper.createTestPlanRate(programToPnn, 2.5f, 4, 150f, 151f, 152f, 153f,
                    PlanRateType.COUNTY, locale.name());
            }
        }

        List<ProgramToPnn> programPnns2 = programToPnnRepository.findByProgramId(program2.getProgramId());
        for(ProgramToPnn pr2Pnn : programPnns2) {
            testEntityHelper.createTestPlanRate(pr2Pnn, 7f, 4, 200f, 201f, 202f, 203f, PlanRateType.COUNTY, locale.name());
        }

        RfpSubmission sub1 = testEntityHelper.createTestRfpSubmission(client, program1);
        RfpSubmission sub2 = testEntityHelper.createTestRfpSubmission(client, program2);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        param1.setRatingBand(2.5f);
        params.add(param1);
        CreateProgramQuoteDto param2 = new CreateProgramQuoteDto();
        param2.setClientId(client.getClientId());
        param2.setProgramId(program2.getProgramId());
        param2.setRatingBand(7f);
        params.add(param2);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(2);

        for(RfpQuoteDto rfpQuoteDto : quotes) {
            RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());
            assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
            assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
            RfpQuoteNetworkPlan plan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
            if(rfpQuoteDto.getRfpCarrierId().equals(rfpCarrier1.getRfpCarrierId())) {
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName())
                    .isEqualTo(pnn2.getNetwork().getName());
                assertThat(plan.getTier1Rate()).isEqualTo(150f);
                // check for Anthem plan applicable rider
                assertThat(plan.getRiders()).isNotEmpty();
            } else {
                assertThat(rfpQuoteDto.getRfpCarrierId()).isEqualTo(rfpCarrier2.getRfpCarrierId());
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName())
                    .isEqualTo(pnn3.getNetwork().getName());
                assertThat(plan.getTier1Rate()).isEqualTo(200f);
                assertThat(plan.getRiders()).isEmpty();
            }
        }
    }

    @Test
    public void createQuotes_ANTHEM_BBT_VISION() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEmployeeCount(100L);
        client = clientRepository.save(client);

        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        BrokerLocale locale = clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", CarrierType.ANTHEM_BLUE_CROSS.name(), "VISION");
        Program program1 = testEntityHelper.createTestProgram(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, rfpCarrier1, client.getBroker(), pnn1);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());
        assertThat(programPnns1).hasSize(1);

        // will be filtered by GROUP_SIZE (see client.setEmployeeCount(100L) above)
        PlanRate rates1 = testEntityHelper.createTestPlanRate(programPnns1.get(0), null, 4, 100f, 101f, 102f, 103f,
            PlanRateType.GROUP_SIZE, "1-99", PlanRateType.COUNTY, locale.name());

        PlanRate rates2 = testEntityHelper.createTestPlanRate(programPnns1.get(0), null, 4, 200f, 201f, 202f, 203f,
            PlanRateType.GROUP_SIZE, "100-200", PlanRateType.COUNTY, locale.name());

        RfpSubmission sub1 = testEntityHelper.createTestRfpSubmission(client, program1);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        params.add(param1);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(1);
        RfpQuoteDto rfpQuoteDto = quotes[0];

        RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());
        assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
        assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
        RfpQuoteNetworkPlan plan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);

        float visionCommission = 1.07f; // 7%, constant
        assertThat(plan.getTier1Rate()).isEqualTo(200f * visionCommission);
    }

    @Test
    public void createQuotes_DELTA_DENTAL_BBT_VSP_BBT() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.DELTA_DENTAL.name(), Constants.DENTAL);
        RfpCarrier rfpCarrier2 = testEntityHelper.createTestRfpCarrier(CarrierType.VSP.name(), Constants.VISION);

        BrokerLocale locale = clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", CarrierType.DELTA_DENTAL.name(), "DHMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", CarrierType.VSP.name(), "VISION");
        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 3", CarrierType.DELTA_DENTAL.name(), "DPPO");

        Program program1 = testEntityHelper.createTestProgram(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, rfpCarrier1, client.getBroker(), pnn1, pnn3);
        Program program2 = testEntityHelper.createTestProgram(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, rfpCarrier2, client.getBroker(), pnn2);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());
        assertThat(programPnns1).hasSize(2);

        for(ProgramToPnn programToPnn : programPnns1) {
            if(programToPnn.getPnn().getPlanType().equals("DHMO")) {
                // ratingBand = 5f is not required by query condition and should be returned
                PlanRate rates1 = testEntityHelper.createTestPlanRate(programToPnn, 5f, 2, 250f, 251f, 252f, 253f,
                    PlanRateType.COUNTY, client.getPredominantCounty());
            } else {
                PlanRate rates2 = testEntityHelper.createTestPlanRate(programToPnn, null, 3, 250f, 251f, 252f, 253f,
                    PlanRateType.COUNTY, locale.name());
            }
        }

        List<ProgramToPnn> programPnns2 = programToPnnRepository.findByProgramId(program2.getProgramId());
        assertThat(programPnns2).hasSize(1);

        PlanRate rates3 = testEntityHelper.createTestPlanRate(programPnns2.get(0), null, 4, 101f, 102f, 103f, 104f,
            PlanRateType.COUNTY, locale.name());

        RfpSubmission sub1 = testEntityHelper.createTestRfpSubmission(client, program1);
        RfpSubmission sub2 = testEntityHelper.createTestRfpSubmission(client, program2);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        params.add(param1);
        CreateProgramQuoteDto param2 = new CreateProgramQuoteDto();
        param2.setClientId(client.getClientId());
        param2.setProgramId(program2.getProgramId());
        params.add(param2);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(2);

        for(RfpQuoteDto rfpQuoteDto : quotes) {
            RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());

            if(rfpQuoteDto.getRfpCarrierId().equals(rfpCarrier1.getRfpCarrierId())) {
                assertThat(quote.getRfpQuoteNetworks()).hasSize(2);
                for(RfpQuoteNetwork rqn : quote.getRfpQuoteNetworks()) {
                    if(rqn.getNetwork().getType().equals("DHMO")) {
                        assertThat(rqn.getRiders()).isEmpty();
                        assertThat(rqn.getRfpQuoteNetworkPlans()).hasSize(1);
                    } else {
                        // check for Delta Dental network riders (static riders from DB: Delta PPO Plan 1A, 2A, 3A)
                        assertThat(rqn.getRiders()).hasSize(3);
                        assertThat(rqn.getRfpQuoteNetworkPlans()).hasSize(1);
                    }
                }
            } else {
                assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
                assertThat(rfpQuoteDto.getRfpCarrierId()).isEqualTo(rfpCarrier2.getRfpCarrierId());
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
            }
        }
    }

    @Test
    public void createQuotes_ANTHEM_TT() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpCarrier rfpCarrier1 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpCarrier rfpCarrier2 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpCarrier rfpCarrier3 = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);

        PlanNameByNetwork pnn1_1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1",
            CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO", "Network X");
        PlanNameByNetwork pnn1_2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2",
            CarrierType.ANTHEM_BLUE_CROSS.name(), "PPO", "Network Y");
        PlanNameByNetwork pnn2_1 = testEntityHelper.createTestPlanNameByNetwork("Plan 3",
            CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO", "Network W");
        PlanNameByNetwork pnn2_2 = testEntityHelper.createTestPlanNameByNetwork("Plan 4",
            CarrierType.ANTHEM_BLUE_CROSS.name(), "PPO", "Network Z");

        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 5", CarrierType.ANTHEM_BLUE_CROSS.name(), "DPPO");
        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 6", CarrierType.ANTHEM_BLUE_CROSS.name(), "VISION");

        Program program1 = testEntityHelper.createTestProgram(Constants.TECH_TRUST_PROGRAM, rfpCarrier1, client.getBroker(),
            pnn1_1, pnn1_2, pnn2_1, pnn2_2);

        List<ProgramToPnn> programPnns1 = programToPnnRepository.findByProgramId(program1.getProgramId());

        PlanRate rates1 = testEntityHelper.createTestPlanRate(programPnns1.get(0), 7f, 4, 100f, 101f, 102f, 103f,
            PlanRateType.NETWORK_COMBINATION, "SINGLE");
        PlanRate rates2 = testEntityHelper.createTestPlanRate(programPnns1.get(1), 7f, 4, 200f, 201f, 202f, 203f,
            PlanRateType.NETWORK_COMBINATION, "SINGLE");
        PlanRate rates3 = testEntityHelper.createTestPlanRate(programPnns1.get(2), 7f, 4, 300f, 301f, 302f, 303f,
            PlanRateType.NETWORK_COMBINATION, "DUAL");
        PlanRate rates4 = testEntityHelper.createTestPlanRate(programPnns1.get(3), 7f, 4, 400f, 401f, 402f, 403f,
            PlanRateType.NETWORK_COMBINATION, "DUAL");

        Program program2 = testEntityHelper.createTestProgram(Constants.TECH_TRUST_PROGRAM, rfpCarrier2, client.getBroker(), pnn2);
        List<ProgramToPnn> programPnns2 = programToPnnRepository.findByProgramId(program2.getProgramId());
        PlanRate rates5 = testEntityHelper.createTestPlanRate(programPnns2.get(0), 7f, 4, 100f, 101f, 102f, 103f,
            null, null);

        Program program3 = testEntityHelper.createTestProgram(Constants.TECH_TRUST_PROGRAM, rfpCarrier3, client.getBroker(),
            pnn3);
        List<ProgramToPnn> programPnns3 = programToPnnRepository.findByProgramId(program3.getProgramId());
        PlanRate rates6 = testEntityHelper.createTestPlanRate(programPnns3.get(0), 7f, 4, 100f, 101f, 102f, 103f,
            null, null);

        RfpSubmission sub1 = testEntityHelper.createTestRfpSubmission(client, program1);
        RfpSubmission sub2 = testEntityHelper.createTestRfpSubmission(client, program2);
        RfpSubmission sub3 = testEntityHelper.createTestRfpSubmission(client, program3);

        flushAndClear();

        List<CreateProgramQuoteDto> params = new ArrayList<>();
        CreateProgramQuoteDto param1 = new CreateProgramQuoteDto();
        param1.setClientId(client.getClientId());
        param1.setProgramId(program1.getProgramId());
        param1.setRatingBand(7f);
        params.add(param1);
        CreateProgramQuoteDto param2 = new CreateProgramQuoteDto();
        param2.setClientId(client.getClientId());
        param2.setProgramId(program2.getProgramId());
        param2.setRatingBand(7f);
        params.add(param2);
        CreateProgramQuoteDto param3 = new CreateProgramQuoteDto();
        param3.setClientId(client.getClientId());
        param3.setProgramId(program3.getProgramId());
        param3.setRatingBand(7f);
        params.add(param3);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null,  "/admin/programs/createQuotes");

        RfpQuoteDto[] quotes = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);
        assertThat(quotes).hasSize(3);

        for(RfpQuoteDto rfpQuoteDto : quotes) {
            RfpQuote quote = rfpQuoteRepository.findOne(rfpQuoteDto.getRfpQuoteId());

            RfpQuoteNetworkPlan plan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
            if(rfpQuoteDto.getRfpCarrierId().equals(rfpCarrier1.getRfpCarrierId())) {
                // 2 Single Network X and Network Y + 2 Dual Network X and Network Y
                assertThat(quote.getRfpQuoteNetworks()).hasSize(4);
                // see test PlanNameByNetwork peraparing above
                for(RfpQuoteNetwork rqn : quote.getRfpQuoteNetworks()) {
                    assertThat(rqn.getRfpQuoteNetworkCombination()).isNotNull();
                    assertThat(rqn.getRfpQuoteNetworkPlans()).hasSize(1);
                }
                assertThat(quote.getRfpQuoteNetworks())
                    .extracting(n -> n.getRfpQuoteNetworkCombination().getName())
                    .containsExactlyInAnyOrder(
                        "Single (Network X, Network Y)", "Single (Network X, Network Y)",
                        "Dual (Network W / Network Z)", "Dual (Network W / Network Z)");
            } else {
                assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
                assertThat(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);
            }
        }
    }

    @Test
    public void updateProgramPlans() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();

        Program program = createTestProgramWithPlans("Test program", broker);

        List<PlanNameByNetwork> pnns = programToPnnRepository.findPnnsByProgramId(program.getProgramId());
        assertThat(pnns).hasSize(2);

        PlanNameByNetwork newPnn = testEntityHelper.createTestPlanNameByNetwork("Plan 3", appCarrier[0], "HSA");

        List<PlanNameByNetworkDto> updatePlans = new ArrayList<>();
        PlanNameByNetworkDto pnn1 = new PlanNameByNetworkDto();
        pnn1.setPnnId(pnns.get(0).getPnnId());
        updatePlans.add(pnn1);
        PlanNameByNetworkDto pnn2 = new PlanNameByNetworkDto();
        pnn2.setPnnId(newPnn.getPnnId());
        updatePlans.add(pnn2);

        token = createToken(broker.getBrokerToken());

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updatePlans), null,  "/admin/programs/{id}/plans", program.getProgramId());

        PlanNameByNetworkDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), PlanNameByNetworkDto[].class);

        assertThat(plans).extracting(PlanNameByNetworkDto::getPnnId)
            .containsExactlyInAnyOrder(pnn1.getPnnId(), pnn2.getPnnId());
        for(PlanNameByNetworkDto plan : plans) {
            assertThat(plan).hasNoNullFieldsOrProperties();
        }
        // check for updated in DB
        pnns = programToPnnRepository.findPnnsByProgramId(program.getProgramId());
        assertThat(pnns).hasSize(2);
        assertThat(pnns).extracting(PlanNameByNetwork::getPnnId)
            .containsExactlyInAnyOrder(pnn1.getPnnId(), pnn2.getPnnId());
    }

    private Program createTestProgramWithPlans(String name, Broker broker) {
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(appCarrier[0], Constants.MEDICAL);
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", appCarrier[0], "HMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", appCarrier[0], "PPO");
        Program program = testEntityHelper.createTestProgram(name, rfpCarrier, broker, pnn1, pnn2);
        return program;
    }
}
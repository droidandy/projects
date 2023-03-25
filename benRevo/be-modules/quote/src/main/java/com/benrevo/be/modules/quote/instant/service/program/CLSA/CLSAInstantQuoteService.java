package com.benrevo.be.modules.quote.instant.service.program.CLSA;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterPlanTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanTotal;
import static com.benrevo.common.Constants.ANTHEM_CV_DISCLAIMER;
import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.DHMO;
import static com.benrevo.common.Constants.DPPO;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY;
import static com.benrevo.common.Constants.HMO;
import static com.benrevo.common.Constants.HSA;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.PPO;
import static com.benrevo.common.Constants.RX_HMO;
import static com.benrevo.common.Constants.RX_HSA;
import static com.benrevo.common.Constants.RX_PPO;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.ANTHEM_CLEAR_VALUE;
import static com.benrevo.common.enums.CarrierType.BENREVO;
import static com.benrevo.common.enums.CarrierType.METLIFE;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.Integer.parseUnsignedInt;
import static java.lang.Long.compare;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

import com.benrevo.be.modules.quote.instant.service.InstantQuoteService;
import com.benrevo.be.modules.quote.instant.service.anthem.AnthemInstantQuoteEmailService;
import com.benrevo.be.modules.quote.instant.service.anthem.AnthemInstantQuoteService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.AdministrativeFeeService;
import com.benrevo.be.modules.shared.service.SharedBrokerProgramService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.anthem.AnthemClearValueCalculator;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.AnthemCVDentalRates;
import com.benrevo.common.dto.AnthemCVPlan;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.dto.ValidationErrorDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.ClientLocaleUtils;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MathUtils;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.QuoteOption;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import com.google.common.collect.Iterables;
import io.vavr.control.Try;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(BENREVO)
@Transactional
public class CLSAInstantQuoteService extends InstantQuoteService{

    public static final String CLSA_OPTION_1_NAME = "CLSA Option 1";

	@Value("${app.carrier}")
    protected String[] appCarrier;

    @Value("${app.env}")
    protected String appEnv;

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private ClientLocaleUtils clientLocaleUtils;

    @Autowired
    private SharedBrokerProgramService sharedBrokerProgramService;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private AdministrativeFeeService administrativeFeeService;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private PlanRateRepository planRateRepository;

    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
/*
    private final String DEFAULT_HMO_PLAN_NAME = "HMO 10/0 (U8M/4PJ)";
    private final String DEFAULT_PPO_PLAN_NAME = "PPO 250/10 (AB6G/242)";
    private final String DEFAULT_HSA_PLAN_NAME = "PPO w/HSA 1500/10 (ULR/0C2)";
    private final String DEFAULT_RX_HMO_PLAN_NAME = "Advantage (4PJ)";
    private final String DEFAULT_RX_PPO_PLAN_NAME = "Advantage (242)";
    private final String DEFAULT_RX_HSA_PLAN_NAME = "Advantage (0C2)";
    private final String DEFAULT_DHMO_PLAN_NAME = "No CLSA Plan";
    private final String DEFAULT_DPPO_PLAN_NAME = "Option 1 - $1500 100/80/50 w/Ortho";
    private final String DEFAULT_VPPO_PLAN_NAME = "VISPLAN1 - M130D-10/25";
    private final String DEFAULT_LIFE_PLAN_NAME_PREFIX = "Option 1";
    private final String DEFAULT_VOL_LIFE_PLAN_NAME_PREFIX = "Option 4";
    private final String DEFAULT_STD_PLAN_NAME_PREFIX = "Option 1";
    private final String DEFAULT_LTD_PLAN_NAME_PREFIX = "Option 1";
*/
    @Override
    public void generateProgramTrustQuote(Long clientId, CreateProgramQuoteDto params){

        // Generate trust quote
        Program program = programRepository.findOne(params.getProgramId());
        if(program == null) {
            throw new BaseException("Program by id not found").withFields(field("program_id", params.getProgramId()));
        }

        Client client = clientRepository.findOne(params.getClientId());
        if(client == null) {
            throw new BaseException("Client by id not found").withFields(field("client_id", params.getClientId()));
        }

        RfpSubmission rs = rfpSubmissionRepository.findByProgramAndClient(program, client);
        if(rs == null) {
            rs = new RfpSubmission();
            rs.setCreated(DateHelper.fromDateToString(new Date(), DATETIME_FORMAT));
        }

        rs.setClient(client);
        rs.setProgram(program);
        rs.setDisqualificationReason(null);
        rs.setRfpCarrier(program.getRfpCarrier());
        sharedRfpService.setSubmissionOriginDetails(rs);
        rfpSubmissionRepository.save(rs);


        RfpQuote rfpQuote = rfpQuoteRepository.findByRfpSubmissionProgramProgramIdAndRfpSubmissionClientClientIdAndLatestIsTrueAndQuoteType(
            params.getProgramId(), params.getClientId(), QuoteType.CLSA_TRUST_PROGRAM);
        if(rfpQuote == null) {
            rfpQuote = rfpQuoteRepository.findByRfpSubmissionProgramProgramIdAndRfpSubmissionClientClientIdAndLatestIsTrueAndQuoteType(
                params.getProgramId(), params.getClientId(), QuoteType.DECLINED);
        }

        if(rfpQuote == null) {
            rfpQuote = sharedBrokerProgramService.createQuotes(params);
        }

        if(rfpQuote == null){
            throw new BaseException("Issue creating CLSA Trust Quote. Quote is empty");
        }

        // Generating trust option 1, ...
        sharedBrokerProgramService.createOption(rfpQuote, program.getRfpCarrier().getCategory(), OptionType.OPTION);
    }

    @Override
    public ValidationErrorDto validateProgramRequirements(Long clientId, CreateProgramQuoteDto params){

        ValidationErrorDto errorDto = new ValidationErrorDto();
        Program program = programRepository.findOne(params.getProgramId());
        if(program == null) {
            throw new BaseException("Program by id not found").withFields(field("program_id", params.getProgramId()));
        }

        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new BaseException("Client by id not found").withFields(field("client_id", clientId));
        }

        Carrier carrier = program.getRfpCarrier().getCarrier();
        PlanCategory planCategory =  PlanCategory.valueOf(program.getRfpCarrier().getCategory());
        String effectiveYear = sharedBrokerProgramService.getCLSARateYear(client.getEffectiveDate());
        if(planCategory.isAncillary()) {
            List<ProgramToAncillaryPlan> programPlans = programToAncillaryPlanRepository.findByProgramIdAndAncillaryPlanPlanYear(
                program.getProgramId(), Integer.parseUnsignedInt(effectiveYear));

            if(programPlans.isEmpty()) {
                errorDto.getErrors()
                    .add("Cannot find plans for client's effective year:" + effectiveYear);
            }
        } else {
            if (!isEmpty(params.getZipCode())) { // see https://app.asana.com/0/698808617985334/727223451014765/f
                if (params.getZipCode().length() < 5) {
                    errorDto.getErrors()
                        .add("Please contact Trust administrator about zip code:" + params.getZipCode());
                    return errorDto;
                }

                String shortZip = params.getZipCode().substring(0, 3);
                if (equalsAny(shortZip, "955", "960", "961")) {
                    errorDto.getErrors()
                        .add("Please contact Trust administrator about zip code:" + params.getZipCode());
                    return errorDto;
                }
            }

            if (program.getName().equalsIgnoreCase(Constants.CLSA_TRUST_PROGRAM)){
                if(carrierMatches(carrier.getName(), UHC)) {

                    // check the UHC zip code util
                    String region = clientLocaleUtils.getCLSARegionByZipCode(params.getZipCode());
                    if (region == null) {
                        errorDto.getErrors()
                            .add("Cannot find client Region by zip code: " + params.getZipCode());
                        return errorDto;
                    }

                    if (!planRateRepository.findByProgramId(program.getProgramId()).stream()
                        .anyMatch(p -> p.getTypeValue2().equals(effectiveYear))) {
                        errorDto.getErrors()
                            .add("Cannot find plans for client's effective year:" + effectiveYear);
                        return errorDto;
                    }
                } else if(carrierMatches(carrier.getName(), METLIFE)) {

                    // check the Metlife zip code util
                    String region = sharedBrokerProgramService
                        .getRegionCodeByZip(params.getZipCode());
                    if (region == null) {
                        errorDto.getErrors()
                            .add("Cannot find client Region by zip code: " + params.getZipCode());
                        return errorDto;
                    }

                    if (!planRateRepository.findByProgramId(program.getProgramId()).stream()
                        .anyMatch(p -> p.getTypeValue3().equals(effectiveYear))) {
                        errorDto.getErrors()
                            .add("Cannot find plans for client's effective year:" + effectiveYear);
                        return errorDto;
                    }
                }
            }

        }
        return errorDto;
    }
}

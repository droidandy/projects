package com.benrevo.be.modules.shared.service;

import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.RateType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.OptionRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryClassRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateAgeRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import com.google.common.base.MoreObjects;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.Constants.*;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;

@Service
@Transactional
public class SharedRfpService {

    private static final String CENSUS_SAMPLE_FILE_PATH = "/files/member_level_census_sample.xlsx";
    
    @Autowired
    private CustomLogger logger;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private SharedFileService sharedFileService;
    
    @Autowired
    private SharedPlanService sharedPlanService;
    
    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    protected Auth0Service auth0Service;

    @Autowired
    protected RfpSubmissionRepository submissionRepository;
    
    @Autowired
    protected AttributeRepository attributeRepository;

    @Autowired
    protected ClientPlanRepository clientPlanRepository;

    @Autowired
    protected RfpToPnnRepository rfpToPnnRepository;
      
    @Autowired
    private RfpToAncillaryPlanRepository rfp2apRepository;
    
    @Autowired
    private AncillaryPlanRepository ancPlanRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private BenefitRepository benefitRepository;
    
    @Value("${app.carrier}")
    private String[] appCarrier;

    public RfpDto create(RfpDto rfpDto) {
        RFP rfp = RfpMapper.rfpDtoToRFP(rfpDto);

        SimpleDateFormat dateFormatter = new SimpleDateFormat(Constants.DATETIME_FORMAT);
        rfp.setLastUpdated(DateHelper.fromStringToDate(dateFormatter.format(new Date()), Constants.DATETIME_FORMAT));

        final RFP finalRfp = rfpRepository.save(rfp);
        
        rfpDto.getAttributes().forEach((attribute, value) ->
            finalRfp.getAttributes().add(attributeRepository.save(new RFPAttribute(finalRfp, attribute, value))));
        
        return RfpMapper.rfpToDTO(finalRfp);
    }

    public List<Long> getRfpIdsByClientId(Long clientId){
        List<RFP> rfps = getRfpsByClientId(clientId);
        return rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
    }
    
    public List<RFP> getRfpsByClientId(Long clientId){
        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        if(rfps == null) {
            throw new NotFoundException("RFPs not found")
                .withFields(
                    field("client_id", clientId)
                );
        }
        rfps = rfps.stream().filter(rfp -> rfp.getProduct().equalsIgnoreCase(Constants.MEDICAL)
            || rfp.getProduct().equalsIgnoreCase(Constants.DENTAL)
            || rfp.getProduct().equalsIgnoreCase(Constants.VISION))
            .collect(Collectors.toList());

        return rfps;
    }

    public RfpSubmission getRfpSubmission(RfpCarrier rc, Client client, Date submissionDate, String disqualificationReason){
        RfpSubmission rs = submissionRepository.findByRfpCarrierAndClient(rc, client);

        if(rs == null) {
            rs = new RfpSubmission();
            rs.setCreated(DateHelper.fromDateToString(submissionDate, DATETIME_FORMAT));
        }

        rs.setClient(client);
        rs.setRfpCarrier(rc);
        rs.setDisqualificationReason(disqualificationReason);
        setSubmissionOriginDetails(rs);
        submissionRepository.save(rs);

        return rs;
    }

    public RfpCarrier getRfpCarrier(String carrierName, String product){
        RfpCarrier rc = rfpCarrierRepository.findByCarrierNameAndCategory(carrierName, product);

        if(rc == null) {
            throw new NotFoundException("No RFP Carrier found")
                .withFields(
                    field("category", product),
                    field("carrier", carrierName)
                );
        }

        return rc;
    }

    public List<RfpDto> getByClientId(Long id) {
        final List<RFP> rfps = rfpRepository.findByClientClientId(id);

        if(rfps == null) {
            throw new NotFoundException("RFPs not found")
                .withFields(
                    field("client_id", id)
                );
        }

        return getRfpDtos(id, rfps);
    }

    public List<RfpDto> getRfpDtos(Long clientId, List<RFP> rfps) {
        Client client = clientRepository.findOne(clientId);
        List<RfpDto> rfpDtos = fillInSubmissionInfoAndFileInfo(client, rfps);
        calcRfpAttributes(rfpDtos);

        return rfpDtos;
    }

    protected void calcRfpAttributes(List<RfpDto> newDtolist) {
        // do nothing
    }

    public void delete(Long id) {
        rfpRepository.delete(id);
    }

    private List<RfpDto> fillInSubmissionInfoAndFileInfo(Client client, List<RFP> rfps) {
        List<RfpDto> dtoList = RfpMapper.rfpsToRfpDTOs(rfps);

        for(RfpDto dto : dtoList) {
            List<FileDto> fileDtos = sharedFileService.getFilesByRfpId(dto.getId());

            List<FileInfoDto> fileInfoDtos = new ArrayList<>();

            for(FileDto fileDto : fileDtos) {
                FileInfoDto infoDto = new FileInfoDto();
                infoDto.setName(sharedFileService.getFileName(fileDto.getS3Key()));
                infoDto.setLink(sharedFileService.getFileLink(fileDto.getClientFileUploadId()));
                infoDto.setType(fileDto.getType());
                infoDto.setSection(fileDto.getSection());
                infoDto.setCreated(fileDto.getCreated());
                infoDto.setSize(fileDto.getSize());
                fileInfoDtos.add(infoDto);
            }

            if(!fileInfoDtos.isEmpty()) {
                dto.setFileInfoList(fileInfoDtos);
            }

            fillInRfpSubmissionInfo(client, dto);
        }

        return dtoList;
    }

    public void fillInRfpSubmissionInfo(Client client, RfpDto rfpDto){
        List<RfpCarrier> rcs = rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(rfpDto.getProduct());

        for(RfpCarrier rc : rcs) {
            if (rc == null) {
                throw new NotFoundException("No RFP Carrier found")
                    .withFields(
                        field("category", rfpDto.getProduct()),
                        field("carrier", rc.getCarrier().getName())
                    );
            }

            RfpSubmission rs = rfpSubmissionRepository.findByRfpCarrierAndClient(rc, client);
            if (rs != null) {
                RfpSubmissionStatusDto status = buildRfpSubmissionStatusDto(rs);
                rfpDto.getSubmissionStatuses().add(status);
                    /* FIXME rfpSubmittedSuccessfully = true or only if rs.getSubmittedDate() != null ?
                    new RfpSubmissionStatusDto(true,
                        rs.getSubmittedDate(),
                        rs.getRfpCarrier().getCarrier().getCarrierId(),
                        rs.getRfpCarrier().getCarrier().getName(),
                        rs.getRfpCarrier().getCategory()));*/
            }
        }
    }
    
    protected RfpSubmissionStatusDto buildRfpSubmissionStatusDto(RfpSubmission submission) {  
        RfpSubmissionStatusDto statusDto = new RfpSubmissionStatusDto();
        statusDto.setRfpSubmittedSuccessfully(false);
        Carrier carrier = submission.getRfpCarrier().getCarrier();
        statusDto.setType(carrier.getName().equals(CarrierType.ANTHEM_CLEAR_VALUE.name()) ? "CLEAR_VALUE" : "STANDARD");
        statusDto.setProduct(submission.getRfpCarrier().getCategory());
        statusDto.setCarrierName(carrier.getName());
        statusDto.setCarrierId(carrier.getCarrierId());
        if (submission.getSubmittedDate() != null) {
            // user has submitted
            statusDto.setSubmissionDate(submission.getSubmittedDate());
            statusDto.setDisqualificationReason(submission.getDisqualificationReason());
            statusDto.setRfpSubmittedSuccessfully(true);
        }
        return statusDto;
    }

    public CensusInfoDto getCensusInfoByClientCalculations(Long clientId){
        Client client = clientRepository.findOne(clientId);

        if(client == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        CensusInfoDto infoDto = new CensusInfoDto();
        setCensusType(client, infoDto);

        infoDto.setEmail(client.getPresalesEmail());
        infoDto.setSubject(format(Constants.CENSUS_SUBMISSION_SUBJECT, client.getClientName(), client.getBroker().getName(), fromDateToString(client.getEffectiveDate())));

        if (infoDto.getType() == ClientFileType.MEMBER) {
            infoDto.setSampleUrl(RequestUtils.getServiceBaseURL() + CENSUS_SAMPLE_FILE_PATH);
        }

        return infoDto;
    }

    protected void setCensusType(Client client, CensusInfoDto infoDto){
        calculateClientFileTypeAndMemberLevel(client, infoDto);
    }

    private void calculateClientFileTypeAndMemberLevel(Client client, CensusInfoDto infoDto) {
        int totalPoints = 0;

        if(client != null) {
            ClientFileType calculatedType = null;
            if(BrokerLocale.NORTH == client.getBroker().getLocale()) {
                calculatedType = ClientFileType.MEMBER;
            }
            RFP medicalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL);
            if(medicalRfp == null) {
                if(calculatedType == null) {
                    List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());
                    if(rfps != null && rfps.stream().anyMatch(r -> equalsAnyIgnoreCase(r.getProduct(), DENTAL, VISION))) {
                        calculatedType = ClientFileType.SUBSCRIBER;
                    } else {
                        throw new ClientException("This client does not have any RFPs")
                            .withFields(field("client_id", client.getClientId()));
                    }
                }
            } else {
                totalPoints += calculatePointsByEmployerContribution(medicalRfp);
                totalPoints += calculatePointsByCarrierHistory(medicalRfp);
            }
            totalPoints += calculatePointsByParticipationPercentage(client);
            totalPoints += calculatePointsByCobraEmployees(client);

            infoDto.setCensusLevel(totalPoints);

            if (calculatedType == null) {
                //infoDto.setType(totalPoints < 10 ? ClientFileType.MEMBER : ClientFileType.SUBSCRIBER);
                // special for UHC
                infoDto.setType(ClientFileType.MEMBER);
            } else {
                infoDto.setType(calculatedType);
            }
        } else {
            throw new BadRequestException("No client provided");
        }
    }

    private int calculatePointsByParticipationPercentage(Client client) {
        Double participationPercentage = (double) client.getParticipatingEmployees() / client.getEmployeeCount() * 100;

        if(participationPercentage == 100) {
            return 4;
        }

        Double basePoints = -5d;
        Double result = Math.floor(participationPercentage / 10) + basePoints;

        return result.intValue();
    }

    private int calculatePointsByEmployerContribution(RFP rfp) {
        Option maxCensusOption = rfp.getOptions().stream()
            .max(
                (o1, o2) -> {

                    Double result = new Double(0);
                    if (o1.getCensusTier1() != null) {
                        result = result + o1.getCensusTier1();
                    }
                    if (o1.getCensusTier2() != null) {
                        result = result + o1.getCensusTier2();
                    }
                    if (o1.getCensusTier3() != null) {
                        result = result + o1.getCensusTier3();
                    }
                    if (o1.getCensusTier4() != null) {
                        result = result + o1.getCensusTier4();
                    }
                    if (o2.getCensusTier1() != null) {
                        result = result - o2.getCensusTier1();
                    }
                    if (o2.getCensusTier2() != null) {
                        result = result - o2.getCensusTier2();
                    }
                    if (o2.getCensusTier3() != null) {
                        result = result - o2.getCensusTier3();
                    }
                    if (o2.getCensusTier4() != null) {
                        result = result - o2.getCensusTier4();
                    }

                    return result.intValue();
                }
            )
            .orElse(null);

        if (maxCensusOption == null) {
            logger.warn("Max Census is null, revisit calculation for employer contribution points!");
        }

        int resultPoints = 0;

        Double contributionRateTier1 = 0d;
        Double contributionRateTier2 = 0d;

        if (maxCensusOption != null && maxCensusOption.getContributionTier1() != null && maxCensusOption.getRateTier1() != null) {
            contributionRateTier1 = "%".equals(rfp.getContributionType()) ? maxCensusOption.getContributionTier1() : maxCensusOption.getContributionTier1() / maxCensusOption.getRateTier1() * 100;
        }
        if (maxCensusOption != null && maxCensusOption.getContributionTier2() != null && maxCensusOption.getRateTier2() != null) {
            contributionRateTier2 = "%".equals(rfp.getContributionType()) ? maxCensusOption.getContributionTier2() : maxCensusOption.getContributionTier2() / maxCensusOption.getRateTier2() * 100;
        }

        resultPoints += contributionRateTier1 < 20 ? -2 : 0;
        resultPoints += contributionRateTier1 >= 20 && contributionRateTier1 < 40 ? -1 : 0;
        resultPoints += contributionRateTier1 >= 40 && contributionRateTier1 < 60 ? 1 : 0;
        resultPoints += contributionRateTier1 >= 60 && contributionRateTier1 < 80 ? 2 : 0;
        resultPoints += contributionRateTier1 >= 80 && contributionRateTier1 < 100 ? 4 : 0;
        resultPoints += contributionRateTier1 >= 100 ? 5 : 0;

        resultPoints += contributionRateTier2 >= 10 && contributionRateTier2 < 20 ? 1 : 0;
        resultPoints += contributionRateTier2 >= 20 && contributionRateTier2 < 30 ? 2 : 0;
        resultPoints += contributionRateTier2 >= 30 && contributionRateTier2 < 50 ? 3 : 0;
        resultPoints += contributionRateTier2 >= 50 && contributionRateTier2 < 70 ? 4 : 0;
        resultPoints += contributionRateTier2 >= 70 && contributionRateTier2 < 90 ? 5 : 0;
        resultPoints += contributionRateTier2 >= 90 ? 6 : 0;

        return resultPoints;
    }

    private int calculatePointsByCarrierHistory(RFP rfp) {
        int totalPoints = 0;

        CarrierHistory currentCarrierHistory = null;
        if(rfp.getCarrierHistories() != null) {
            for(CarrierHistory carrierHistory : rfp.getCarrierHistories()) {
                if(carrierHistory.isCurrent()) {
                    currentCarrierHistory = carrierHistory;
                    break;
                }
            }
        }

        if(currentCarrierHistory == null) {
            return 0;
        }

        totalPoints = currentCarrierHistory.getYears() >= 3 ? 3 : totalPoints;
        totalPoints = currentCarrierHistory.getYears() == 2 ? 1 : totalPoints;

        return totalPoints;
    }

    private int calculatePointsByCobraEmployees(Client client) {
        double cobraEmployeesPercent = (double) client.getCobraCount() / client.getEmployeeCount() * 100;

        return cobraEmployeesPercent < 10 ? 2 : 0;
    }


    public void setSubmissionOriginDetails(RfpSubmission rs) {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext()
            .getAuthentication();

        String email = auth0Service.getUserEmail(authentication.getName());
        if(email != null) {
            rs.setSubmittedBy(email);
            rs.setSubmittedDate(new Date());
        }

    }

    public void createClientPlans(Client client, List<Long> rfpIds) {
        for(Long rfpId: rfpIds) {
            RFP rfp = rfpRepository.findByClientClientIdAndRfpId(client.getClientId(), rfpId);

            if (rfp.getOptions() != null) {
                rfp.getOptions().forEach(option -> {
                    RfpToPnn rfpToPnn = rfpToPnnRepository
                        .findByRfpRfpIdAndOptionIdAndPlanType(rfp.getRfpId(), option.getId(),
                            option.getPlanType());

                    RfpToPnn rxRfpToPnn = rfpToPnnRepository
                        .findByRfpRfpIdAndOptionIdAndPlanType(rfp.getRfpId(), option.getId(),
                            "RX_" + option.getPlanType());

                    PlanNameByNetwork pnn = rfpToPnn != null ? rfpToPnn.getPnn() : null;
                    PlanNameByNetwork rx_pnn = rxRfpToPnn != null ? rxRfpToPnn.getPnn() : null;

                    if (option.getRateType() != null && option.getRateType()
                        .equals(RateType.BANDED)) {
                        option = convertFromSmallGroupToLargeGroup(option, rfp.getRatingTiers());
                    }

                    ClientPlan cp = createClientPlan(client, option, false, pnn, rx_pnn,
                        option.getCensusTier1(),
                        option.getCensusTier2(), option.getCensusTier3(), option.getCensusTier4(),
                        option.getRateTier1(), option.getRateTier2(), option.getRateTier3(),
                        option.getRateTier4(), option.getRenewalTier1(),
                        option.getRenewalTier2(), option.getRenewalTier3(),
                        option.getRenewalTier4(),
                        rfp.getContributionType(), option.getContributionTier1(),
                        option.getContributionTier2(), option.getContributionTier3(),
                        option.getContributionTier4(), option.getPlanType());

                    if (rfpToPnn == null) {
                        logger
                            .warnLog("No rfp_to_pnn was found for rfp_option_id=" + option.getId());
                    } else {
                        clientPlanRepository.save(cp);
                    }

                    if (option.isOutOfStateContribution() && option.isOutOfStateRate() && option
                        .isOutOfStateCensus()) {

                        ClientPlan cp2 = createClientPlan(client, option, true, pnn, rx_pnn,
                            option.getOosCensusTier1(), option.getOosCensusTier2(),
                            option.getOosCensusTier3(), option.getOosCensusTier4(),
                            option.getOosRateTier1(), option.getOosRateTier2(),
                            option.getOosRateTier3(),
                            option.getOosRateTier4(), option.getOosRenewalTier1(),
                            option.getOosRenewalTier2(), option.getOosRenewalTier3(),
                            option.getOosRenewalTier4(), rfp.getContributionType(),
                            option.getOosContributionTier1(),
                            option.getOosContributionTier2(), option.getOosContributionTier3(),
                            option.getOosContributionTier4(), option.getPlanType());

                        if (rfpToPnn == null) {
                            logger.warnLog(
                                "No rfp_to_pnn was found for rfp_option_id=" + option.getId());
                        } else {
                            clientPlanRepository.save(cp2);
                        }
                    }
                });
            }
            List<RfpToAncillaryPlan> list = rfp2apRepository.findByRfp_RfpId(rfpId);
            if (CollectionUtils.isNotEmpty(list)) {
                List<AncillaryPlan> plans = list.stream().map(RfpToAncillaryPlan::getAncillaryPlan).collect(toList());
                createAncillaryClientPlans(client, rfp.getProduct(), plans);
            }
        }
    }
    
    public List<ClientPlan> createAncillaryClientPlans(Client client, String product, List<AncillaryPlan> plans) {
    	List<ClientPlan> result = new ArrayList<>();
    	plans.forEach(plan -> {
			ClientPlan cp = createAncillaryClientPlan(client, product, plan);
			cp = clientPlanRepository.save(cp);
			result.add(cp);
		});
    	return result;
	}

    public Option convertFromSmallGroupToLargeGroup(Option option, Integer ratingTiers) {
        if(ratingTiers == null) {
            ratingTiers = 4; // default value
        }
        if(option.getMonthlyBandedPremium() != null) {
            double costPerEmployee = PlanCalcHelper.calcEmployeeCost(option.getMonthlyBandedPremium(),
                option.getCensusTier1(), option.getCensusTier2(), option.getCensusTier3(),
                option.getCensusTier4());

            option.setRateTier1(costPerEmployee);
            if(ratingTiers > 1) {
                option.setRateTier2(costPerEmployee);
            }
            if(ratingTiers > 2) {
                option.setRateTier3(costPerEmployee);
            }
            if(ratingTiers > 3) {
                option.setRateTier4(costPerEmployee);
            }
            option.setOutOfStateRate(false);
        }

        if(option.getOufOfStateMonthlyBandedPremium() != null) {
            double oosCostPerEmployee = PlanCalcHelper.calcEmployeeCost(
                option.getOufOfStateMonthlyBandedPremium(),
                option.getOosCensusTier1(), option.getOosCensusTier2(), option.getOosCensusTier3(),
                option.getOosCensusTier4());

            option.setOosRateTier1(oosCostPerEmployee);
            if(ratingTiers > 1) {
                option.setOosRateTier2(oosCostPerEmployee);
            }
            if(ratingTiers > 2) {
                option.setOosRateTier3(oosCostPerEmployee);
            }
            if(ratingTiers > 3) {
                option.setOosRateTier4(oosCostPerEmployee);
            }
            option.setOutOfStateRate(true);
        }

        if(option.getMonthlyBandedPremiumRenewal() != null) {
            double costPerEmployee = PlanCalcHelper.calcEmployeeCost(option.getMonthlyBandedPremiumRenewal(),
                option.getCensusTier1(), option.getCensusTier2(), option.getCensusTier3(),
                option.getCensusTier4());

            option.setRenewalTier1(costPerEmployee);
            if(ratingTiers > 1) {
                option.setRenewalTier2(costPerEmployee);
            }
            if(ratingTiers > 2) {
                option.setRenewalTier3(costPerEmployee);
            }
            if(ratingTiers > 3) {
                option.setRenewalTier4(costPerEmployee);
            }
            option.setOutOfStateRenewal(false);
        }

        if(option.getOufOfStateMonthlyBandedPremiumRenewal() != null) {
            double oosCostPerEmployee = PlanCalcHelper.calcEmployeeCost(
                option.getOufOfStateMonthlyBandedPremiumRenewal(),
                option.getOosCensusTier1(), option.getOosCensusTier2(), option.getOosCensusTier3(),
                option.getOosCensusTier4());

            option.setOosRenewalTier1(oosCostPerEmployee);
            if(ratingTiers > 1) {
                option.setOosRenewalTier2(oosCostPerEmployee);
            }
            if(ratingTiers > 2) {
                option.setOosRenewalTier3(oosCostPerEmployee);
            }
            if(ratingTiers > 3) {
                option.setOosRenewalTier4(oosCostPerEmployee);
            }
            option.setOutOfStateRenewal(true);
        }

        return option;
    }

    public ClientPlan createClientPlan(Client client, Option option, boolean outOfState,
        PlanNameByNetwork pnn,
        PlanNameByNetwork rxPnn, Double censusTier1, Double censusTier2, Double censusTier3,
        Double censusTier4,
        Double rateTier1, Double rateTier2, Double rateTier3, Double rateTier4, Double renewalTier1,
        Double renewalTier2, Double renewalTier3, Double renewalTier4, String contributionType,
        Double contributionTier1, Double contributionTier2, Double contributionTier3,
        Double contributionTier4,
        String planType){

        ClientPlan clientPlan = new ClientPlan(client, option, outOfState, pnn,
            longValue(censusTier1), longValue(censusTier2), longValue(censusTier3),
            longValue(censusTier4),
            floatValue(rateTier1), floatValue(rateTier2), floatValue(rateTier3),
            floatValue(rateTier4),
            floatValue(renewalTier1), floatValue(renewalTier2), floatValue(renewalTier3),
            floatValue(renewalTier4),
            "%".equals(contributionType) ? Constants.ER_CONTRIBUTION_FORMAT_PERCENT
                : Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, // if voluntary, we use dollar as default
            floatValue(contributionTier1), floatValue(contributionTier2),
            floatValue(contributionTier3), floatValue(contributionTier4));

        clientPlan.setPlanType(planType);
        clientPlan.setRxPnn(rxPnn);
        return  clientPlan;
    }
    
	protected ClientPlan createAncillaryClientPlan(Client client, String product, AncillaryPlan plan) {

		ClientPlan cp = new ClientPlan();
		cp.setClient(client);
		String planType = product; // 1:1 product:planType
		if (!PlanCategory.isAncillary(product)) {
			throw new BaseException("Unable to create client plan with type: " + planType);
		}
		cp.setPlanType(planType);
		// FIXME possible errors in old code that expects correct
		// client_plan
		// This client_plan has only 2 filled fields
		
		Carrier carrier = plan.getCarrier();
		
		List<Network> networks = networkRepository.findByTypeAndCarrier(planType, carrier);
		if (networks.isEmpty() || networks.size() != 1) {
			throw new BaseException(String.format("Unique network with type %s and carrier %s not found", planType,
					carrier.getDisplayName()));
		}
		final int currentYear = Year.now().getValue();
		Integer planYear = MoreObjects.firstNonNull(plan.getPlanYear(), currentYear);
		List<PlanNameByNetwork> pnns = planNameByNetworkRepository.findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
				networks.get(0), plan.getPlanName(), planType, planYear, client.getClientId(), false);
		if (pnns.isEmpty()) {
			PlanNameByNetwork pnn = sharedPlanService.createAndSavePlanNameByNetwork(
					carrier, networks.get(0), plan.getPlanName(), planType, planYear, client.getClientId(), 
					false, Collections.emptyList());
			pnns.add(pnn);
		} else if (pnns.size() != 1) {
			throw new BaseException(String.format("Unique pnn with type %s and network %s and year %s not found",
					planType, networks.get(0).getName(), planYear));
		} else {
			ClientPlan existingPlans = clientPlanRepository.findByClientAndPnnPlanTypeAndAncillaryPlan(client, product, plan);
			if (existingPlans != null) {
				throw new BaseException("Client plan with same Ancillary plan already exists: " + plan.getPlanName());
			}
		}
		
		cp.setPnn(pnns.get(0));
		cp.setAncillaryPlan(plan);
		return cp;
	}


    public void copyRfp(Client client, RFP rfpToCopy){
        RFP copyRfp = rfpToCopy.copy();
        copyRfp.setClient(client);
        copyRfp = rfpRepository.save(copyRfp);

        for(RfpToPnn rfpToPnn : rfpToPnnRepository.findByRfpRfpId(rfpToCopy.getRfpId())){
            RfpToPnn copyRfpToPnn = rfpToPnn.copy();
            PlanNameByNetwork copyPnn = rfpToPnn.getPnn().copy();

            copyRfpToPnn.setRfp(copyRfp);
            copyRfpToPnn.setOptionId(getOptionId(copyRfp, copyRfpToPnn.getOptionId()));
            copyPnn = saveRfpPnn(copyPnn);
            copyRfpToPnn.setPnn(copyPnn);
            rfpToPnnRepository.save(copyRfpToPnn);
        }

        for(RfpToAncillaryPlan rfpToAncillaryPlan : rfp2apRepository.findByRfp_RfpId(rfpToCopy.getRfpId())){
            RfpToAncillaryPlan copyRfpToAncillaryPlan = rfpToAncillaryPlan.copy();
            AncillaryPlan copyAncillaryPlan = rfpToAncillaryPlan.getAncillaryPlan().copy();
            copyRfpToAncillaryPlan.setRfp(copyRfp);
            copyRfpToAncillaryPlan.setAncillaryPlan(copyAncillaryPlan);
            ancPlanRepository.save(copyAncillaryPlan);
            rfp2apRepository.save(copyRfpToAncillaryPlan);
        }
    }

    private PlanNameByNetwork saveRfpPnn(PlanNameByNetwork pnn){
        Plan plan = planRepository.save(pnn.getPlan());
        for (Benefit ben : plan.getBenefits()) {
            ben.setPlan(plan);
            benefitRepository.save(ben);
        }
        pnn.setPlan(plan);
        return planNameByNetworkRepository.save(pnn);
    }

    private Long getOptionId(RFP newRFP, Long originalOptionId){
        Option option = optionRepository.findOne(originalOptionId);
        if(option != null){
            return newRFP.getOptions().stream()
                .filter(opt -> opt.getLabel().equals(option.getLabel()) && opt.getPlanType().equals(option.getPlanType()))
                .map(o -> o.getId())
                .findFirst()
                .orElse(null);
        }
        return null;
    }

    protected static Long longValue(Double value) {
        return value == null ? 0L : value.longValue();
    }

    protected static Float floatValue(Double value) {
        return value == null ? 0F : value.floatValue();
    }

    protected static Double doubleValue(Double value) {
        return value == null ? 0.0D : value;
    }
}

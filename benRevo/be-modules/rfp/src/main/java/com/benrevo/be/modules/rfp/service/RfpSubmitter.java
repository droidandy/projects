package com.benrevo.be.modules.rfp.service;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;

/**
 * Created by lemdy on 7/24/17.
 */
@Service
@Transactional
public class RfpSubmitter {

    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    protected RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    protected CarrierRepository carrierRepository;
    
    @Autowired
    protected RfpCarrierService rfpCarrierService;
    
    @Autowired
    protected ProgramRepository programRepository;

    @Autowired
    protected RfpSubmissionRepository submissionRepository;

    @Autowired
    protected CustomLogger LOGGER;

    @Autowired
    protected Auth0Service auth0Service;

    @Autowired
    private SharedRfpService sharedRfpService;

    public RfpSubmissionStatusDto createRfpSubmission(Client client, Program program) {  
        RfpSubmission rs = submissionRepository.findByProgramAndClient(program, client);
        RfpCarrier rc = program.getRfpCarrier();
        Date submissionDate = new Date();
        if(rs == null) {
            rs = new RfpSubmission();
            rs.setClient(client);
            rs.setProgram(program);
            rs.setRfpCarrier(rc);
            rs.setCreated(fromDateToString(submissionDate, DATETIME_FORMAT));
            rs.setDisqualificationReason(null);
            sharedRfpService.setSubmissionOriginDetails(rs);

            submissionRepository.save(rs);
        }
        RfpSubmissionStatusDto submissionStatusDto = new RfpSubmissionStatusDto();
        submissionStatusDto.setSubmissionDate(submissionDate);
        submissionStatusDto.setRfpSubmittedSuccessfully(true);
        submissionStatusDto.setProduct(rc.getCategory());
        submissionStatusDto.setCarrierName(rc.getCarrier().getName());
        submissionStatusDto.setCarrierId(rc.getCarrier().getCarrierId());
        submissionStatusDto.setProgramId(program.getProgramId());
        submissionStatusDto.setType("STANDARD");

        return submissionStatusDto;
    }
    
    public List<RfpSubmissionStatusDto> createRfpSubmissions(Client client, Long carrierId, List<Long> rfpIds){  
        List<RfpSubmissionStatusDto> subStatuses = new ArrayList<>();

        Date submissionDate = new Date();
        for(Long rfpId: rfpIds) {
            RFP rfp = rfpRepository.findByClientClientIdAndRfpId(client.getClientId(), rfpId);
            RfpCarrier rc = rfpCarrierRepository.findByCarrierCarrierIdAndCategory(carrierId, rfp.getProduct());
            if(rc == null) {
                throw new BaseException("No RFP Carrier found")
                    .withFields(field("category", rfp.getProduct()), field("carrier_id", carrierId));
            }
            RfpSubmission rs = submissionRepository.findByRfpCarrierAndClient(rc, client);
                      
            if(rs == null) {
                rs = new RfpSubmission();
                rs.setClient(client);
                rs.setRfpCarrier(rc);
                rs.setCreated(fromDateToString(submissionDate, DATETIME_FORMAT));
                rs.setDisqualificationReason(null);
                sharedRfpService.setSubmissionOriginDetails(rs);

                submissionRepository.save(rs);
            }
            RfpSubmissionStatusDto submissionStatusDto = new RfpSubmissionStatusDto();
            submissionStatusDto.setSubmissionDate(submissionDate);
            submissionStatusDto.setRfpSubmittedSuccessfully(true);
            submissionStatusDto.setProduct(rfp.getProduct());
            submissionStatusDto.setCarrierName(rc.getCarrier().getName());
            submissionStatusDto.setCarrierId(rc.getCarrier().getCarrierId());
            Carrier carrier = rc.getCarrier();
            submissionStatusDto.setType(carrier.getName().equals(CarrierType.ANTHEM_CLEAR_VALUE.name()) ? "CLEAR_VALUE" : "STANDARD");
            subStatuses.add(submissionStatusDto);
        }
        return subStatuses;
    }
}

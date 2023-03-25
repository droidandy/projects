package com.benrevo.be.modules.shared.service;

import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.FeedbackDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SharedVelocityService extends BaseEmailService{

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private VelocityEngine velocityEngine;
    
    @Value("${app.carrier}")
    String[] appCarrier;

    public String getFeedbackTemplate(String templatePath, FeedbackDto feedbackDto) {
        VelocityContext velocityContext = fillContextFeedbackEmail(feedbackDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextFeedbackEmail(FeedbackDto feedbackDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("feedback", feedbackDto.getText());
        velocityContext.put("page", feedbackDto.getPage());
        velocityContext.put("feedbackType", feedbackDto.getFeedbackType());
        velocityContext.put("details", feedbackDto.getMetadata());

        return velocityContext;
    }

    public List<ClientMemberDto> escapeClientMemberDto(List<ClientMemberDto> dtos){
        if(dtos != null) {
            dtos.forEach(dto -> {
                dto.setEmail(escapeXml(dto.getEmail()));
                dto.setAuthId(escapeXml(dto.getAuthId()));
                dto.setFirstName(escapeXml(dto.getFirstName()));
                dto.setFullName(escapeXml(dto.getFullName()));
            });
        }
        return dtos;
    }

    public AncillaryPlanDto escapeAncillaryDto(AncillaryPlanDto ancillaryPlanDto){
        ancillaryPlanDto.setPlanName(escapeXml(ancillaryPlanDto.getPlanName()));
        ancillaryPlanDto.setCarrierDisplayName(escapeXml(ancillaryPlanDto.getCarrierDisplayName()));
        ancillaryPlanDto.setCarrierName(escapeXml(ancillaryPlanDto.getCarrierName()));
        ancillaryPlanDto.getClasses().forEach(dto -> {
            dto.setName(escapeXml(dto.getName()));
        });
        return ancillaryPlanDto;
    }


    public String getBenrevoBrokerageCreatedNotificationTemplate(String templatePath, BrokerDto brokerDto) {
        VelocityContext velocityContext = fillNewBrokerageEmailContext(brokerDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillNewBrokerageEmailContext(BrokerDto brokerDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("brokerage_name", escapeXml(brokerDto.getName()));
        velocityContext.put("brokerage_address", escapeXml(brokerDto.getBrokerageAddress()));
        velocityContext.put("brokerage_sae", escapeXml(brokerDto.getSalesEmail()));
        velocityContext.put("brokerage_sar", escapeXml(brokerDto.getPresalesEmail()));
        velocityContext.put("created_by", escapeXml(getLoggedInUserName()));

        return velocityContext;
    }

    public String get2xBrokerageLogo(String brokerLogo){
        if(isEmpty(brokerLogo)){
            return "";
        }

        int dotIndex = brokerLogo.lastIndexOf(".");
        return brokerLogo.substring(0, dotIndex) + "_2x" + brokerLogo.substring(dotIndex);
    }

}

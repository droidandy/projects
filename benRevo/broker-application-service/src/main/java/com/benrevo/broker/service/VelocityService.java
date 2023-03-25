package com.benrevo.broker.service;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.VISION;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;

import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.be.modules.shared.service.SharedVelocityService;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ContactUsDto;
import com.benrevo.common.dto.RequestDemoDto;
import com.benrevo.common.dto.SignupDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.google.common.collect.Multimap;
import com.google.common.collect.TreeMultimap;
import java.io.IOException;
import java.io.StringWriter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VelocityService extends SharedVelocityService {


    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @Autowired
    private BrokerRepository brokerRepository;
    
    @Value("${app.carrier}")
    String[] appCarrier;


    public String getBrokerRfpSubmissionTemplate(String templatePath, ClientDto clientDto,
        String authenticatedUserFirstName, Map<Carrier, List<RFP>> rfpsByCarrier, String brokerageLogo) {

        VelocityContext velocityContext = fillContextBrokerRfpSubmissionEmail(clientDto, rfpsByCarrier, 
            authenticatedUserFirstName, brokerageLogo);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextBrokerRfpSubmissionEmail(ClientDto clientDto,
        Map<Carrier, List<RFP>> rfpsByCarrier, String authenticatedUserFirstName, String brokerageLogo){

        // group all carriers by product, distinct: product -> [car1, car2, ...]
        Multimap<String, String> carriersByProduct = TreeMultimap.create();
        rfpsByCarrier.forEach((car, rfps) -> {
            for(RFP rfp : rfps) {
                carriersByProduct.put(rfp.getProduct(), car.getDisplayName()); 
            }
        });
        // set product order: medical, dental, vision, ...
        Map<String, String> orderedCarriersByProduct = new LinkedHashMap<>();
        for(String product : new String[] {MEDICAL, DENTAL, VISION, LIFE, STD, LTD}) {
            if(carriersByProduct.containsKey(product)) {
                orderedCarriersByProduct.put(product, escapeXml(String.join(", ", carriersByProduct.get(product))));
            }  
        }

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", escapeXml(clientDto.getClientName()));
        velocityContext.put("user_first_name", escapeXml(authenticatedUserFirstName));
        velocityContext.put("effective_date", clientDto.getEffectiveDate());
        velocityContext.put("proposal_date", clientDto.getDueDate());
        velocityContext.put("eligible_employees", clientDto.getEligibleEmployees());
        velocityContext.put("carriers_by_product", orderedCarriersByProduct);
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(brokerageLogo));
        velocityContext.put("StringUtils", StringUtils.class);
        return velocityContext;
    }


    public String getCarrierRfpSubmissionTemplate(String templatePath, ClientDto clientDto,
        Broker broker, String products) {

        VelocityContext velocityContext = fillContextCarrierRfpSubmissionEmail(broker, clientDto, products);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextCarrierRfpSubmissionEmail(Broker authenticatedBroker, ClientDto clientDto,
        String products){

        Broker nonGABroker = brokerRepository.findOne(clientDto.getBrokerId());
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", escapeXml(clientDto.getClientName()));
        velocityContext.put("effective_date", clientDto.getEffectiveDate());
        velocityContext.put("proposal_date", clientDto.getDueDate());
        velocityContext.put("eligible_employees", clientDto.getEligibleEmployees());
        velocityContext.put("products", escapeXml(products));
        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(nonGABroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(authenticatedBroker.getLogo()));
        velocityContext.put("StringUtils", StringUtils.class);
        velocityContext.put("broker_contacts",
            escapeClientMemberDto(
                sharedClientMemberService.getByClientId(clientDto.getId())
            )
        );
        return velocityContext;
    }

    public String getSignUpTemplate(String templatePath, SignupDto signupDto) {
        VelocityContext velocityContext = fillContextSignUpEmail(signupDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getRequestDemoTemplate(String templatePath, RequestDemoDto dto) {
        VelocityContext velocityContext = fillContextRequestDemoEmail(dto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    public String getAccountRequestTemplate(String templatePath, AccountRequestDto dto) {
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("brokerName", dto.getBrokerName());
        velocityContext.put("gaName", dto.getGaName());
        velocityContext.put("agentName", dto.getAgentName());
        velocityContext.put("agentEmail", dto.getAgentEmail());
        velocityContext.put("created", dto.getCreated());

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getContactUsTemplate(String templatePath, ContactUsDto contactUsDto) {
        VelocityContext velocityContext = fillContextContactUsEmail(contactUsDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextSignUpEmail(SignupDto signupDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("firstName", signupDto.getFirstName());
        velocityContext.put("lastName", signupDto.getLastName());
        velocityContext.put("brokerageFirmName", signupDto.getBrokerageFirmName());
        velocityContext.put("brokerageZipCode", signupDto.getBrokerageFirmZipCode());
        velocityContext.put("email", signupDto.getEmail());

        return velocityContext;
    }

    private VelocityContext fillContextRequestDemoEmail(RequestDemoDto dto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("name", dto.getName());
        velocityContext.put("company", dto.getCompanyName());
        velocityContext.put("email", dto.getEmail());
        velocityContext.put("phone", dto.getPhoneNumber());

        return velocityContext;
    }

    private VelocityContext fillContextContactUsEmail(ContactUsDto contactUsDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("name", contactUsDto.getName());
        velocityContext.put("company", contactUsDto.getCompanyName());
        velocityContext.put("message", contactUsDto.getMessage());
        velocityContext.put("email", contactUsDto.getEmail());
        velocityContext.put("phone", contactUsDto.getPhoneNumber());

        return velocityContext;
    }

    public String getVerificationEmailTemplate(String templatePath, String agentName, String verificationCode) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("verification_code", verificationCode);
        velocityContext.put("agent_name", agentName);
        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

}

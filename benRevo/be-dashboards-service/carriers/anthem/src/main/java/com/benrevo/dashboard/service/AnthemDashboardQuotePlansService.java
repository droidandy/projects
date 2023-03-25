package com.benrevo.dashboard.service;

import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.CV_PRODUCT_DISCOUNT_PERCENT;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.VISION_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientAllQuoteDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardQuotePlansService {

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private AnthemDashboardEmailService emailService;

    @Autowired
    private AnthemDashboardRateBankService rateBankService;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private QuoteHelper quoteHelper;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private SharedRfpService sharedRfpService;

    public ClientAllQuoteDto getAllQuotePlans(Long clientId) {

        ClientAllQuoteDto result = new ClientAllQuoteDto(); 

        rfpQuoteOptionRepository.findByClientId(clientId)
                .stream()
                .filter(o -> o.getRfpQuoteOptionName().equalsIgnoreCase("Option 1"))
                .forEach(option -> {
                    String product = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
                    QuoteType quoteType = option.getRfpQuote().getQuoteType();
                    ClientRateBankDto rateBankPlans = rateBankService.getRateBankPlans(clientId, option, product);
                    rateBankPlans.setQuoteType(quoteType);
                    if (Constants.MEDICAL.equals(product)) {
                        if (QuoteType.KAISER.equals(quoteType)) {
                            result.setKaiserQuote(rateBankPlans);
                        } else {
                            result.setMedicalQuote(rateBankPlans);
                        }
                    } else if (Constants.DENTAL.equals(product)) {
                        result.setDentalQuote(rateBankPlans);
                    } else if (Constants.VISION.equals(product)) {
                        result.setVisionQuote(rateBankPlans);
                    }
                });
        
        Float medicalTotal = ofNullable(result.getMedicalQuote())
                .filter(quote -> !QuoteType.DECLINED.equals(quote.getQuoteType()))
                .map(ClientRateBankDto::getTotalPremium)
                .orElse(0F);

        Float kaiserTotal = ofNullable(result.getKaiserQuote())
                .filter(quote -> !QuoteType.DECLINED.equals(quote.getQuoteType()))
                .map(ClientRateBankDto::getTotalPremium)
                .orElse(0F);

        Float dentalTotal = ofNullable(result.getDentalQuote())
                .filter(quote -> !QuoteType.DECLINED.equals(quote.getQuoteType()))
                .map(ClientRateBankDto::getTotalPremium)
                .orElse(0F);

        Float visionTotal = ofNullable(result.getVisionQuote())
                .filter(quote -> !QuoteType.DECLINED.equals(quote.getQuoteType()))
                .map(ClientRateBankDto::getTotalPremium)
                .orElse(0F);
        
        float total = medicalTotal + kaiserTotal + dentalTotal + visionTotal;
        
        result.setTotalAnnualPremium(total);
        
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException(String.format("Client not found id=%s", clientId));
        }

        // calc bundle discount
        float discountPercent = processClientAttributes(client, result);
        float premiumCredit = NumberUtils.toFloat(result.getPremiumCredit(), 0f);

        Float discount = medicalTotal * discountPercent / 100f;
        result.setProjectedBundleDiscountPercent(discountPercent);
        result.setProjectedBundleDiscount(discount);
        result.setTotalAnnualPremiumWithDiscount(total - discount - premiumCredit);
        
        result.setClientMembers(ClientMemberMapper.toDtos(clientTeamRepository.findByClientClientId(clientId)));

 
        return result;
    }

    private float processClientAttributes(Client client, ClientAllQuoteDto result) {
        float discountPercent = 0F;
        for (ClientAttribute attribute : client.getAttributes()) {
            switch (attribute.getName()) {
                case DENTAL_DISCOUNT:
                    if (result != null) { result.setDentalDiscount(BooleanUtils.toBooleanObject(attribute.getValue()));}
                    if (StringUtils.equalsIgnoreCase("true", attribute.getValue())) {
                        discountPercent += DENTAL_BUNDLE_DISCOUNT_PERCENT;
                    }
                    break;
                case LIFE_DISCOUNT:
                    if (result != null) { result.setLifeDiscount(BooleanUtils.toBooleanObject(attribute.getValue()));}
                    if (StringUtils.equalsIgnoreCase("true", attribute.getValue())) {
                        discountPercent += CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(LIFE,0F);
                    }
                    break;
                case LTD_DISCOUNT:
                    if (result != null) { result.setLtdDiscount(BooleanUtils.toBooleanObject(attribute.getValue()));}
                    if (StringUtils.equalsIgnoreCase("true", attribute.getValue())) {
                        discountPercent += CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(LTD,0F);
                    }
                    break;
                case STD_DISCOUNT:
                    if (result != null) { result.setStdDiscount(BooleanUtils.toBooleanObject(attribute.getValue()));}
                    if (StringUtils.equalsIgnoreCase("true", attribute.getValue())) {
                        discountPercent += CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(STD,0F);
                    }
                    break;
                case VISION_DISCOUNT:
                    if (result != null) { result.setVisionDiscount(BooleanUtils.toBooleanObject(attribute.getValue()));}
                    if (StringUtils.equalsIgnoreCase("true", attribute.getValue())) {
                        discountPercent += VISION_BUNDLE_DISCOUNT_PERCENT;
                    }
                    break;
                case PREMIUM_CREDIT:
                    if (result != null) { result.setPremiumCredit(attribute.getValue());}
                    break;
                default:
                    break;
            }
        }
        return discountPercent;
    }    
    
    private void saveClientAttribute(Client client, AttributeName name, String value){
        if (value != null) {
            ClientAttribute attribute = attributeRepository
                    .findClientAttributeByClientIdAndName(client.getClientId(), name);
            if(attribute == null){
                attributeRepository.save(new ClientAttribute(client, name, value));
            }else{
                attribute.setValue(value);
            }
        }
    }

    private void saveClientAttribute(Client client, AttributeName name, Boolean value){
        if (value != null) {
            saveClientAttribute(client, name, value.toString());
        }
    }

    public void update(Long clientId, ClientAllQuoteDto dto) {
        
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException(String.format("Client not found id=%s", clientId));
        }
        
        saveClientAttribute(client, AttributeName.DENTAL_DISCOUNT, dto.getDentalDiscount());
        saveClientAttribute(client, AttributeName.VISION_DISCOUNT, dto.getVisionDiscount());
        saveClientAttribute(client, AttributeName.LIFE_DISCOUNT, dto.getLifeDiscount());
        saveClientAttribute(client, AttributeName.LTD_DISCOUNT, dto.getLtdDiscount());
        saveClientAttribute(client, AttributeName.STD_DISCOUNT, dto.getStdDiscount());
        saveClientAttribute(client, AttributeName.PREMIUM_CREDIT, dto.getPremiumCredit());
    }

    public void sendQuoteReady(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        if(isNull(client)){
            throw new BaseException("Client not found").withFields(field("client_id", clientId));
        }

        boolean clientOwnedCopyExist = false;
        if(isEmpty(client.getClientToken())){
            client.setClientToken(UUID.randomUUID().toString().toLowerCase());
            clientRepository.save(client);
        }else{
            clientOwnedCopyExist = !isNull(clientRepository.findByClientTokenAndClientIdNot(
                client.getClientToken(), client.getClientId())
            );
        }

        if(!clientOwnedCopyExist && client.isCarrierOwned()){
            // create non-carrier owned client
            Client clientCopy = client.copy();
            clientCopy.setCarrierOwned(false);

            clientCopy.setClientState(ClientState.QUOTED);

            clientCopy.setClientToken(client.getClientToken());
            clientCopy = clientRepository.save(clientCopy);

            for(RFP rfp : rfpRepository.findByClientClientId(client.getClientId())) {
                sharedRfpService.copyRfp(clientCopy, rfp);
            }

            // copy rfp submission and rfp quote
            sharedRfpQuoteService.copyQuote(client, clientCopy);

        }else if(clientOwnedCopyExist && client.isCarrierOwned()){
            // find non-carrier owned client
            Client nonCarrierOwnedClient = clientRepository.findByClientTokenAndClientIdNot(client.getClientToken(),  clientId);
            if(nonCarrierOwnedClient == null){
                throw new BaseException("Could not find non carrier owned client.")
                    .withFields(
                        field("carrier_owned_client_id", clientId),
                        field("client_token", client.getClientToken())
                    );
            }

            // update quote in non-carrier owned client
            List<RfpQuote> carrierOwnedQuotes = rfpQuoteRepository.findByClientIdIncludingDeclinedQuotes(clientId);
            List<RfpQuote> nonCarrierOwnedQuotes = rfpQuoteRepository.findByClientIdIncludingDeclinedQuotes(nonCarrierOwnedClient.getClientId());
            for(RfpQuote newQuote: carrierOwnedQuotes){
                RfpQuote previousQuote = findPreviousQuoteByCategoryAndQuoteType(nonCarrierOwnedQuotes, newQuote);

                if(previousQuote == null){
                    // copy new quote into client
                    RfpCarrier rfpCarrier = newQuote.getRfpSubmission().getRfpCarrier(); // same rfpCarrier(Anthem)
                    RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, nonCarrierOwnedClient);
                    if(rfpSubmission == null){
                        throw new BaseException("Rfp submission for non carrier owned client is null").withFields(
                            field("carrier_owned_client_id", clientId),
                            field("client_token", client.getClientToken())
                        );
                    }
                    sharedRfpQuoteService.copyRfpQuoteAndReturn(rfpSubmission, newQuote);
                }else{
                    // update non carrier quote with quote from carrier client
                    RfpQuote newRfpQuoteCopy = sharedRfpQuoteService.copyRfpQuoteAndReturn(null, newQuote);
                    quoteHelper.updateQuoteHelper(previousQuote, newRfpQuoteCopy, null, true);
                }
            }
        }

        // send quote ready notification
        emailService.sendQuoteReady(clientId, getAllQuotePlans(clientId));
    }

    private RfpQuote findPreviousQuoteByCategoryAndQuoteType(List<RfpQuote> nonCarrierOwnedQuotes, RfpQuote newQuote){
        return nonCarrierOwnedQuotes.stream()
            .filter(q -> q.getRfpSubmission().getRfpCarrier().getCategory().equals(newQuote.getRfpSubmission().getRfpCarrier().getCategory())
                    && q.getQuoteType().equals(newQuote.getQuoteType())
            )
            .findFirst()
            .orElse(null);
    }
}

package com.benrevo.be.modules.admin.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Notification;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static java.util.Comparator.comparing;
import static org.apache.commons.lang3.StringUtils.split;

@Service
@Transactional
public class HistoryService {

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;


    public HistoryDto getLastNotification(Long clientId, String channel, String name) {

        List<Notification> notifications = notificationRepository.findByClientIdAndChannelAndName(clientId, channel, name);

        notifications.sort(comparing(Notification::getDate));
        HistoryDto history = new HistoryDto();
        history.setName(name);
        history.setDate("N/A");
        if(notifications.size() >= 1){
            Notification result = notifications.get(notifications.size()-1);
            history.setName(result.getName());
            history.setDate(result.getDate().toString());
        }
        return history;
    }

    public List<HistoryDto> getLastQuote(Long clientId, String carrierName){

        RfpQuote medicalQuoteWithKaiser = getLastQuote(clientId, carrierName, Constants.MEDICAL, QuoteType.KAISER);
        RfpQuote kaiser_easy = getLastQuote(clientId, carrierName, Constants.MEDICAL, QuoteType.KAISER_EASY);
        RfpQuote standard = getLastQuote(clientId, carrierName, Constants.MEDICAL, QuoteType.STANDARD);
        RfpQuote standard_easy = getLastQuote(clientId, carrierName, Constants.MEDICAL, QuoteType.EASY);

        RfpQuote dentalQuote = getLastQuote(clientId, carrierName, Constants.DENTAL, QuoteType.STANDARD);
        RfpQuote visionQuote = getLastQuote(clientId, carrierName, Constants.VISION, QuoteType.STANDARD);

        ArrayList<HistoryDto> histories = new ArrayList<>();
        histories.add(addHistory(medicalQuoteWithKaiser != null ? medicalQuoteWithKaiser : kaiser_easy,
            "Medical_with_kaiser", medicalQuoteWithKaiser != null ? QuoteType.KAISER.name() : (kaiser_easy != null ? QuoteType.KAISER_EASY.name() : null)));
        histories.add(addHistory(standard != null ? standard : standard_easy, "Medical_without_kaiser",
            standard != null ? QuoteType.STANDARD.name() : (standard_easy != null ? QuoteType.EASY.name() : null)));

        histories.add(addHistory(dentalQuote, "Dental", null));
        histories.add(addHistory(visionQuote, "Vision", null));

        return histories;
    }

    public HistoryDto getLastQuoteSummary(Long clientId){
        RfpQuoteSummary summary = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        HistoryDto history = new HistoryDto();
        history.setName("Quote_Summary");
        history.setDate( (summary != null && summary.getUpdated() != null) ? summary.getUpdated().toString() : "N/A");
        return history;
    }

    private HistoryDto addHistory(RfpQuote quote, String name, String type){
        HistoryDto history = new HistoryDto();
        history.setName(name);
        if(quote != null && quote.getUpdated() != null){
            history.setDate(quote.getUpdated().toString());
        }else{
            history.setDate("N/A");
        }

        if(type != null){
            history.setType(type);
        }

        if(quote != null && quote.getS3Key() != null){
            String fileName = split(quote.getS3Key(), "_", 2)[1];
            history.setFileName(fileName);
        }

        return history;
    }

    private RfpQuote getLastQuote(Long clientId, String carrierName, String category, QuoteType quoteType){

        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(carrierName, category);
        if(rfpCarrier == null){
            throw new NotFoundException("No RFP Carrier found for category="+ category +", carrier="+carrierName);
        }

        return rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, quoteType);
    }
}

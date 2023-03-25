package com.benrevo.dashboard.service;

import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RewardDetailsDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.repository.ActivityRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class DashboardEmailService extends BaseEmailService {

    public static String REWARDS_TEMPLATE = "/rewards.html";

    @Autowired
    protected DashboardVelocityService velocityService;
    
    @Autowired
    private DashboardDocumentService documentService;
    
    @Autowired
    private ClientDetailsService clientDetailsService;

    @Autowired
    private ActivityRepository activityRepository;

    public void sendRewardsNotification() {
        //Client client = clientRepository.findOne(clientId);

        List<String> recipients = getRewardsNotificationRecipients();
        if(recipients.isEmpty()) {
            throw new BaseException("No REWARDS email recipients found");
        }
        // send mail to carrier
        String templatePath = getPrefix() + REWARDS_TEMPLATE;
        String emailTemplate = velocityService.getRewardsEmailTemplate(templatePath);
        
        MailDto mailDto = new MailDto();
        mailDto.setRecipients(recipients); 
        mailDto.setSubject(getRewardsNotificationSubject());
        mailDto.setContent(emailTemplate);
        
        List<RewardDetailsDto> rewardDetails = clientDetailsService.getLastRewardsDetails();
//      if(rewardDetails.isEmpty()) {
            // TODO change template for empty rewards?
            // send(mailDto);
//      } else {
        byte[] rewardsDocument = documentService.buildRewardsDocument(rewardDetails);   
        List<AttachmentDto> attachments = new ArrayList<>();
        String fileName = String.format("rewards_%s.xls", DateHelper.fromDateToString(new Date(), "MM_dd_yyyy"));
        attachments.add(new AttachmentDto(fileName, rewardsDocument));
        send(mailDto, attachments);
//        storeEmailNotification(clientId, "REWARDS");
        
        // sent activities should be marked as completed
        Set<Long> completedActivitiesIds = rewardDetails.stream().map(RewardDetailsDto::getActivityId).collect(Collectors.toSet());
        Date completedDated = new Date();
        for(Long id : completedActivitiesIds) {
            Activity a = activityRepository.findOne(id);
            a.setCompleted(completedDated);
            activityRepository.save(a);
        }
    }
    
    protected String getRewardsNotificationSubject() {
        throw new NotImplementedException("Carrier specific");
    }
    
    protected List<String> getRewardsNotificationRecipients() {
        throw new NotImplementedException("Carrier specific");
    }

}

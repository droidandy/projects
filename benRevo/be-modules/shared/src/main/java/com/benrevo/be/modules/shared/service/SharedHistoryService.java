package com.benrevo.be.modules.shared.service;

import static java.util.Comparator.comparing;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.data.persistence.entities.Notification;
import com.benrevo.data.persistence.repository.NotificationRepository;

@Service
@Transactional
public class SharedHistoryService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void storeNotification(Long clientId, String name){
        Notification not = new Notification();
        not.setChannel("EMAIL");
        not.setDate(new Date());
        not.setClientId(clientId);
        not.setName(name.toUpperCase());
        notificationRepository.save(not);
    }
    
    public HistoryDto getLastNotification(Long clientId, String channel, String name) {

        List<Notification> notifications = notificationRepository.findByClientIdAndChannelAndName(clientId, channel, name);

        notifications.sort(comparing(Notification::getDate));
        HistoryDto history = new HistoryDto(name, "N/A");
        if(notifications.size() >= 1){
            Notification result = notifications.get(notifications.size()-1);
            history.setName(result.getName());
            history.setDate(result.getDate().toString());
        }
        return history;
    }

    public List<HistoryDto> getLastNotifications(Long clientId, String channel, String name) {

        List<Notification> notifications = notificationRepository.findByClientIdAndChannelAndName(clientId, channel, name);

        notifications.sort(comparing(Notification::getDate));
        
        return notifications.
                stream().
                map(n -> new HistoryDto(n.getName(), n.getDate().toString())).
                collect(Collectors.toList());
    }

}

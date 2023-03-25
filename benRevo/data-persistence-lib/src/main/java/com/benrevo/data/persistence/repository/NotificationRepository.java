package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Notification;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    List<Notification> findByClientId(Long clientId);

    List<Notification> findByClientIdAndChannel(Long clientId, String channel);

    List<Notification> findByClientIdAndChannelAndName(Long clientId, String channel, String name);
}
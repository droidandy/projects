package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @Column	(name = "channel")
    private String channel;

    @Column	(name = "name")
    private String name;

    @Column (name = "date")
    private Date date;

    @Column	(name = "client_id")
    private Long clientId;

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notification)) return false;

        Notification notification = (Notification) o;

        if (!notificationId.equals(notification.notificationId)) return false;
        if (!channel.equals(notification.channel)) return false;
        if (!name.equals(notification.name)) return false;
        if (!date.equals(notification.date)) return false;
        if (!clientId.equals(notification.clientId)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = notificationId.hashCode();
        result = 31 * result + channel.hashCode();
        result = 31 * result + name.hashCode();
        result = 31 * result + date.hashCode();
        result = 31 * result + clientId.hashCode();
        return result;
    }
}
package com.benrevo.common.mail;

import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;

import javax.mail.MessagingException;
import java.util.List;

public interface ISMTPMailer {
    void send(MailDto mailDto, List<AttachmentDto> attachments) throws MessagingException;

    void send(MailDto mailDto) throws MessagingException;
}
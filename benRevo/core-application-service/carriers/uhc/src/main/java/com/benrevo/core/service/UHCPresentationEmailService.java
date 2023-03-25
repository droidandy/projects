package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.UHC;

import com.benrevo.be.modules.presentation.email.PresentationEmailService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCPresentationEmailService extends PresentationEmailService {

    public static String UHC_NEW_SALE_NOTIFICATION_SUBJECT = "Case Name: %s, Eff Date: %s";

    public UHCPresentationEmailService() {
        appCarrier = new String[] {UHC.name()};
    }

    @Override
    protected String getNewSaleNotificationSubject(Client client) {
        return String.format(UHC_NEW_SALE_NOTIFICATION_SUBJECT, 
            client.getClientName(), DateHelper.fromDateToString(client.getEffectiveDate()));
    }

    @Override
    protected void sendNewSaleNotificationRecord(Long clientId) {
        // not needed for UHC?
        return;
    }
}

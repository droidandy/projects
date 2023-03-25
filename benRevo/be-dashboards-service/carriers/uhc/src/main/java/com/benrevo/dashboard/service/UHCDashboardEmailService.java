package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.UHC;

import com.benrevo.common.annotation.AppCarrier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCDashboardEmailService extends DashboardEmailService {
    
   
    public UHCDashboardEmailService() {
        appCarrier = new String[]{ UHC.name() };
    }
}

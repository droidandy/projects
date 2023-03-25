package com.benrevo.be.modules.admin.service;

import static com.benrevo.common.enums.CarrierType.UHC;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.data.persistence.entities.Person;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCAccountRequestService extends BaseAccountRequestService{

    @Override
    protected Person getPresales(String presalesName) {
        return getPerson(UHC, PersonType.PRESALES, presalesName);
    }

    @Override
    protected Person getSales(String salesName) {
        return getPerson(UHC, PersonType.SALES, salesName);
    }

    @Override
    public Map<String, List<String>> getContacts() {  
        return getContacts(UHC);
    }

    @Override
    public void verifyBcc(AccountRequestVerificationDto accReqVerificationDto){
        return; // only for Anthem
    }
}

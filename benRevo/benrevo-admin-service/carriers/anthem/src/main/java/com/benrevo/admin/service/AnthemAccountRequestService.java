package com.benrevo.admin.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static org.apache.commons.lang3.StringUtils.isBlank;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.admin.service.BaseAccountRequestService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Person;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemAccountRequestService extends BaseAccountRequestService {

    @Value("${app.env:local}")
    String appEnv;

    private static final String PROD = "prod";
    
    @Override
	protected Person getPresales(String presalesName){
        return getPerson(ANTHEM_BLUE_CROSS, PersonType.PRESALES, presalesName);
    }

    @Override
    protected Person getSales(String salesName){
        return getPerson(ANTHEM_BLUE_CROSS, PersonType.SALES, salesName);
    }

    @Override
    public Map<String, List<String>> getContacts() {
        return getContacts(ANTHEM_BLUE_CROSS);
    }

    @Override
    public void verifyBcc(AccountRequestVerificationDto accReqVerificationDto){
        if(appEnv.equalsIgnoreCase(PROD)){
            if(isBlank(accReqVerificationDto.getBcc())){
                throw new NotFoundException("AccountRequest needs a bcc field");
            }
        }else{
            accReqVerificationDto.setBcc(null);
        }
    }
}

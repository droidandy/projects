package com.benrevo.admin.domain.clients;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import static org.apache.commons.lang.StringUtils.isBlank;
import com.benrevo.data.persistence.entities.Broker;

@Component
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional(rollbackFor = Exception.class)
public class AnthemOptimizerLoader extends BaseOptimizerLoader{

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Override
    protected Person getPresale(String presaleName) {
        return findPerson(CarrierType.ANTHEM_BLUE_CROSS, PersonType.PRESALES, presaleName, null);
    }

    @Override
    protected Person getSale(String saleName) {
        return findPerson(CarrierType.ANTHEM_BLUE_CROSS, PersonType.SALES, saleName, null);
    }

    @Override
    protected RfpCarrier getRfpCarrier(String product) {
        return rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.ANTHEM_BLUE_CROSS.name(),
            product
        );
    }

    @Override
    protected void verifyBcc(Broker broker){
        if(isBlank(broker.getBcc())){
            throw new NotFoundException("Broker needs a bcc field");
        }
    }
}

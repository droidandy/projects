package com.benrevo.admin.clients;

import static com.benrevo.common.enums.CarrierType.UHC;
import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCRenewalHelper;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@AppCarrier(UHC)
@Transactional(rollbackFor = Exception.class)
public class UHCOptimizerLoader extends BaseOptimizerLoader{

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private UHCRenewalHelper uhcRenewalHelper;
    
    @Override
    protected Person getPresale(String presaleName){
        return findPerson(CarrierType.UHC, PersonType.PRESALES, presaleName, null);
    }

    @Override
    protected Person getSale(String saleName){
        return findPerson(CarrierType.UHC, PersonType.SALES, saleName, null);
    }

    @Override
    protected RfpCarrier getRfpCarrier(String product) {
        return rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.UHC.name(),
            product
        );
    }

    @Override
    protected PlanNameByNetwork createExternalRxPlan(Network network, boolean persist, String planName, List<BenefitName> benefitNames){
        return uhcRenewalHelper.createExternalRxPlan(network, persist, planName, benefitNames);
    }

    @Override
    protected void verifyBcc(Broker broker){
        return; //uhc does not care about bcc, only anthem
    }
}

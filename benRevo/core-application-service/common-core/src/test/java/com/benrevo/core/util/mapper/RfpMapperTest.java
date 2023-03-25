package com.benrevo.core.util.mapper;

import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.mapper.RfpMapper;
import org.junit.Test;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;

public class RfpMapperTest {

    private PodamFactory podamFactory = new PodamFactoryImpl();

    public RfpMapperTest() {
    	AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
		classInfoStrategy
                .addExcludedField(RFP.class, "client")
                .addExcludedField(RFP.class, "carrierHistories")
                .addExcludedField(RFP.class, "options")
                .addExcludedField(RfpDto.class, "fileInfoList")
                
        		.addExcludedField(AncillaryPlanDto.class, "planType")
        		.addExcludedField(AncillaryClass.class, "ancillaryPlan")
        		.addExcludedField(AncillaryRate.class, "ancillaryPlan")
        		.addExcludedField(AncillaryRateAge.class, "ancillaryRate");
        podamFactory.setClassStrategy(classInfoStrategy);
    }

    @Test
    public void rfpToDTO() throws Exception {
        RFP rfp = podamFactory.manufacturePojo(RFP.class);
        rfp.setClient(new Client());
        RfpDto rfpDto = RfpMapper.rfpToDTO(rfp);
        assertEquals(rfp.getRfpId(), rfpDto.getId());
        assertEquals(rfp.getLargeClaims(), rfpDto.getLargeClaims());
        assertEquals(rfp.getComments(), rfpDto.getComments());
    }

    @Test
    public void rfpDtoToRFP() throws Exception {
        RfpDto rfpDto = podamFactory.manufacturePojo(RfpDto.class);
        RFP rfp = RfpMapper.rfpDtoToRFP(rfpDto);
        assertEquals(rfpDto.getPaymentMethod(), rfp.getPaymentMethod());
        assertEquals(rfpDto.getLargeClaims(), rfp.getLargeClaims());
        assertEquals(rfpDto.getComments(), rfp.getComments());
    }

}

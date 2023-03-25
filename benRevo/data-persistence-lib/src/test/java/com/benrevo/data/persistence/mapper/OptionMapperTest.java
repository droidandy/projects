package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;

import org.junit.Test;

import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class OptionMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(Option.class, OptionDto.class).validate();
        ObjectMapperUtils.getTypeMap(OptionDto.class, Option.class).validate();
	}

	@Test
    public void toEntityTest() {
        
	    OptionDto dto = new OptionDto();
	    dto.setRfpId(12L);
	    
	    Option entity = OptionMapper.dtoToOption(dto);
	    
	    assertNotNull(entity);
	    assertEquals(Long.valueOf(12L), entity.getRfp().getRfpId());
        
    }

	
	@Test
    public void toDtoTest() {
        
	    Option entity = new Option();
	    RFP rfp = new RFP();
	    rfp.setRfpId(14L);
	    entity.setRfp(rfp);
	    
	    OptionDto dto = OptionMapper.optionToDTO(entity);

        assertNotNull(dto);
        assertEquals(Long.valueOf(14), dto.getRfpId());
        
    }

}

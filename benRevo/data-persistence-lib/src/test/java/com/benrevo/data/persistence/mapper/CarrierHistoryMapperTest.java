package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.RFP;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class CarrierHistoryMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(CarrierHistoryDto.class, CarrierHistory.class).validate();
        ObjectMapperUtils.getTypeMap(CarrierHistory.class, CarrierHistoryDto.class).validate();
	}

	@Test
    public void toEntityTest() {
        
	    CarrierHistoryDto dto = new CarrierHistoryDto();
	    dto.setRfpId(3L);

	    CarrierHistory entity = CarrierHistoryMapper.dtoToCarrierHistory(dto);
	    
	    assertNotNull(entity.getRfp());
	    assertEquals(Long.valueOf(3L), entity.getRfp().getRfpId());
        
    }

	
	@Test
    public void toDtoTest() {
        
	    CarrierHistory entity = new CarrierHistory();
	    RFP rfp = new RFP();
	    rfp.setRfpId(11L);
	    entity.setRfp(rfp);
	    
	    CarrierHistoryDto dto = CarrierHistoryMapper.toDto(entity);

        assertEquals(Long.valueOf(11), dto.getRfpId());
        
    }

}

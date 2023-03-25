package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.FileDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.ClientFileUpload;

import org.junit.Test;

import static org.junit.Assert.assertNotNull;

public class FileMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(FileDto.class, ClientFileUpload.class).validate();
        ObjectMapperUtils.getTypeMap(ClientFileUpload.class, FileDto.class).validate();
	}

	@Test
    public void toEntityTest() {
        
	    FileDto dto = new FileDto();

	    ClientFileUpload entity = FileMapper.dtoToFile(dto);
	    
	    assertNotNull(entity);
        
    }

	
	@Test
    public void toDtoTest() {

	    ClientFileUpload entity = new ClientFileUpload();

	    FileDto dto = FileMapper.fileToDto(entity);

	    assertNotNull(dto);
        
    }

}

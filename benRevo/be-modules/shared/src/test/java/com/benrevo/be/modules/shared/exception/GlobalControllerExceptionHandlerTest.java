package com.benrevo.be.modules.shared.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.exception.NotFoundException;

public class GlobalControllerExceptionHandlerTest {

	@Test
	public void testHandleNotFoundException() throws Exception {
		GlobalControllerExceptionHandler handler = new GlobalControllerExceptionHandler();
		
		NotFoundException exception = new NotFoundException("Object not found");
		ResponseEntity<RestMessageDto> resp = handler.handle(exception, null);
	
		assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	}
}

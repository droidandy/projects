package com.benrevo.common.exception;

public class ClientException extends BaseException {

	public ClientException(String message) {
		super(message);
	}

	public ClientException(String message, Throwable cause) {
		super(message, cause);
	}	
}
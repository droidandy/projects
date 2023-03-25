package com.benrevo.data.persistence.converter.type;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.benrevo.common.enums.QuoteType;

@Converter
public class QuoteTypeConverter implements AttributeConverter<QuoteType, String> {

	@Override
	public String convertToDatabaseColumn(QuoteType toDb) {
		return toDb != null ? toDb.name() : null;
	}

	@Override
	public com.benrevo.common.enums.QuoteType convertToEntityAttribute(String dbData) {
		return dbData != null ? QuoteType.valueOf(dbData) : null;
	}	
}
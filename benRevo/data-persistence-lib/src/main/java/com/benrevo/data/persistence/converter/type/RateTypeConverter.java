package com.benrevo.data.persistence.converter.type;

import com.benrevo.common.enums.RateType;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class RateTypeConverter implements AttributeConverter<RateType, String> {

	@Override
	public String convertToDatabaseColumn(RateType toDb) {
		return toDb != null ? toDb.name() : null;
	}

	@Override
	public RateType convertToEntityAttribute(String dbData) {
		return dbData != null ? RateType.valueOf(dbData) : null;
	}	
}
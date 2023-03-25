package com.benrevo.common.util;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonUtils {

    @Autowired
    private ObjectMapper mapper;

    public static String getField(String jsonStr, String field) throws Exception {
	    JSONParser jsonParser = new JSONParser();
	    JSONObject jsonObject;
		try {
			jsonObject = (JSONObject) jsonParser.parse(jsonStr);
			return (String)jsonObject.get(field);
		} catch (ParseException e) {
			throw new Exception("Error parsing JSON doc: " + jsonStr, e);
		}
	}

    public String toJson(Object src) {
        try {
            return mapper.writeValueAsString(src);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON write error", e);
        }
    }
    
    public <T> T fromJson(String json, Class<T> classOfT) {
        try {
            return mapper.readValue(json, classOfT);
        } catch (Exception e) {
           throw new RuntimeException("JSON parse error", e);
        } 
    }
    @SuppressWarnings("rawtypes")
    public <T> T fromJson(String json, TypeReference valueTypeRef) {
        try {
            return mapper.readValue(json, valueTypeRef);
        } catch (Exception e) {
           throw new RuntimeException("JSON parse error", e);
        } 
    }
}

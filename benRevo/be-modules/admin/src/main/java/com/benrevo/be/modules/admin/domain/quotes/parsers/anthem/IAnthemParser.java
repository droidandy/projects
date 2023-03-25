package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import com.benrevo.common.dto.QuoteParserErrorDto;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;

import com.benrevo.data.persistence.entities.BenefitName;
import java.util.Set;

public interface IAnthemParser {

    void parseAnthemQuotes(InputStream fis, Set<QuoteParserErrorDto> errorCollector) throws Exception;

    String deriveNetworkName(String category, String plan, String network);

    LinkedHashMap<String, RateDescriptionDTO> getAllMedicalParsedPlanInformation();

    LinkedHashMap<String, RateDescriptionDTO> getAllVisionParsedPlanInformation();

    LinkedHashMap<String, RateDescriptionDTO> getAllDentalParsedPlanInformation();

    void setAllDentalParsedPlanInformation(LinkedHashMap<String, RateDescriptionDTO> allDentalParsedPlanInformation);

    int getTiers();

    default void setBenefitNames(List<BenefitName> benefitNames) {};
    
}

package com.benrevo.common.util;

import static org.apache.commons.lang3.tuple.Pair.of;

import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientLocaleUtils implements InitializingBean {
    
    @Autowired
    private CustomLogger logger;

    private String zipCodeCountyRes = "zipcode_county";
    private String clsa_uhc_zipCodeCountyRes = "program/clsa/uhc/zipcode_county";
    private String countyRegionRes = "anthem/dental/area_network_factor";
    
    private Map<String, Pair<String, String>> zipCode2CityCounty;
    private Map<String, String> clsaUHCZipCode2Region;
    private Map<String, String> county2Region;

    private static final String DELIMITER = "|";

    @Override
    public void afterPropertiesSet() throws Exception {
        try {
            parseZipCounty();
            parseCountyRegion();
            parseCLSAUHCZipRegion();
        } catch(Exception e) {
            logger.error("Cannot read constants from static resurces", e);
            throw e;
        }
    }

    private List<String> readLinesFromInputStream(String path) {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path);
        return new BufferedReader(new InputStreamReader(inputStream,
            StandardCharsets.UTF_8)).lines().collect(Collectors.toList());
    }
    
    private void parseZipCounty() {
        List<String> lines = readLinesFromInputStream(zipCodeCountyRes);
        zipCode2CityCounty = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            zipCode2CityCounty.put(values[0], of(values[1], values[2]));
        });
    }

    private void parseCLSAUHCZipRegion() {
        List<String> lines = readLinesFromInputStream(clsa_uhc_zipCodeCountyRes);
        clsaUHCZipCode2Region = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            clsaUHCZipCode2Region.put(values[0], values[1]);
        });
    }

    private void parseCountyRegion() {
        List<String> lines = readLinesFromInputStream(countyRegionRes);
        county2Region = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            county2Region.put(values[0], values[2]);
        });
    }

    public String getCLSARegionByZipCode(String zipCode) {
        if(zipCode == null) {
            return null;
        }
        String region = clsaUHCZipCode2Region.get(zipCode);
        return region == null ? null : region;
    }

    public String getCountyByZipCode(String zipCode) {
        if(zipCode == null) {
            return null;
        }
        Pair<String, String> cityCounty = zipCode2CityCounty.get(zipCode);
        return cityCounty == null ? null : cityCounty.getRight();
    }

    public String getCountyByCity(String city) {
        if(city == null) {
            return null;
        }
        for(Pair<String, String> cityCounty : zipCode2CityCounty.values()) {
            if(cityCounty.getLeft().equals(city)) {
                return cityCounty.getRight();
            }
        };
        return null;
    }
    
    public BrokerLocale getLocaleByZipCode(String zipCode) {
        return getLocaleByCounty(getCountyByZipCode(zipCode));
    }
    
    public BrokerLocale getLocaleByCounty(String county) {
        if(county == null) {
            return null;
        }
        return getLocaleByRegion(county2Region.get(county.toUpperCase()));
    }
    
    public BrokerLocale getLocaleByCity(String city) {
        if(city == null) {
            return null;
        }
        return getLocaleByCounty(getCountyByCity(city));
    }
    
    public BrokerLocale getLocale(String county, String zipCode, String city) {
        BrokerLocale locale = null;
        if(StringUtils.isNotBlank(county)) {
            locale = getLocaleByCounty(county);
        } else if(StringUtils.isNotBlank(zipCode)) {
            locale = getLocaleByZipCode(zipCode);
        } else if(StringUtils.isNotBlank(city)) {
            locale = getLocaleByCity(city);
        }
        if(locale == null) {
            throw new BaseException("Cannot determine client NORTH/SOUTH locale");
        }  
        return locale;
    }
    
    public BrokerLocale getLocaleByRegion(String region) {
        if("Northern".equalsIgnoreCase(region)) {
            return BrokerLocale.NORTH;
        } else if("Southern".equalsIgnoreCase(region)) {
            return BrokerLocale.SOUTH;
        } else {
            throw new BaseException("Unknown region: " + region);
        }
    }
}

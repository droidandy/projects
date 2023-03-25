package com.benrevo.common.enums;

import com.benrevo.common.Constants;
import com.benrevo.common.exception.NotFoundException;

import java.util.Arrays;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Arrays.copyOf;
import static java.util.Arrays.stream;
import static org.apache.commons.lang3.ArrayUtils.contains;
import static org.apache.commons.lang3.ArrayUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.*;

/**
 * Created by elliott on 6/29/17.
 *
 * TODO: Move this to config table at some point (or somewhere generic)
 */
public enum CarrierType {
    AETNA("aetna", "Aetna"),
    AMERITAS("ameritas", "Ameritas"),
    ANTHEM_BLUE_CROSS("anthem", "Anthem Blue Cross"),
    ANTHEM_CLEAR_VALUE("anthem", "Anthem Clear Value"),
    ASSURANT("assurant", "Assurant"),
    BENREVO("benrevo", "Benrevo"),
    BLUE_SHIELD("blue-shield", "Blue Shield"),
    CALIFORNIA_DENTAL_NETWORK("california-dental-network", "California Dental Network"),
    CIGNA("cigna", "Cigna"),
    COLONIAL_LIFE("colonial-life", "Colonial Life"),
    DEARBORN_NATIONAL("dearborn-national", "Dearborn National"),
    DELTA_DENTAL("delta-dental", "Delta Dental"),
    DENTAL_HEALTH_SERVICES("dental-health-services", "Dental Health Services"),
    EYEMED("eyemed", "Eyemed"),
    GUARDIAN("guardian", "Guardian"),
    HARTFORD("hartford", "Hartford"),
    HEALTHNET("healthnet", "Health Net"),
    HUMANA("humana", "Humana"),
    KAISER("kaiser", "Kaiser"),
    LIBERTY_MUTUAL("liberty-mutual", "Liberty Mutual"),
    LINCOLN_FINANCIAL("lincoln-financial", "Lincoln Financial"),
    MEDIEXCEL("mediexcel", "MediExcel"),
    MES_VISION("mes-vision", "MESVision"),
    METLIFE("metlife", "MetLife"),
    MUTUAL_OF_OMAHA("mutual-of-omaha", "Mutual of Omaha"),
    MULTIPLE_CARRIERS("multiple-carriers", "Multiple Carriers"),
    OTHER("other", "Other"),
    PREMIER_ACCESS("premier-access", "Premier Access"),
    PRINCIPAL_FINANCIAL_GROUP("principal-financial-group", "Principal Financial Group"),
    PRUDENTIAL("prudential", "Prudential"),
    RELIANCE_STANDARD("reliance-standard", "Reliance Standard"),
    SCRIPPS("scripps", "Scripps Health Plan"),
    SHARP_HEALTH_PLANS("sharp-health-plans", "Sharp Health Plans"),
    SIMNSA("simnsa", "SIMNSA"),
    STANDARD("standard", "The Standard"),
    SUN_LIFE("sun-life", "Sun Life"),
    UHC("uhc", "UnitedHealthcare"),
    UNITED_CONCORDIA("united-concordia", "United Concordia"),
    UNUM("unum", "Unum"),
    VOYA("voya", "Voya"),
    VSP("vsp", "VSP");

    // Used for S3 and property decryption in core-application-service
    public final String abbreviation;

    // Display name
    public final String displayName;

    CarrierType(String abbreviation, String displayName) {
        this.abbreviation = abbreviation;
        this.displayName = displayName;
    }

    /**
     * Get CarrierType from String input
     */
    public static CarrierType fromString(final String cs) {
        return stream(copyOf(values(), values().length))
            .filter(c -> equalsIgnoreCase(c.name(), cs))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("Specified carrier not found carrier=" + cs)
                    .withFields(field("carrier", cs))
            );
    }

    /**
     * Get CarrierType from display name string input
     */
    public static CarrierType fromDisplayNameString(final String ds) {
        return stream(copyOf(values(), values().length))
            .filter(c -> equalsIgnoreCase(c.displayName, ds))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("Specified carrier not found. carrier=" + ds)
                    .withFields(field("carrier", ds))
            );
    }

    /**
     * Get CarrierType from String input
     */
    public static CarrierType fromStrings(final String ... cs) {
        for(final CarrierType ct : values()) {
            if(cs != null) {
                if(equalsAnyIgnoreCase(ct.name(), cs)) {
                    return ct;
                }
            }
        }

        throw new NotFoundException("No carrier found for input string")
            .withFields(field("carrier", Arrays.toString(cs)));
    }

    /**
     * Get formatted carriers array from string array parameter.
     */
    public static String[] findCarriers(final String ... cs) {
        String[] r = stream(copyOf(values(), values().length))
            .map(Enum::name)
            .filter(c -> contains(cs, c))
            .toArray(String[]::new);

        if(isNotEmpty(r)) {
            return r;
        } else {
            throw new NotFoundException("Specified carrier not found. carrier=" + cs)
                .withFields(field("carrier", cs));
        }
    }

    /**
     * Check if a provided carrier matches an array of carrier strings.
     */
    public static boolean carrierMatches(final String cs, final String... s) {
        return validCarrier(cs) && equalsAnyIgnoreCase(cs, s);
    }

    /**
     * Check if a carrier is valid (without throwing exception).
     */
    public static boolean validCarrier(final String cs) {
        try {
            return isNotBlank(findCarrier(cs));
        } catch(NotFoundException ignored) {
            return false;
        }
    }

    /**
     * Checks if the carrierName is the same as the onboarded carriers - UHC and Anthem as of 01/08/2018
     * @param carrierName
     * @param appCarrier
     * @return
     */
    public static boolean isCarrierNameOnboardedAppCarrier(String carrierName, final String... appCarrier){

        if(!carrierName.equals(CarrierType.ANTHEM_BLUE_CROSS.name())
            && !carrierName.equals(CarrierType.ANTHEM_CLEAR_VALUE.name())
            && !carrierName.equals(CarrierType.UHC.name())){
            return false;
        }

        return true;
    }

    public static boolean isCarrierNameAppCarrier(String carrierName, final String... appCarrier){
        if(carrierMatches(Constants.ANTHEM_CARRIER, appCarrier)) {
            if(!carrierName.equals(CarrierType.ANTHEM_BLUE_CROSS.name())
                && !carrierName.equals(CarrierType.ANTHEM_CLEAR_VALUE.name())){
                return false;
            }
        }

        if(carrierMatches(CarrierType.UHC.name(), appCarrier)) {
            if(!carrierName.equals(CarrierType.UHC.name())){
                return false;
            }
        }

        if(carrierMatches(CarrierType.BENREVO.name(), appCarrier)) {
            if(!carrierName.equals(CarrierType.BENREVO.name())){
                return false;
            }
        }

        return true;
    }

    /**
     * Get formatted carrier string from parameter.
     */
    public static String findCarrier(String cs) {
        return stream(copyOf(values(), values().length))
            .map(Enum::name)
            .filter(c -> equalsIgnoreCase(c, cs))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("Specified carrier not found. carrier=" + cs)
                    .withFields(field("carrier", cs))
            );
    }

    /**
     * Check if a provided carrier matches an array of CarrierType enums.
     */
    public static boolean carrierMatches(String cs, CarrierType... s) {
        return validCarrier(cs) && stream(s).anyMatch(ct -> equalsIgnoreCase(cs, ct.name()));
    }

    @Override
    public String toString() {
        return name();
    }
}

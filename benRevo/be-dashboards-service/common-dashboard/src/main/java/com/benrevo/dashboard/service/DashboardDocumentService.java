package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static java.lang.String.format;
import static org.apache.poi.ss.util.CellReference.convertColStringToIndex;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.RewardDetailsDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.ibm.icu.text.DateFormat;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DashboardDocumentService {

    private static final String COMMON_TEMPLATE_DIR = "/templates/";
    private static final String APP_CARRIER_TEMPLATE_DIR = "/templates/%s/";

    private static final String TEMPLATE_REWARDS = "rewards.xls";
    
    private final SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.MDY_SLASH_DATE_FORMAT);

    @Value("${app.carrier}")
    private String[] appCarrier;
    
    public byte[] buildRewardsDocument(List<RewardDetailsDto> rewards) {
        HSSFWorkbook workbook = readRewardsTemplate();
        workbook.setMissingCellPolicy(MissingCellPolicy.CREATE_NULL_AS_BLANK);
        
        HSSFSheet participantsSheet = workbook.getSheet("New participants");
        HSSFSheet rewardsSheet = workbook.getSheet("Rewards");
        HSSFSheet hierarchySheet = workbook.getSheet("New Hierarchy");
        
        // New participants tab
        final int REPORT_SENT_COLUMN = convertColStringToIndex("A");
        final int LOGIN_ID_COLUMN = convertColStringToIndex("B");
        final int FIRST_NAME_COLUMN = convertColStringToIndex("C");
        final int LAST_NAME_COLUMN = convertColStringToIndex("E");
        final int EMAIL_COLUMN = convertColStringToIndex("K");
        final int COUNTRY_COLUMN = convertColStringToIndex("O");
        final int ADDRESS_TYPE_COLUMN = convertColStringToIndex("N");
        final int ADDRESS_COLUMN = convertColStringToIndex("P");
        final int CITY_COLUMN = convertColStringToIndex("V");
        final int STATE_COLUMN = convertColStringToIndex("W");
        final int ZIP_COLUMN = convertColStringToIndex("X");
        final int PRIMARY_ORG_UNIT1_NAME_COLUMN  = convertColStringToIndex("AG");
        final int PRIMARY_ORG_UNIT1_ROLE_COLUMN  = convertColStringToIndex("AH");
        // Rewards tab
        final int POINTS_LOGIN_ID_COLUMN = convertColStringToIndex("A");
        final int POINTS_COLUMN = convertColStringToIndex("B");
        final int POINTS_REQUESTED_COLUMN = convertColStringToIndex("C");
        // New Hierarchy tab
        final int HIERARCHY_RECORD_TYPE_COLUMN = convertColStringToIndex("A");
        final int HIERARCHY_ORG_UNIT_NAME_COLUMN = convertColStringToIndex("B");
        final int HIERARCHY_PARENT_UNIT_NAME_COLUMN = convertColStringToIndex("G");

        String reportDate = dateFormat.format(new Date());

        Set<String> newBrokerages = new HashSet<>();
        
        int curRowIndex = 1;
        for(RewardDetailsDto rewardDetails : rewards) {
            HSSFRow participantRow = participantsSheet.createRow(curRowIndex);
            participantRow.getCell(REPORT_SENT_COLUMN).setCellValue(reportDate);
            participantRow.getCell(LOGIN_ID_COLUMN).setCellValue(rewardDetails.getParticipantId());
            participantRow.getCell(FIRST_NAME_COLUMN).setCellValue(rewardDetails.getFirstName());
            participantRow.getCell(LAST_NAME_COLUMN).setCellValue(rewardDetails.getLastName());
            participantRow.getCell(EMAIL_COLUMN).setCellValue(rewardDetails.getEmail());
            participantRow.getCell(ADDRESS_COLUMN).setCellValue(rewardDetails.getAddress());
            participantRow.getCell(ADDRESS_TYPE_COLUMN).setCellValue("Business");
            participantRow.getCell(COUNTRY_COLUMN).setCellValue("US");
            participantRow.getCell(CITY_COLUMN).setCellValue(rewardDetails.getCity());
            participantRow.getCell(STATE_COLUMN).setCellValue(rewardDetails.getState());
            participantRow.getCell(ZIP_COLUMN).setCellValue(rewardDetails.getZip());
            participantRow.getCell(PRIMARY_ORG_UNIT1_NAME_COLUMN).setCellValue(rewardDetails.getBrokerageName());
            participantRow.getCell(PRIMARY_ORG_UNIT1_ROLE_COLUMN).setCellValue("Member");
            HSSFRow pointsRow = rewardsSheet.createRow(curRowIndex);
            pointsRow.getCell(POINTS_LOGIN_ID_COLUMN).setCellValue(rewardDetails.getParticipantId());
            pointsRow.getCell(POINTS_COLUMN).setCellValue(rewardDetails.getPoints());
            pointsRow.getCell(POINTS_REQUESTED_COLUMN).setCellValue(dateFormat.format(rewardDetails.getCreated()));
            curRowIndex++;
            if(rewardDetails.isFirstReward()) {
                newBrokerages.add(rewardDetails.getBrokerageName());
            }
        }
        // fill New Hierarchy tab
        int hierarchySheetRowIndex = 1;
        for(String brokerageName : newBrokerages) {
            HSSFRow hierarchyRow = hierarchySheet.createRow(hierarchySheetRowIndex);
            hierarchyRow.getCell(HIERARCHY_RECORD_TYPE_COLUMN).setCellValue("A"); // constant
            hierarchyRow.getCell(HIERARCHY_ORG_UNIT_NAME_COLUMN).setCellValue(brokerageName);
            // will be moved to carrier-specific, but current implementation supports Anthem only
            hierarchyRow.getCell(HIERARCHY_PARENT_UNIT_NAME_COLUMN).setCellValue("Anthem Representatives");
            hierarchySheetRowIndex++;
        }
        return writeWorkbook(workbook);
    }

    private HSSFWorkbook readRewardsTemplate() {
        try {
            InputStream is = this.getClass().getResourceAsStream(getPrefix()  + TEMPLATE_REWARDS);
            return new HSSFWorkbook(is);
        } catch(IOException e) {
            throw new BaseException("Cannot read rewards template file", e);
        }
    }
    
    private byte[] writeWorkbook(Workbook workbook) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            IOUtils.closeQuietly(out, workbook);
            return out.toByteArray();
        } catch(IOException e) {
            throw new ClientException("Unable to create quote options file");
        }
    }

    String getPrefix() {
        CarrierType ct = fromStrings(appCarrier);
        return ct != null ? format(APP_CARRIER_TEMPLATE_DIR, ct.abbreviation) : null;
    }
}
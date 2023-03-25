package com.benrevo.admin.domain.clients;

import com.amazonaws.services.dynamodbv2.xspec.S;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Client;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * Created by ojas.sitapara on 8/16/17.
 */
@Component
public class PriorYearClientLoader {

    @Autowired
    private CustomLogger LOGGER;

    private static DataFormatter formatter = new DataFormatter();

    public void run(FileInputStream fileInputStream) throws IOException{

        XSSFWorkbook myWorkBook = null;

        try{
            myWorkBook = new XSSFWorkbook (fileInputStream);

            // Walk through all the sheets
            for (int sheetIndex= 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {

                XSSFSheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String tabName = mySheet.getSheetName().trim();

                if(!tabName.equals("Opportunity List")) {
                    continue;
                }

                // Get iterator to all the rows in current sheet
                Iterator<Row> rowIterator = mySheet.iterator();

                int rowNum = 2; //burn the two rows, headers
                rowIterator.next();
                rowIterator.next();

                Map<String, List<String>> clientNameMap = new HashMap<>();
                DateFormat df = new SimpleDateFormat("MM/dd/yyyy");
                String colValue = null;

                // Traversing over each row of XLSX file
                while (rowIterator.hasNext()) {
                    rowNum++;
                    Row row = rowIterator.next();

                    Client client = new Client();

                    //client name
                    client.setClientName(getString(row, 1).replace(",",""));
                    // effective date
                    Date startDate = df.parse(getString(row, 2));
                    client.setEffectiveDate(startDate);
                    //address
                    client.setAddress(getString(row, 3).replace(",",""));
                    //city
                    client.setCity(getString(row, 4));
                    //state
                    client.setState(getString(row, 5));
                    //zip
                    colValue = getString(row, 6);
                    if(Character.isDigit(colValue.charAt(0))) {
                        client.setZip(colValue);
                    }
                    //sic code
                    client.setSicCode(getString(row, 7));
                    //eligible employees
                    client.setEligibleEmployees(Long.parseLong(getString(row, 8)));
                    //subscribers/participating
                    client.setParticipatingEmployees(Long.parseLong(getString(row, 9)));
                    //members
                    client.setMembersCount(Integer.parseInt(getString(row, 10)));

                    //broker name
                    String brokerName = getString(row, 13).replace(",","");

                    if(!clientNameMap.containsKey(brokerName)) {
                        clientNameMap.put(brokerName, new ArrayList<String>());
                    }

                    List<String> clientList = clientNameMap.get(brokerName);
                    String clientKey = client.getClientName() + "_" + client.getAddress();
                    if(clientList.contains(clientKey)) {
                        LOGGER.error("Duplicate client found for a single broker: " + brokerName + ", client: " + clientKey);
                        return;
                    }
                    clientList.add(client.getClientName() + "_" + client.getAddress());
                    clientNameMap.put(brokerName, clientList);
                }

                printClientsByBroker(clientNameMap);
            }
        } catch (Exception e) {
            LOGGER.error("An error occurred while parsing prior year clients", e);
        } finally {
            if(null != myWorkBook)
                myWorkBook.close();
        }
    }


    private void printClientsByBroker(Map<String, List<String>> brokerToClientMap) {


        String currDir = Paths.get("").toAbsolutePath().toString();
        File myFile = new File(currDir + "/data/clients/UHC/2017/priorYearClientsGrouped.xlsx");

        try{
            PrintWriter writer = new PrintWriter(currDir + "/data/clients/UHC/2017/priorYearClients.csv", "UTF-8");
            writer.println("Broker Name, Client Name, Client Address");

            Set brokersSet = brokerToClientMap.keySet();
            Iterator brokerIterator = brokersSet.iterator();
            while (brokerIterator.hasNext()) {
                String brokerName = (String)brokerIterator.next();
                writer.println(brokerName + ",,");
                List<String> clientNameList =  brokerToClientMap.get(brokerName);
                clientNameList.forEach((clientName) -> writer.println("," + clientName.replace("_",",")));
            }

            writer.close();
        } catch (IOException e) {
            // do something
        }
    }

    private String getString(Row row, int col) {
        return formatter.formatCellValue(row.getCell(col));
    }
}





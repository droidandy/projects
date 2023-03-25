package com.benrevo.core.util;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.service.PersonService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.Secure;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import java.io.InputStream;
import java.text.ParseException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static java.util.Arrays.asList;


/**
 * Created by Aleksei Korchak on 8/30/17.
 */
@Component
@Transactional
public class BrokerLoaderUtility {

    @Value("${app.carrier}")
    String[] appCarrier;

    @Value("${auth0.connection}")
    String connection;

    @Autowired
    ManagementAPI mgmtAPI;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private PersonRepository personRepository;

    private boolean DEBUG = true;
    private static DataFormatter formatter = new DataFormatter();
    private Map<String, Long> brokerMap = null;
    private Iterator<Row> rowIterator;
    private Row row;


    private void init() {
        if (brokerMap == null) {
            List<Broker> allBroker = (List<Broker>) brokerRepository.findAll();
            brokerMap = allBroker.stream().collect(Collectors.toMap(Broker::getName, Broker::getBrokerId));
        }
    }
    
    public void loadBroker(InputStream is) throws Exception {
        init();
    	HSSFWorkbook myWorkBook = null;
        try{
            myWorkBook = new HSSFWorkbook(is);
            doLoadBroker(myWorkBook.getSheet("Broker"));
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }

    }

    private void doLoadBroker(Sheet sheet) throws ParseException {
        
        if (sheet == null) {
            throw new BaseException("Sheet not found");
        }
        final Long carrierId = sharedCarrierService.getCurrentEnvCarrier().getCarrierId();
        rowIterator = sheet.iterator();
        while(getNextRow()) {
            String name = column(0);
            
            // stop when empty
            if (name == null) {
                break;
            }
            
            // skip label row
            if ("name".equals(name)) {
                continue;
            }
        
            if (brokerMap.containsKey(name)) {
                print("    Skip. Broker with name -", name, "- exists");
                continue;
            }
            
            Broker broker = new Broker();
            broker.setName(name);
            broker.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
            String presalesEmail = column(1);
            Person presalesPerson = null;
            if(presalesEmail != null && (presalesPerson = personRepository
                    .findByCarrierIdAndTypeAndEmail(carrierId, PersonType.PRESALES, presalesEmail)) != null) {
                broker.setPresales(presalesPerson); 
                //broker.setPresalesEmail(column(1));
                //broker.setPresalesFirstName(column(2));
                //broker.setPresalesLastName(column(3));
            }
            broker.setZip(column(4));
            broker.setState(column(5));
            broker.setCity(column(6));
            broker.setAddress(column(7));
            String salesEmail = column(8);
            Person salesPerson = null;
            if(salesEmail != null && (salesPerson = personRepository
                    .findByCarrierIdAndTypeAndEmail(carrierId, PersonType.SALES, salesEmail)) != null) {
                broker.setSales(salesPerson); 
                //broker.setSalesEmail(column(8));
                //broker.setSalesFirstName(column(9));
                //broker.setSalesLastName(column(10));
            }   
            String specialtyEmail = column(11);
            Person specialtyPerson = null;
            if(specialtyEmail != null && (specialtyPerson = personRepository
                    .findByCarrierIdAndTypeAndEmail(carrierId, PersonType.SPECIALTY, specialtyEmail)) != null) {
                broker.setSpecialty(specialtyPerson);
                // broker.setSpecialtyBrokerEmail(column(11));
            }   
  
            String locale = column(12);
            if ( locale != null ) {
                broker.setLocale(BrokerLocale.valueOf(locale));
            }
            broker.setBcc(column(13));
            brokerRepository.save(broker); 
            print("    create ", broker.toString());
        }
    }

    public void loadUser(InputStream is, String brokerName) throws Exception {

        init();
        HSSFWorkbook myWorkBook = null;
        try{
            myWorkBook = new HSSFWorkbook(is);
            doLoadUser(myWorkBook.getSheet("User"), brokerName);
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
        
    }


    private void doLoadUser(Sheet sheet, String defaultBrokerName) {
        
        if (sheet == null) {
            throw new BaseException("Sheet not found");
        }
        
        Long defaultBrokerId = null;
        if (defaultBrokerName != null) {
            defaultBrokerId = brokerMap.get(defaultBrokerName);
            if (defaultBrokerId == null) {
                throw new BaseException("Broker with name -" + defaultBrokerName + "- not found");
            }
        }

        rowIterator = sheet.iterator();
        while(getNextRow()) {
            
            String userEmail = column(0);
            
            // stop when empty
            if (userEmail == null) {
                break;
            } 
         
            // skip label row
            if ("user_email".equals(userEmail)) {
                continue;
            }
        
            String brokerageRole = column(1); 
            String brokerName = column(2); 
            
            Long brokerId = (brokerName == null) ? defaultBrokerId : brokerMap.get(brokerName);
            
            if (brokerId == null) {
                print("    Skip: Broker with name -", brokerName ,"- not found for client -",userEmail,"-");
                continue;
            }
            
            print("    CreateUser: email=", userEmail, " role=", brokerageRole, " broker=", brokerName);
            forceUserCreation(userEmail, brokerId, brokerageRole);
        }
    }

    public void forceUserCreation(String userEmail, Long brokerId, String brokerageRole) {
        try {
            Broker broker = brokerRepository.findOne(brokerId);

            User clientUser = new User(connection);

            clientUser.setEmail(userEmail);
            clientUser.setPassword(Secure.generateRandomToken());
            clientUser.setAppMetadata(
                build(
                    entry("brokerageRole", brokerageRole),
                    entry("brokerage", broker.getName()),
                    entry("brokerageId", broker.getBrokerToken()),
                    entry("carrierAcl", asList(appCarrier))
                )
            );

            User r = null;
            try{
                r = mgmtAPI.users()
                    .create(clientUser)
                    .execute();

                Thread.sleep(3000);
            }catch(Exception e){
                System.out.println("User already exits");
            }
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }


    private boolean getNextRow() {
        if (rowIterator.hasNext()) {
            row = rowIterator.next();
            return true;
        }
        return false;
    }
    
    private String column(int index) {
        String result = formatter.formatCellValue(row.getCell(index)).trim();
        return (result.isEmpty())?null:result;
    }
 
    private void print(String...strs) {
        if(DEBUG){
            for (String str:strs) {
                System.out.print(str);
            }
            System.out.println();
        }
    }
}

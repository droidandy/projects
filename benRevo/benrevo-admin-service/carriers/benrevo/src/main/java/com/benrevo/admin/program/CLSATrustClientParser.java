package com.benrevo.admin.program;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import com.benrevo.common.Constants;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateRepository;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimaps;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
// NOTE this is one-off parser! Only for preloading client plans and renewal generation
public class CLSATrustClientParser extends BaseProgramParser {

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private AncillaryRateRepository ancillaryRateRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private BenefitRepository benefitRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    
    private Iterator<Row> rowIterator;
    private Row row;
    private Iterator<Cell> cellIterator;
    private Cell cell;
    private String lastValue = "";
    private String lastCellValue = "";

    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);
    
    private Carrier cignaCarrier;
    
    public final class CLSACLientData {
    	public class ClientRates {
    		public float tier1;
    		public float tier2;
    		public float tier3;
    		public float tier4;
    		public long tier1Enrollment;
    		public long tier2Enrollment;
    		public long tier3Enrollment;
    		public long tier4Enrollment;
    		public PlanNameByNetwork pnn;
    		public PlanNameByNetwork rxPnn;
    	}
    	public String clientName;	
    	public String zipCode;	
    	public String avgAge;
    	public String dentalRegion;
    	public String dentalEligible;	
    	public String visionRegion;
    	public String visionEligible;
    	public ListMultimap<PlanCategory, ClientRates> products = ArrayListMultimap.create();
    	public ListMultimap<PlanCategory, AncillaryPlan> ancillary = ArrayListMultimap.create();
    }

    public CLSATrustClientParser() {}

    public Map<Long, CLSACLientData> parseFile(InputStream is, String brokerName, int planYear, Date effectiveDate) throws Exception {

        Workbook myWorkBook = null;

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);

            // Walk through all the sheets
            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {
                if (myWorkBook.isSheetHidden(sheetIndex)) {
                    continue; // skip hidden sheet 
                }
                Sheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String tabName = mySheet.getSheetName().trim().toUpperCase();
                if(tabName.equals("CLIENTS")) {
                    return parseClients(mySheet, brokerName, planYear, effectiveDate);
                }
            }
            return null;
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }

    private Map<Long, CLSACLientData> parseClients(Sheet sheet, String brokerName, int planYear, Date effectiveDate) {

    	Broker broker = brokerRepository.findByNameIgnoreCase(brokerName);
    	if (broker == null) {
    		throw new NotFoundException("Broker not found: " + brokerName);
    	}
    	cignaCarrier = carrierRepository.findByName(CarrierType.CIGNA.name());

    	Map<String, ProgramToPnn> medicalPnns = buildPlanToProgramPnn(
                CarrierType.UHC.name(), Constants.CLSA_TRUST_PROGRAM, planYear,
                PlanCategory.MEDICAL);
    	
    	Map<String, ProgramToPnn> dentalAndVisionPnns = buildPlanToProgramPnn(
                CarrierType.METLIFE.name(), Constants.CLSA_TRUST_PROGRAM, planYear,
                PlanCategory.DENTAL, PlanCategory.VISION);
    	
    	Map<String, ProgramToAncillaryPlan> ancillaryPlans = buildPlanByYearToProgramAncillaryPlan(
                CarrierType.CIGNA.name(), Constants.CLSA_TRUST_PROGRAM, 
                PlanCategory.LIFE, PlanCategory.VOL_LIFE, PlanCategory.STD, PlanCategory.LTD);
    	
    	rowIterator = sheet.iterator();
        // skip columns header
        getNextRow();
        
        Integer medical1Col = null, medical2Col = null, medical3Col = null, medical4Col = null, 
        		dentalCol = null, visionCol = null, rxCol = null,
        		lifeCol = null, volLifeCol = null, stdCol = null, ltdCol = null,
        		empADDCol = null, spouseADDCol = null, childLifeCol = null, childADDCol = null;

        cellIterator = row.cellIterator();
        while(getNextCell()) {
            String colName = column(cell).cellValue();
            if(isNotBlank(colName)) {
            	if(colName.equals("Medical Plan 1")) {
            		medical1Col = cell.getColumnIndex();
            	} else if(colName.equals("Medical Plan 2")) {
            		medical2Col = cell.getColumnIndex();
            	} else if(colName.equals("Medical Plan 3")) {
                	medical3Col = cell.getColumnIndex();
            	} else if(colName.equals("Medical Plan 4")) {
                	medical4Col = cell.getColumnIndex();
            	} else if(colName.equals("PPO/HSA Rx")) {
                	rxCol = cell.getColumnIndex();
            	} else if(colName.equals("Dental Plan")) {
            		dentalCol = cell.getColumnIndex();
            	} else if(colName.equals("Vision Plan")) {
            		visionCol = cell.getColumnIndex();
            	} else if(colName.equals("Cigna Basic Life/AD&D Plan")) {
            		lifeCol = cell.getColumnIndex();
            	} else if(colName.equals("Cigna Vol Life/AD&D Plan")) {
            		volLifeCol = cell.getColumnIndex();
            	} else if(colName.equals("Cigna STD Plan")) {
            		stdCol = cell.getColumnIndex();
            	} else if(colName.equals("Cigna LTD Plan")) {
            		ltdCol = cell.getColumnIndex();
            	} else if(colName.equals("Employee AD&D")) {
            		empADDCol = cell.getColumnIndex();
            	} else if(colName.equals("Spouse AD&D")) {
            		spouseADDCol = cell.getColumnIndex();
            	} else if(colName.equals("Child Life")) {
            		childLifeCol = cell.getColumnIndex();
            	} else if(colName.equals("Child AD&D")) {
            		childADDCol = cell.getColumnIndex();
            	}
            } 
        } 
        
        Map<Long, CLSACLientData> result = new HashMap<>();
        
        while(getNextRow()) {
            if (isBlank(column(0).value())) {
                break;
            }
            CLSACLientData clientData = new CLSACLientData();
            clientData.clientName = column(0).value();
            if(!column(1).value().equals("N/A")) {
            	clientData.zipCode = column(1).value();
            }
            Client client;
            List<Client> clients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
            		clientData.clientName, broker.getBrokerId(), false);
            if (clients.isEmpty()) {
            	client = new Client();
            	client.setBroker(broker);
                client.setEffectiveDate(effectiveDate);
                client.setClientState(ClientState.RFP_SUBMITTED);
                // FIXME
                client.setEligibleEmployees(0L);
                client.setZip(clientData.zipCode);
                client.setClientName(clientData.clientName);
                client.setSubmittedRfpSeparately(true);
            } else {
            	client = clients.get(0);
            }
            clientRepository.save(client);
            
            clientData.avgAge = column(2).value();
            for (Integer medicalCol : new Integer[] {medical1Col, medical2Col, medical3Col, medical4Col}) {
            	if (!column(medicalCol).value().equals("N/A")) {
            		PlanNameByNetwork plan = findOrCreatePlan(client.getClientId(), column(medicalCol).value(), medicalPnns, planYear);
                	CLSACLientData.ClientRates rates = clientData.new ClientRates();
                	rates.pnn = plan;
                	rates.tier1Enrollment = parseLongOrDefault(column(medicalCol + 1).value());
                	rates.tier2Enrollment = parseLongOrDefault(column(medicalCol + 2).value());
                	rates.tier3Enrollment = parseLongOrDefault(column(medicalCol + 3).value());
                	rates.tier4Enrollment = parseLongOrDefault(column(medicalCol + 4).value());
                	rates.tier1 = parseFloatOrDefault(column(medicalCol + 5).value());
                	rates.tier2 = parseFloatOrDefault(column(medicalCol + 6).value());
                	rates.tier3 = parseFloatOrDefault(column(medicalCol + 7).value());
                	rates.tier4 = parseFloatOrDefault(column(medicalCol + 8).value());
                	
                	PlanNameByNetwork rxPnn = null;
                	if (plan.getPlanType().equals(Constants.HMO)) {
            			if (plan.getName().equals("HMO w/HSA 2700/20 (LSV/3A5)")) {
            				rxPnn = findOrCreatePlan(client.getClientId(), "Advantage (3A5)", medicalPnns, planYear);
            			} else {
            				rxPnn = findOrCreatePlan(client.getClientId(), "Advantage (4PJ)", medicalPnns, planYear);
            			}
            		} else {
            			if (!column(rxCol).value().equals("N/A")) {
            				String rxPlanName = null;
                        	if (column(rxCol).value().equalsIgnoreCase("Advantage")) {
                        		if (plan.getPlanType().equals(Constants.PPO)) {
                        			rxPlanName = "Advantage (242)";
                        		} else if (plan.getPlanType().equals(Constants.HSA)) {
                        			rxPlanName = "Advantage (0C2)";
                        		}
                        	} else if (column(rxCol).value().equalsIgnoreCase("Access")) {
                        		if (plan.getPlanType().equals(Constants.PPO)) {
                        			rxPlanName = "Access (242)";
                        		} else if (plan.getPlanType().equals(Constants.HSA)) {
                        			rxPlanName = "Access (0C2)";
                        		}
                        	}
                        	rxPnn = findOrCreatePlan(client.getClientId(), rxPlanName, medicalPnns, planYear);
                    	}
            		}

                	rates.rxPnn = rxPnn;
                	clientData.products.put(PlanCategory.MEDICAL, rates);
                }
			} 
            if (!column(dentalCol).value().equals("N/A")) {
            	PlanNameByNetwork plan = findOrCreatePlan(client.getClientId(), column(dentalCol).value(), dentalAndVisionPnns, planYear);
            	CLSACLientData.ClientRates rates = clientData.new ClientRates();
            	rates.pnn = plan;
            	rates.tier1Enrollment = parseLongOrDefault(column(dentalCol + 1).value());
            	rates.tier2Enrollment = parseLongOrDefault(column(dentalCol + 2).value());
            	rates.tier3Enrollment = parseLongOrDefault(column(dentalCol + 3).value());
            	rates.tier4Enrollment = parseLongOrDefault(column(dentalCol + 4).value());
            	rates.tier1 = parseFloatOrDefault(column(dentalCol + 5).value());
            	rates.tier2 = parseFloatOrDefault(column(dentalCol + 6).value());
            	rates.tier3 = parseFloatOrDefault(column(dentalCol + 7).value());
            	rates.tier4 = parseFloatOrDefault(column(dentalCol + 8).value());
            	clientData.products.put(PlanCategory.DENTAL, rates);
            	String region = column(3).value();
            	// convert "Region N" to "N"
            	clientData.dentalRegion = region.split(" ")[1];
                clientData.dentalEligible = column(4).value();
            }
            if (!column(visionCol).value().equals("N/A")) {
            	PlanNameByNetwork plan = findOrCreatePlan(client.getClientId(), column(visionCol).value(), dentalAndVisionPnns, planYear);
            	CLSACLientData.ClientRates rates = clientData.new ClientRates();
            	rates.pnn = plan;
            	rates.tier1Enrollment = parseLongOrDefault(column(visionCol + 1).value());
            	rates.tier2Enrollment = parseLongOrDefault(column(visionCol + 2).value());
            	rates.tier3Enrollment = parseLongOrDefault(column(visionCol + 3).value());
            	rates.tier4Enrollment = parseLongOrDefault(column(visionCol + 4).value());
            	rates.tier1 = parseFloatOrDefault(column(visionCol + 5).value());
            	rates.tier2 = parseFloatOrDefault(column(visionCol + 6).value());
            	rates.tier3 = parseFloatOrDefault(column(visionCol + 7).value());
            	rates.tier4 = parseFloatOrDefault(column(visionCol + 8).value());
            	clientData.products.put(PlanCategory.VISION, rates);
            	String region = column(5).value();
            	// convert "Region N" to "N"
            	clientData.visionRegion = region.split(" ")[1];
                clientData.visionEligible = column(6).value();
            }
            if (!column(lifeCol).value().equals("N/A")) {
            	AncillaryPlan plan = findOrCreateAncillaryPlan(client.getClientId(), PlanCategory.LIFE, 
            			column(lifeCol).value(), ancillaryPlans, planYear);  	
            	BasicRate rates = (BasicRate) plan.getRates();
            	rates.setVolume(parseDoubleOrDefault(column(lifeCol + 1).value()));
            	rates.setCurrentLife(parseFloatOrDefault(column(lifeCol + 2).value()));
            	rates.setCurrentADD(parseFloatOrDefault(column(lifeCol + 3).value()));
            	ancillaryRateRepository.save(rates);
            	clientData.ancillary.put(PlanCategory.LIFE, plan);
            }
            if (!column(volLifeCol).value().equals("N/A")) {
            	AncillaryPlan plan = findOrCreateAncillaryPlan(client.getClientId(), PlanCategory.VOL_LIFE, 
            			column(volLifeCol).value(), ancillaryPlans, planYear);  	
            	VoluntaryRate rates = (VoluntaryRate) plan.getRates();
            	// Per Yusuf, set vol_life volume to 0
            	rates.setVolume(0);
            	rates.setRateEmpADD(parseFloatOrDefault(column(empADDCol).value()));
            	rates.setRateSpouseADD(parseFloatOrDefault(column(spouseADDCol).value()));
            	rates.setRateChildLife(parseFloatOrDefault(column(childADDCol).value()));
            	rates.setRateChildADD(parseFloatOrDefault(column(childLifeCol).value()));
            	
            	// do not update ages every upload run
            	// NOTE: if file was changed, clean up the ancillary_rate_age table and run upload
            	if (rates.getAges().isEmpty()) {
	            	// NOTE: hardcode, because this is one-off parser
	            	int volAgeStartCol = volLifeCol + 1;
	            	int volAgeEndCol = empADDCol - 1;
	            	AncillaryRateAge ageRate = new AncillaryRateAge();
	            	ageRate.setAncillaryRate(rates);
	        		ageRate.setFrom(0);
	        		ageRate.setTo(24);
	        		ageRate.setCurrentEmp(parseFloatOrDefault(column(volAgeStartCol).value()));
	        		rates.getAges().add(ageRate);
	            	int age = 24;
	            	for (int ageCol = volAgeStartCol + 1; ageCol < volAgeEndCol; ageCol++) {
	            		// <25	25-29	30-34	35-39	40-44	45-49	50-54	55-59	60-64	65-69	70-74	75+
	            		ageRate = new AncillaryRateAge();
	            		ageRate.setAncillaryRate(rates);
	            		ageRate.setFrom(age + 1);
	            		ageRate.setTo(age + 5);
	            		ageRate.setCurrentEmp(parseFloatOrDefault(column(ageCol).value()));
	            		rates.getAges().add(ageRate);
	            		age += 5;
					}
            	}
            	ancillaryRateRepository.save(rates);
            	clientData.ancillary.put(PlanCategory.VOL_LIFE, plan);
            	
            }
            if (!column(stdCol).value().equals("N/A")) {
            	AncillaryPlan plan = findOrCreateAncillaryPlan(client.getClientId(), PlanCategory.STD, 
            			column(stdCol).value(), ancillaryPlans, planYear);  	
            	BasicRate rates = (BasicRate) plan.getRates();
            	rates.setVolume(parseDoubleOrDefault(column(stdCol + 1).value()));
            	rates.setCurrentSL(parseFloatOrDefault(column(stdCol + 2).value()));
            	ancillaryRateRepository.save(rates);
            	clientData.ancillary.put(PlanCategory.STD, plan);
            }
            if (!column(ltdCol).value().equals("N/A")) {
            	AncillaryPlan plan = findOrCreateAncillaryPlan(client.getClientId(), PlanCategory.LTD, 
            			column(ltdCol).value(), ancillaryPlans, planYear);  	
            	BasicRate rates = (BasicRate) plan.getRates();
            	rates.setVolume(parseDoubleOrDefault(column(ltdCol + 1).value()));
            	rates.setCurrentSL(parseFloatOrDefault(column(ltdCol + 2).value()));
            	ancillaryRateRepository.save(rates);
            	clientData.ancillary.put(PlanCategory.LTD, plan);
            }
            
            
            result.put(client.getClientId(), clientData);       
        }
    	return result;
    }
    
    private AncillaryPlan findOrCreateAncillaryPlan(Long clientId, PlanCategory planCategory, String planName, 
    		Map<String, ProgramToAncillaryPlan> planToProgram, int planYear) {
    	
    	String key = planName + '_' + planYear;
    	ProgramToAncillaryPlan plan = planToProgram.get(key);
    	if (plan == null) {
    		throw new BaseException("Ancillary plan not found: " + planName + ", year=" + planYear);
    	}
    	AncillaryPlan clsaTemplate = plan.getAncillaryPlan();
    	
    	List<ClientPlan> existingPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
    			clientId, planCategory.getPlanTypes()).stream()
    			.filter(cp -> cp.getAncillaryPlan().getCarrier().getCarrierId().equals(clsaTemplate.getCarrier().getCarrierId())
    				&& cp.getAncillaryPlan().getPlanYear() == planYear
    				&& cp.getAncillaryPlan().getPlanName().equals(planName))
    			.collect(Collectors.toList());
    	if (existingPlans.isEmpty()) {
	    	// NOTE do not use original CLSA program plans! Create Copy
	    	AncillaryPlan planCopy = clsaTemplate.copy();
	    	ancillaryPlanRepository.save(planCopy);
    		return planCopy;
    	} else if (existingPlans.size() > 1) {
    		throw new BaseException("More one client plan found: " + planName + ", year=" + planYear);
    	} else {
    		return existingPlans.get(0).getAncillaryPlan();
    	}
    }
    
    private PlanNameByNetwork findOrCreatePlan(Long clientId, String planName, Map<String, ProgramToPnn> planToProgramPnn, int planYear) {
    	ProgramToPnn p2pnn = planToProgramPnn.get(planName);
    	if (p2pnn == null) {
    		throw new BaseException("Plan not found: " + planName + ", year=" + planYear);
    	}
      	
      	PlanNameByNetwork clsaTemplate = p2pnn.getPnn();
      		
      	List<PlanNameByNetwork> existingPnns = planNameByNetworkRepository.findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
      			clsaTemplate.getNetwork(), clsaTemplate.getName(), clsaTemplate.getPlanType(), planYear, clientId, false);
    	if (existingPnns.isEmpty()) {
    		// NOTE do not use original CLSA program plans! Create Copy AND set copy.setClientId(clientId)
    		PlanNameByNetwork pnnCopy = clsaTemplate.copy();
    		Plan plan = planRepository.save(pnnCopy.getPlan());
          	for (Benefit ben : plan.getBenefits()) {
                //ben.setPlan(plan);
                benefitRepository.save(ben);
            }
          	pnnCopy.setClientId(clientId);
          	// pnnCopy.setPlan(plan); // already has copy: see the pnn.copy() implementation
            return planNameByNetworkRepository.save(pnnCopy);
    	} else if (existingPnns.size() > 1) {
    		throw new BaseException("More one PlanNameByNetwork found: " + planName + ", year=" + planYear);
    	} else {
    		return existingPnns.get(0);
    	}
    }

    protected static double parseDoubleOrDefault(String value) {
        return
            isBlank(value) ? 0.0 :
                Double.parseDouble(
                    value.trim()
                    .replace("$", "")
                    .replace(",", "")
                );
    }
    
    protected static Long parseLongOrDefault(String value) {
        return isBlank(value) ? 0L : Long.parseLong(value.trim());
    }

    private boolean getNextRow() {
        if (rowIterator.hasNext()) {
            row = rowIterator.next();
            return true;
        }
        return false;
    }

    private boolean getNextCell() {
        if (cellIterator.hasNext()) {
            cell = cellIterator.next();
            return true;
        }
        return false;
    }

    private CLSATrustClientParser column(int index) {
        if (index < 0) {
            lastValue = "N/A";
        } else {
            Cell cell = row.getCell(index);
            if(cell == null) {
                lastValue = "";
            } else {
                lastValue = cell.getStringCellValue().replace("\"", "").trim();
                if (NOT_AVAILABLE.matcher(lastValue).matches()) {
                    lastValue = "N/A";
                };
            }
        }
        return this;
    }

    private CLSATrustClientParser column(Cell cell) {
        if(cell == null) {
            lastCellValue = "";
        } else {
            lastCellValue = cell.getStringCellValue().replace("\"", "").trim();
            if (NOT_AVAILABLE.matcher(lastCellValue).matches()) {
                lastCellValue = "N/A";
            };
        }
        return this;
    }

    private CLSATrustClientParser column(int startIndex, int endIndex) {
        StringBuilder sb = new StringBuilder();
        for (int index=startIndex;index<=endIndex;index++) {
            Cell cell = row.getCell(index);
            if(cell != null) {
                sb.append(cell.getStringCellValue().replace("\"", "").trim());
            }
        }
        lastValue = sb.toString();
        return this;
    }

    private boolean matches(Pattern pattern) {
        return pattern.matcher(lastValue).matches();
    }

    private String value() {
        return lastValue;
    }

    private int findColumnIndex(int startIndex, int endIndex, Pattern name) {
        for (int ind=startIndex;ind<=endIndex;ind++) {
            //print(column(ind).value());
            if (column(ind).matches(name)) {
                return ind;
            }
        }
        return -1;
    }

    private String extract(Pattern pattern) {
        Matcher m = pattern.matcher(lastValue);
        if (m.find()) {
            return m.group(1);
        }
        return lastValue;
    }

    private String cellValue() {
        return lastCellValue;
    }
}

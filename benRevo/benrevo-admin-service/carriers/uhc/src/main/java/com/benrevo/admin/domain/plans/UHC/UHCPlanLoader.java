package com.benrevo.admin.domain.plans.UHC;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.benrevo.data.persistence.dao.BaseDao;
import com.benrevo.data.persistence.dao.BenefitNameDao;
import com.benrevo.data.persistence.dao.CarrierDao;
import com.benrevo.data.persistence.dao.PlanDao;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;


/**
 * @deprecated  There is a generic plan loader in com.benrevo.data.loaders.coreapplication.plan that will be used
 * 				to load plans from all carriers
 * 				DO NOT REMOVE YET
 */
@Deprecated
public class UHCPlanLoader {

	private static final Logger LOGGER = LogManager.getLogger(UHCPlanLoader.class);
	private static CarrierDao carrierDao;
	private static PlanDao planDao;
	private static BenefitNameDao benefitNameDao;
	private static Network selectNetwork, coreNetwork, choiceNetwork, navigate1, signature, advantage, focus, alliance;
	private static List<BenefitName> benefitNames;
	private static DataFormatter formatter = new DataFormatter();

	public static void main(String... args) throws Exception {
		String currDir = Paths.get("").toAbsolutePath().toString();
		File myFile = new File(currDir + "/data/carrierPlans/UHC/2017/UHC_2017.xlsx");
        FileInputStream fis = new FileInputStream(myFile);
		UHCPlanLoader loader = new UHCPlanLoader();
		loader.run(fis);
	}

	public void run(InputStream fis) throws Exception{
		// Finds the workbook instance for XLSX file
		XSSFWorkbook myWorkBook = new XSSFWorkbook (fis);

		carrierDao = new CarrierDao();
		planDao = new PlanDao();
		benefitNameDao = new BenefitNameDao();
		BaseDao.beginTransaction();

		try {
			Carrier carrier = carrierDao.getCarrierByName("UHC");
			List<Network> allNetworks = planDao.getAllNetworks();
			//List<Network> allNetworks = planDao.getAllNetworksForCarrier(carrier);

			if(null == allNetworks || 0 == allNetworks.size()) {
				System.err.print("No networks found in DB, that should be loaded as part of the static data.");
				BaseDao.flushAndClose();
				System.exit(1);
			}

			Map<Long, Network> networkIdMap = new HashMap<Long, Network>();
			for (Network npd : allNetworks) {
				networkIdMap.put(npd.getNetworkId(), npd);
				if (npd.getName().equals("Select Network")) selectNetwork = npd;
				if (npd.getName().equals("Core Network")) coreNetwork = npd;
				if (npd.getName().equals("Choice Network")) choiceNetwork = npd;
				if (npd.getName().equals("Navigate1")) navigate1 = npd;
				if (npd.getName().equals("Signature")) signature = npd;
				if (npd.getName().equals("Advantage")) advantage = npd;
				if (npd.getName().equals("Focus")) focus = npd;
				if (npd.getName().equals("Alliance")) alliance = npd;
			}
			benefitNames = benefitNameDao.getAllBenefitNames();

			// Walk through sheets 1 and 2
			for (int sheet=0; sheet < 2; sheet++) {
				String planType = "UNKNOWN";
				if (sheet == 0) planType = "PPO";
				if (sheet == 1) planType = "HMO";

				XSSFSheet mySheet = myWorkBook.getSheetAt(sheet);

				// Get iterator to all the rows in current sheet
				Iterator<Row> rowIterator = mySheet.iterator();

				// Traversing over each row of XLSX file
				int rowNum=0;
				while (rowIterator.hasNext()) {
					rowNum++;

					PlanDetails planDetails = getPlanDetails(rowNum, planType, rowIterator.next());
					if (planDetails == null) continue;

					// Create Plan
					Plan plan = new Plan(carrier, planDetails.getCalculatedName(), planType);
					BaseDao.persist(plan);

					// Create PlanNameByNetwork
					for (Long networkId : planDetails.getPlanNamesByNetwork().keySet()) {
						String name = planDetails.getPlanNamesByNetwork().get(networkId);
						PlanNameByNetwork pnn = new PlanNameByNetwork(plan, networkIdMap.get(networkId), name, planType);
						BaseDao.persist(pnn);
					}

					// Create Benefits
					for (Benefit b : planDetails.getBenefits()) {
						b.setPlan(plan);
						BaseDao.persist(b);
					}
				}
			}
			BaseDao.commit();
			System.out.print("UHC Plans have been loaded.");
		} catch (Exception e) {
			BaseDao.rollback();
			LOGGER.error("An error occurred while loading UHC plans", e);
		} finally {
			myWorkBook.close();
		}
	}

	private static PlanDetails getPlanDetails(int rowNum, String planType, Row row) throws Exception {
		if (!isValidRow(rowNum, planType)) return null;

		PlanDetails details = new PlanDetails();
		if (planType.equals("PPO")) {
			// Network names
			details.addPlanNameByNetwork(selectNetwork.getNetworkId(), getString(row, 1));
			details.addPlanNameByNetwork(coreNetwork.getNetworkId(), getString(row, 2));
			details.addPlanNameByNetwork(choiceNetwork.getNetworkId(), getString(row, 3));
			details.addPlanNameByNetwork(navigate1.getNetworkId(), getString(row, 4));

			// Benefits
			details.addBenefit(benefitNames, "CO_INSURANCE", "IN", getString(row, 5));
			details.addBenefit(benefitNames, "CO_INSURANCE", "OUT", getString(row, 6));
			details.addBenefit(benefitNames, "CALENDAR_YEAR_DEDUCTIBLE", "IN", getString(row, 7));
			details.addBenefit(benefitNames, "CALENDAR_YEAR_DEDUCTIBLE", "OUT", getString(row, 8));
			details.addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", getString(row, 9));
			details.addBenefit(benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", getString(row, 10));
			details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", getString(row, 11));
			details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", getString(row, 12));
			details.addBenefit(benefitNames, "PCP", "IN", getString(row, 13));
			details.addBenefit(benefitNames, "SPECIALIST", "IN", getString(row, 14));
			details.addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", getString(row, 15));
			details.addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", getString(row, 16));
			details.addBenefit(benefitNames, "IP_PER-OCCURENCE_DEDUCTIBLE", "IN", getString(row, 17));
		} else if (planType.equals("HMO")) {
			// Network names
			details.addPlanNameByNetwork(signature.getNetworkId(), getString(row, 1));
			details.addPlanNameByNetwork(advantage.getNetworkId(), getString(row, 2));
			details.addPlanNameByNetwork(focus.getNetworkId(), getString(row, 3));
			details.addPlanNameByNetwork(alliance.getNetworkId(), getString(row, 4));

			// Benefits
			details.addBenefit(benefitNames, "CALENDAR_YEAR_DEDUCTIBLE", "IN", getString(row, 5));
			details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", getString(row, 6));
			details.addBenefit(benefitNames, "PCP", "IN", getString(row, 7));
			details.addBenefit(benefitNames, "SPECIALIST", "IN", getString(row, 8));
			details.addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", getString(row, 9));
			details.addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", getString(row, 10));
			details.addBenefit(benefitNames, "IP_COPAY_MAX", "IN", getString(row, 11));
			details.addBenefit(benefitNames, "IP_COPAY_TYPE", "IN", getString(row, 12));
			details.addBenefit(benefitNames, "OUTPATIENT_SURGERY", "IN", getString(row, 13));
			details.addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", getString(row, 14));
			details.addBenefit(benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", getString(row, 15));
		}
		return details;
	}

	private static String getString(Row row, int col) {
		return formatter.formatCellValue(row.getCell(col));
	}

	private static boolean isValidRow(int i, String type) {
		if (type.equals("PPO")) {
			return between(i, 7, 21) || between(i, 23, 75) || between(i, 77, 132) || between(i, 134, 164) || between(i, 166, 218) ||
					between(i, 220, 223) || between(i, 225, 225) || between(i, 227, 227) || between(i, 229, 233);
		} else if (type.equals("HMO")) {
			return between(i, 6, 81) || between(i, 83, 84) || between(i, 86, 88);
		}
		return false;
	}

	private static boolean between(int i, int j, int k) {
		return i >= j && i <= k;
	}
}

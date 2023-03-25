package com.benefit.data.loader;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.security.InvalidParameterException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.benefit.data.compare.PlanComparer;
import com.benefit.data.model.Benefit;
import com.benefit.data.model.carrier.Plan;
import com.benefit.data.model.factory.BenefitFactory;
import com.benefit.data.model.factory.NetworkFactory;

public class BenefitMemoryLoader {

    //HMO FILES
    public static String file1 = "/data/carrierPlans/HMO/CignaHMO.txt";
    public static String file2 = "/data/carrierPlans/HMO/BlueShieldHMO.txt";
    public static String file3 = "/data/carrierPlans/HMO/BlueCrossHMO.txt";
    public static String file4 = "/data/carrierPlans/HMO/Aetna51-99HMO.txt";
    public static String file5 = "/data/carrierPlans/HMO/Aetna100+HMO.txt";
    public static String file6 = "/data/carrierPlans/HMO/HealthNet51-100HMO.txt";
    public static String file7 = "/data/carrierPlans/HMO/HealthNet100+HMO.txt";
    public static String file8 = "/data/carrierPlans/HMO/UHC51-99HMO.txt";
    public static String file9 = "/data/carrierPlans/HMO/UHC100+HMO.txt";

    private static String[] HMO_files = new String[]{file1, file2, file3, file4, file5, file6, file7, file8, file9};

    //PPO FILES
    public static String file101 = "/data/carrierPlans/PPO/CignaPPO.txt";
    public static String file102 = "/data/carrierPlans/PPO/AnthemPPO.txt";
    public static String file103 = "/data/carrierPlans/PPO/BlueShieldPPO.txt";
    public static String file104 = "/data/carrierPlans/PPO/Healthnet100+PPO.txt";
    public static String file105 = "/data/carrierPlans/PPO/UHC100+PPO.txt";
    //public static String file106s = "/data/carrierPlans/PPO/AetnaPPO.txt";
    //forgot, but leaving out because static data does not expect this to be in the db, will mess up order for below plans

    private static String[] PPO_files = new String[]{file101, file102, file103, file104, file105};

    //DENTAL FILES
    public static String file200 = "/data/carrierPlans/DEPO/AnthemDEPO.txt";
    public static String file201 = "/data/carrierPlans/DEPO/CignaDEPO.txt";
    private static String[] DEPO_files = new String[]{file200, file201};

    public static String file210 = "/data/carrierPlans/DPPO/AnthemDPPO.txt";
    public static String file211 = "/data/carrierPlans/DPPO/MetLifeDPPO.txt";
    public static String file212 = "/data/carrierPlans/DPPO/PrincipalPPO.txt";
    public static String file213 = "/data/carrierPlans/DPPO/GuardianDPPO.txt";
    public static String file214 = "/data/carrierPlans/DPPO/CignaDPPO.txt";
    public static String file215 = "/data/carrierPlans/DPPO/DeltaDPPO.txt";
    public static String file216 = "/data/carrierPlans/DPPO/UCCIDPPO.txt";
    private static String[] DPPO_files = new String[]{file210, file211, file212, file213, file214, file215, file216};

    public static String file220 = "/data/carrierPlans/DHMO/AnthemDHMO.txt";
    public static String file221 = "/data/carrierPlans/DHMO/CignaDHMO.txt";
    public static String file222 = "/data/carrierPlans/DHMO/DeltaDHMO.txt";
    public static String file223 = "/data/carrierPlans/DHMO/GuardianDHMO.txt";
    public static String file224 = "/data/carrierPlans/DHMO/MetLifeDHMO.txt";
    public static String file225 = "/data/carrierPlans/DHMO/PrincipalDHMO.txt";
    public static String file226 = "/data/carrierPlans/DHMO/UCCIDHMO.txt";
    private static String[] DHMO_files = new String[]{file220, file221, file222, file223, file224, file225, file226};

    //Vision
    private static String file700 = "/data/carrierPlans/VISION/AnthemVISION.txt";
    public static String file701 = "/data/carrierPlans/VISION/CignaVISION.txt";
    public static String file702 = "/data/carrierPlans/VISION/GuardianVISION.txt";
    public static String file703 = "/data/carrierPlans/VISION/MetlifeVISION.txt";
    public static String file704 = "/data/carrierPlans/VISION/PrincipalVISION.txt";
    private static String[] VISION_files = new String[]{file700, file701, file702, file703, file704};

    //Life
    public static String file300 = "/data/carrierPlans/LIFE/GuardianLIFE.txt";
    public static String file301 = "/data/carrierPlans/LIFE/PrincipalLIFE.txt";
    public static String file302 = "/data/carrierPlans/LIFE/MetLifeLIFE.txt";
    public static String file303 = "/data/carrierPlans/LIFE/CignaLIFE.txt";
    private static String[] LIFE_files = new String[]{file300, file301, file302, file303};

    //Voluntary Life
    public static String file400 = "/data/carrierPlans/VOL_LIFE/AnthemVOLLIFE.txt";
    public static String file401 = "/data/carrierPlans/VOL_LIFE/CignaVOLLIFE.txt";
    public static String file402 = "/data/carrierPlans/VOL_LIFE/GuardianVOLLIFE.txt";
    public static String file403 = "/data/carrierPlans/VOL_LIFE/MetlifeVOLLIFE.txt";
    public static String file404 = "/data/carrierPlans/VOL_LIFE/PrincipalVOLLIFE.txt";
    private static String[] VOL_LIFE_files = new String[]{file400, file401, file402, file403, file404};

    //LTD
    public static String file500 = "/data/carrierPlans/LTD/AnthemLTD.txt";
    public static String file501 = "/data/carrierPlans/LTD/CignaLTD.txt";
    public static String file502 = "/data/carrierPlans/LTD/GuardianLTD.txt";
    public static String file503 = "/data/carrierPlans/LTD/MetlifeLTD.txt";
    public static String file504 = "/data/carrierPlans/LTD/PrincipalLTD.txt";
    private static String[] LTD_files = new String[]{file500, file501, file502, file503, file504};

    //STD
    public static String file600 = "/data/carrierPlans/STD/AnthemSTD.txt";
    public static String file601 = "/data/carrierPlans/STD/CignaSTD.txt";
    public static String file602 = "/data/carrierPlans/STD/GuardianSTD.txt";
    public static String file603 = "/data/carrierPlans/STD/MetlifeSTD.txt";
    public static String file604 = "/data/carrierPlans/STD/PrincipalSTD.txt";
    private static String[] STD_files = new String[]{file600, file601, file602, file603, file604};

    public static HashMap<String, List<Benefit>> carrierPlanMap = new HashMap<String, List<Benefit>>();


    public static void main(String[] args) throws IOException, SQLException {

        for (String file : HMO_files) {

            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(file, "HMO");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }

        for (String PPOFile : PPO_files) {

            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(PPOFile, "PPO");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }

        for (String DEPOFile : DEPO_files) {

            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(DEPOFile, "DEPO");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }


        for (String DPPOFile : DPPO_files) {

            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(DPPOFile, "DPPO");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }


        for (String DHMOFile : DHMO_files) {
            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(DHMOFile, "DHMO");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }


        for (String VISIONFile : VISION_files) {
            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(VISIONFile, "VISION");
            saveMemoryToDB();
        }


        for (String LIFEFile : LIFE_files) {

            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(LIFEFile, "LIFE");
            //printMemory();

            saveMemoryToDB();
            //compareFirstWithOthers();
            //printMemory();
        }

        for (String VOLLIFEFile : VOL_LIFE_files) {
            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(VOLLIFEFile, "VOLLIFE");
            saveMemoryToDB();
        }

        for (String LTDFile : LTD_files) {
            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(LTDFile, "LTD");
            saveMemoryToDB();
        }

        for (String STDFile : STD_files) {
            carrierPlanMap = new HashMap<String, List<Benefit>>();
            readFileToMemory(STDFile, "STD");
            saveMemoryToDB();
        }

    }

    private static void saveMemoryToDB() {

        System.out.println("START: Loading benefits for plans.");
        BenefitDBLoader db = new BenefitDBLoader();

        Set<String> keys = carrierPlanMap.keySet();
        Iterator<String> keyIter = keys.iterator();
        while (keyIter.hasNext()) {
            String plan = keyIter.next();
            List<Benefit> benefits = (List<Benefit>) carrierPlanMap.get(plan);
            System.out.println("Loading " + benefits.size() + " benefits for plan_id: " + ((Benefit) benefits.get(0)).getPlanId());
            db.insertBenefitList(benefits);
        }
        System.out.println("END: Loading benefits for plans.");
    }

    private static void compareFirstWithOthers() {
        PlanComparer planComparer = new PlanComparer();
        Set<String> keys = carrierPlanMap.keySet();
        Iterator<String> it = keys.iterator();

        String key = it.next();
        List<Benefit> list = (List<Benefit>) carrierPlanMap.get(key);

        Plan base = new Plan();
        base.setBenefits(list);
        System.out.println("Comparing all others to " + base);

        Plan compare;
        while (it.hasNext()) {
            key = it.next();
            list = (List<Benefit>) carrierPlanMap.get(key);

            compare = new Plan();
            compare.setBenefits(list);
            System.out.println("=== " + compare + " ===");

            planComparer.comparePlans(base, compare);
        }
    }

    public static void readFileToMemory(String fileName, String networkType) throws IOException, SQLException {
        System.out.println("-------- Loading file to memory ------------");
        String currDir = Paths.get("").toAbsolutePath().toString();

        BufferedReader br = new BufferedReader(new FileReader(currDir + fileName));
        BenefitFactory bf = BenefitFactory.getInstance();
        NetworkFactory nf = NetworkFactory.getInstance();

        try {
            String header = br.readLine();
            System.out.println("HEADER:" + header);
            String head[] = header.split("\t");
            ArrayList<String> networks = new ArrayList<String>();

            for (int i = 6; i < head.length; i++) {
                System.out.println("NETWORK: " + head[i]);
                networks.add(head[i]);
            }

            String currentMash = "";
            int planId = -1;
            String line = br.readLine();

            BenefitDBLoader db = new BenefitDBLoader();

            while (line != null) {

                //Cigna,A,IN,Individual OOP Limit,1000,Includes all copays except Rx len:6
                //Carrier,Plan,IN/OON,Benefit name,benefit value,value detail,HMO Full Network,HMO Select Network,HMO Value Network
                String split[] = line.split("\t");

                String carrier = split[0];
                String inOutNetwork = split.length > 2 ? split[2] : "";
                String benefitName = split.length > 3 ? split[3] : "";
                String value = split.length > 4 ? split[4] : "";
                String restriction = split.length > 5 ? split[5] : "";

                //check if we are still on the same carrier by looking at all the plan names by network
                //create up a mash up that will tell us if we are a new character.
                String mash = "|";
                for (int i = 6; i < split.length; i++) {
                    mash += split[i].trim() + "|";
                }

                if (!currentMash.equals(mash)) {


                    //add GETPLAN by carrier and mash
                    planId = db.getPlan(carrier, mash, networkType);
                    if (planId < 0) {
                        planId = db.createPlan(carrier, mash, networkType);
                        System.out.println("New(Plan) - PlanId " + planId + "  Mash: " + mash + " PlanType: " + networkType);

                        if (planId < 0) {
                            return;
                        }

                        //associate the new plan with the networks with names
                        for (int i = 6; i < split.length; i++) {
                            String planName = split[i];
                            if (null != planName && planName.trim().length() > 0) {
                                db.createPlanNameForNetwork(carrier, planId, planName, networks.get(i - 6), networkType);
                                System.out.println("New(PlanName/Network) - Carrier: " + carrier + " network: " + networks.get(i - 6) + " planName: " + planName + " PlanType: " + networkType);
                            }
                        }
                    }
                    currentMash = mash;

                }

                //print the line read from file
                for (String s : split) {
                    System.out.print(s + ",");
                }
                System.out.println("");

                if (-1 == planId) {
                    throw new InvalidParameterException("CarrierId sould not be equal to -1");
                }
                Benefit b = bf.createBenefit(planId, inOutNetwork, benefitName, value, restriction);
                storeInMemory(carrier, b);
                line = br.readLine();
            }

            db.close();

        } finally {
            br.close();
            System.out.println("-------- DONE: Loading file to memory ------------");
        }
    }

    /**
     * Stores the benefit by carrier and plan.
     *
     * @param b Benefit to be stored in memory
     */
    private static void storeInMemory(String carrierName, Benefit b) {
        List<Benefit> list;
        String key = carrierName + "_" + b.getPlanId();
        if (carrierPlanMap.containsKey(key)) {
            list = (List<Benefit>) carrierPlanMap.get(key);
        } else {
            list = new ArrayList<Benefit>();
            carrierPlanMap.put(key, list);
        }
        list.add(b);
    }

    private static void printMemory() {
        System.out.println("-------- Printing memory ------------");

        Set<String> keys = carrierPlanMap.keySet();
        Iterator<String> it = keys.iterator();
        while (it.hasNext()) {
            String key = it.next();
            System.out.println("=== " + key + " ===");
            List<Benefit> list = (List<Benefit>) carrierPlanMap.get(key);
            for (Benefit b : list) {
                System.out.println(b);
            }
        }
        System.out.println("-------- DONE: Printing memory ------------");
    }
}

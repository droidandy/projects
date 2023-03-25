package com.benefit.data.util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import com.benefit.data.loader.BenefitDBLoader;

public class BenefitValidator {

    private static BenefitValidator instance = null;
    public String rawBenefits = "/Users/ositapara/Documents/workspace/BenefitDataLoader/data/Cigna.txt";
    public String benefitNameFile = "/Users/ositapara/Documents/workspace/BenefitDataLoader/data/BenefitNames.txt";
    public HashMap<String, String> benefitNames = new HashMap<String, String>();
    private final String EMPTY = "";

    private BenefitValidator() {
        loadBenefitsToDB();
    }

    private void loadBenefitsToDB() {
        BenefitDBLoader db = new BenefitDBLoader();
        try {
            BufferedReader br = new BufferedReader(new FileReader(benefitNameFile));

            String line = null;
            line = br.readLine();

            while (line != null) {
                String split[] = line.trim().split(",");
                System.out.println(line);
                db.insertBenefitName(split[0], split[1], split[2]);
                line = br.readLine();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            db.close();
        }
    }

    private void createBenefitNames() {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(rawBenefits));

            String line = br.readLine();
            while (line != null) {
                String split[] = line.split("\t");
                String benefitName = split.length > 3 ? split[3] : "";
                benefitName = benefitName.trim();

                if (!benefitNames.containsKey(benefitName.toLowerCase())) {
                    benefitNames.put(benefitName.toLowerCase(), benefitName);
                } else {
                    //Do nothing we already have it
                }
                line = br.readLine();
            }

            Set<String> benefits = benefitNames.keySet();
            Iterator<String> it = benefits.iterator();
            String bn;
            String databasebn;
            String read;
            while (it.hasNext()) {
                bn = it.next();
                databasebn = bn.toUpperCase().replace(" ", "_").replace("/", "_").replace("-", "_");
                read = benefitNames.get(bn);
                System.out.println(databasebn + "," + read);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                br.close();
            } catch (IOException e) {
                //do nothing
                System.out.println("Error closing file: " + rawBenefits + ". " + e.getMessage());
            }
        }
    }

    public static BenefitValidator getInstance() {
        if (null == instance) {
            instance = new BenefitValidator();
        }
        return instance;
    }

    public boolean isValidName(String name) {
        return false;
    }
}

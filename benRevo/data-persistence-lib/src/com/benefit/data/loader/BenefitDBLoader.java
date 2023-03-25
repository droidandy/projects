package com.benefit.data.loader;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.benefit.data.model.Benefit;
import com.benefit.data.model.carrier.BenefitName;
import com.benefit.data.model.carrier.Carrier;
import com.benefit.data.model.carrier.Network;

public class BenefitDBLoader {

    private Connection connection = null;

    public BenefitDBLoader() {

        System.out.println("-------- MySQL JDBC Connection Testing ------------");

        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println("Where is your MySQL JDBC Driver?");
            e.printStackTrace();
            return;
        }

        Statement st = null;
        ResultSet rs = null;

        String url = "jdbc:mysql://localhost/bdw_dev";
        //String url = "jdbc:mysql://aa27sh02jhbxib.c46gvsyls2ua.us-west-2.rds.amazonaws.com:3306/bdw_dev"; //AWS DEV
        //String url = "jdbc:mysql://aa1k8p1mm25i6n.c46gvsyls2ua.us-west-2.rds.amazonaws.com:3306/bdw_dev"; //AWS STANDALONE

        String user = "sonata";
        String password = "s0n@t@smx";

        try {
            connection = DriverManager.getConnection(url, user, password);

        } catch (SQLException e) {
            System.out.println("Connection Failed! Check output console");
            e.printStackTrace();
            return;
        }

        if (connection != null) {
            System.out.println("Connected to Database");
        } else {
            System.out.println("Failed to make connection!");
        }

        try {
            st = connection.createStatement();
            rs = st.executeQuery("SELECT VERSION()");

            if (rs.next()) {
                // System.out.println(rs.getString(1));
            }

        } catch (SQLException e) {
            System.out.println("Failed select!");
        } finally {
            closeConnections(rs, st);
        }
    }

    public void insertBenefitName(String id, String name, String displayName) {

        PreparedStatement pst;
        try {
            pst = connection
                    .prepareStatement("INSERT INTO benefit_name (id, name, display_name) VALUES (?, ?, ?)");

            pst.setString(1, id);
            pst.setString(2, name);
            pst.setString(3, displayName);
            pst.executeUpdate();
            pst.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void insertBenefitList(List<Benefit> list) {
        Benefit benefit;
        for (int index = 0; index < list.size(); index++) {
            benefit = list.get(index);
            insertBenefit(benefit);
        }
    }

    public void insertBenefit(Benefit b) {
        insertBenefit(b.getPlanId(), b.getBenefitNameId(), b.getInOutNetwork(),
                b.getFormatStr(), b.getValue(), b.getRestriction());
    }

    public void insertBenefit(Integer planId, Integer benefitNameId,
                              String inOutNetwork, String format, int value, String restriction) {

        PreparedStatement pst;
        try {
            pst = connection.prepareStatement("INSERT INTO benefit (plan_id, benefit_name_id, in_out_network, format, value, restriction) VALUES (?, ?, ?, ?, ?, ?)");
            pst.setInt(1, planId);
            pst.setInt(2, benefitNameId);
            pst.setString(3, inOutNetwork);
            pst.setString(4, format);
            pst.setInt(5, value);
            pst.setString(6, restriction);

            pst.executeUpdate();
            pst.close();

        } catch (SQLException e) {
            System.err.println("Plan:" + planId + " Benefit:" + benefitNameId
                    + " Network:" + inOutNetwork + " Format:" + format
                    + " Value:" + value + " Restriction:" + restriction);
            e.printStackTrace();
        } finally {
        }
    }

    public List<Carrier> getCarriers() {
        ArrayList<Carrier> carriers = new ArrayList<Carrier>();
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = connection.createStatement();
            rs = stmt.executeQuery("SELECT * FROM carrier");

            while (rs.next()) {
                Integer id = rs.getInt("id");
                String name = rs.getString("name");
                String displayName = rs.getString("display_name");
                carriers.add(new Carrier(id, name, displayName));
            }
        } catch (SQLException e) {
            closeConnections(rs, stmt);
            e.printStackTrace();
        }

        return carriers;
    }

    /**
     * @return
     */
    public List<BenefitName> getBenefitNames() {
        ArrayList<BenefitName> benefitNames = new ArrayList<BenefitName>();
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = connection.createStatement();
            rs = stmt.executeQuery("SELECT * FROM benefit_name");

            while (rs.next()) {
                Integer id = rs.getInt("id");
                String name = rs.getString("name");
                String displayName = rs.getString("display_name");
                benefitNames.add(new BenefitName(id, name, displayName));
            }
        } catch (SQLException e) {
            closeConnections(rs, stmt);
            e.printStackTrace();
        }
        return benefitNames;
    }

    public int getPlan(String carrierName, String name, String planType) {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int planId = -1;
        try {
            pst = connection
                    .prepareStatement("SELECT p.id FROM plan p, carrier c WHERE c.id = p.carrier_id "
                            + "AND p.name = ? "
                            + "AND c.display_name = ? "
                            + "AND p.plan_type = ?");
            pst.setString(1, name);
            pst.setString(2, carrierName);
            pst.setString(3, planType);
            rs = pst.executeQuery();

            if (rs.next()) {
                planId = rs.getInt("id");
            }
        } catch (SQLException e) {
            System.out.println("GetPlan: Could not get Plan for " + carrierName
                    + " with name " + name);
            e.printStackTrace();
        } finally {
            closeConnections(rs, pst);
        }
        return planId;
    }

    public int createPlan(String carrierName, String name, String planType) {
        PreparedStatement pst = null;
        ResultSet rs = null;
        int insertId = -1;
        try {
            pst = connection
                    .prepareStatement(
                            "INSERT INTO plan (carrier_id, name, plan_type) VALUES ((SELECT id FROM carrier where display_name = ?),?,?)",
                            Statement.RETURN_GENERATED_KEYS);
            pst.setString(1, carrierName);
            pst.setString(2, name);
            pst.setString(3, planType);
            pst.executeUpdate();

            rs = pst.getGeneratedKeys();
            if (rs != null && rs.next()) {
                insertId = rs.getInt(1);
            }
            pst.close();

        } catch (SQLException e) {
            System.out.println("CreatePlan: Could not create Plan for "
                    + carrierName + " with name " + name);
            e.printStackTrace();
        } finally {
            closeConnections(rs, pst);
        }
        return insertId;
    }

    /**
     * @param carrierId
     * @param planName
     * @param string
     */
    public void createPlanNameForNetwork(String carrierName, int planId,
                                         String planName, String networkName, String planType) {
        // int rowCount = rs.last() ? rs.getRow() : 0;

        PreparedStatement pst = null;
        ResultSet rs = null;
        int networkId = -1;
        int insertId = -1;

        // get the network id for this carrier and network name and plan_type
        try {
            pst = connection
                    .prepareStatement("SELECT n.id FROM network n, carrier c WHERE c.display_name = ? "
                            + "AND n.name = ? "
                            + "AND n.type = ? "
                            + "AND c.id = n.carrier_id");
            pst.setString(1, carrierName);
            pst.setString(2, networkName);
            pst.setString(3, planType);
            rs = pst.executeQuery();

            if (rs.next()) {
                networkId = rs.getInt("id");
            }
            pst.close();

            if (networkId < 0) {
                throw new IllegalArgumentException(
                        "Network does not exist for network: " + networkName
                                + " and carrier: " + carrierName
                                + " planType: " + planType);
            }

            // create the plan, plan name and network relationship
            pst = connection
                    .prepareStatement(
                            "INSERT INTO plan_name_by_network (plan_id, network_id, name, plan_type) VALUES (?, ?, ?, ?)",
                            Statement.RETURN_GENERATED_KEYS);
            pst.setInt(1, planId);
            pst.setInt(2, networkId);
            pst.setString(3, planName);
            pst.setString(4, planType);
            pst.executeUpdate();

            rs = pst.getGeneratedKeys();
            if (rs != null && rs.next()) {
                insertId = rs.getInt(1);
            }

        } catch (SQLException e) {
            closeConnections(rs, pst);
            e.printStackTrace();
        }

        if (insertId < 0) {
            throw new IllegalArgumentException(
                    "Could not create plan name and network association!");
        }
    }

    /**
     * @return
     */
    public List<Network> getNetworks() {
        ArrayList<Network> networks = new ArrayList<Network>();
        Statement stmt = null;
        ResultSet rs = null;
        try {
            stmt = connection.createStatement();
            rs = stmt
                    .executeQuery("SELECT c.name as carrier_name, n.* FROM network n, carrier c where c.id = n.carrier_id");

            while (rs.next()) {
                Integer id = rs.getInt("id");
                Integer carrierId = rs.getInt("carrier_id");
                String carrierName = rs.getString("carrier_name");
                String name = rs.getString("name");
                String type = rs.getString("type");
                String tier = rs.getString("tier");
                networks.add(new Network(id, carrierId, carrierName, name,
                        type, tier));
            }
        } catch (SQLException e) {
            closeConnections(rs, stmt);
            e.printStackTrace();
        }
        return networks;
    }

    /**
     * @param rs
     * @param stmt
     */
    private void closeConnections(ResultSet rs, Statement stmt) {
        try {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }

        } catch (SQLException ex) {
            Logger lgr = Logger.getLogger(BenefitDBLoader.class.getName());
            lgr.log(Level.WARNING, ex.getMessage(), ex);
        }
    }

    public void close() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException ex) {
            Logger lgr = Logger.getLogger(BenefitDBLoader.class.getName());
            lgr.log(Level.WARNING, ex.getMessage(), ex);
        }
    }

}

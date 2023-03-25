package com.benrevo.data.persistence.dao;

import java.util.ArrayList;
import java.util.List;

import com.benrevo.data.persistence.entities.Carrier;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import com.benrevo.common.dto.EmployeeContributionDto;
import com.benrevo.common.params.BenefitSearchParams;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.helper.HibernateHelper;

public class PlanDao extends BaseDao {

	private final SessionFactory sessionFactory;

	public PlanDao() {
		sessionFactory = HibernateHelper.getSessionFactory();
	}

	public boolean saveSelectedPlans(long altBucketId, List<Long> pnnIdList) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		boolean success = false;

		StringBuilder idList = new StringBuilder();
		String delim = "";
		for (Long value : pnnIdList) {
			idList.append(delim).append(value);
			delim = ",";
		}
		String sql = "UPDATE alt_plan_rates SET selected = true WHERE alt_bucket_id = ? AND pnn_id in ("
				+ idList.toString() + ")";
		try {
			Query q = session.createNativeQuery(sql);
			q.setLong(1, altBucketId);

			q.executeUpdate();

			success = true;

		} catch (Exception e) {
			System.err.println("PlanNameNetworkId:" + idList.toString());
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return success;
	}
	/*
	public List<PlanDetailDto> getSelectedPlans(int clientId, String product) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		List<PlanDetailDto> plans = new ArrayList<PlanDetailDto>();
		try {

			String sql = "SELECT ab.alt_bucket_id, ab.category, ab.plan_type, ab.name, "
					+ "apr.pnn_id, apr.tier1, apr.tier2, apr.tier3, apr.tier4, " + "pnn.name as plan_name,  "
					+ "c.carrier_id, c.display_name AS carrier, "
					+ "ab.contribution_tier1, ab.contribution_tier2, ab.contribution_tier3, ab.contribution_tier4 "
					+ "FROM alt_plan_rates apr, alt_bucket ab, plan_name_by_network pnn, plan p, carrier c "
					+ "WHERE apr.alt_bucket_id = ab.alt_bucket_id AND apr.pnn_id = pnn.pnn_id AND pnn.plan_id = p.plan_id AND p.carrier_id = c.carrier_id "
					+ "AND apr.selected = true " + "AND ab.client_id = ? ";
			if (null != product) {
				sql += "AND ab.category = ?";
			}

			Query q = session.createNativeQuery(sql);
			q.setLong(1, clientId);
			if (null != product) {
				q.setString(2, product);
			}
			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);

				PlanDetailDto newPlan = new PlanDetailDto();
				newPlan.setCarrierId((Long) o[10]);
				newPlan.setBucketId((Long) o[0]);
				newPlan.setCarrierName((String) o[11]);
				newPlan.setPlanName((String) o[9]);
				newPlan.setPlanId((Long) o[4]);
				newPlan.setCategory((String) o[1]);
				newPlan.setPlanType((String) o[2]);
				newPlan.setBucketName((String) o[3]);
				newPlan.setTier1((Long) o[5]);
				newPlan.setTier2((Long) o[6]);
				newPlan.setTier3((Long) o[7]);
				newPlan.setTier4((Long) o[8]);
				newPlan.setContributionTier1((Long) o[12]);
				newPlan.setContributionTier2((Long) o[13]);
				newPlan.setContributionTier3((Long) o[14]);
				newPlan.setContributionTier4((Long) o[15]);

				plans.add(newPlan);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return plans;
	}*/
	/**
	 * 
	 * @param search
	 * @return
	 */
	/*
	public List<PlanDto> searchPlan(PlanSearchParams search) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		List<PlanDto> plans = new ArrayList<PlanDto>();
		try {
			StringBuilder completeSQL = new StringBuilder();
			completeSQL.append(getPlanInfoQuery());

			completeSQL.append(" AND pn.pnn_id IN (SELECT pnn_id FROM alt_plan_rates WHERE alt_bucket_id=?)"); //all the plans that fall into that bucket

			//create search criteria sql 
			String searchSql = createSearchSql(search.getBenefitSearchParams());
			if (searchSql.length() != 0) {
				completeSQL.append(" AND p.plan_id IN (" + searchSql + ")");
			}

			System.out.println("SEARCH query: " + completeSQL.toString());

			Query q = session.createNativeQuery(completeSQL.toString());
			q.setLong(1, search.getBucket());

			List<Object[]> resultList = q.getResultList();
			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);
				PlanDto pd = createNewPlan(session, (Long) o[3], (Long) o[4], (String) o[0], (String) o[1],
						(String) o[2], (Long) o[5], null, null);
				if (null != pd) {
					plans.add(pd);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return plans;
	}

	private PlanDto createNewPlan(Session session, long pnnId, long planId, String carrierName, String networkName,
			String planName, Long cost, Long bucketId, Integer finalSelected) throws SQLException {
		PlanDto newPlan = new PlanDto();
		newPlan.setPlanId(pnnId);
		newPlan.setPlanName(planName);
		newPlan.setCarrierName(carrierName);
		newPlan.setNetworkName(networkName);
		if (bucketId != null) {
			newPlan.setBucketId(bucketId);
		}
		if (finalSelected != null) {
			newPlan.setFinalSelected(finalSelected.equals(1));
		}

		List<BenefitDto> benefits = getBenefitsFromPlanId(session, planId);
		if (null != benefits && benefits.size() != 0) {
			newPlan.setBenefits(benefits);
			if (cost > 0) {
				BenefitDto fake = new BenefitDto();
				fake.setId(999);
				fake.setValue(cost.toString());
				newPlan.addBenefit(fake);
			}
		} else {
			return null;
		}
		session.getTransaction().commit();
		return newPlan;
	}*/

	private String createSearchSql(List<BenefitSearchParams> bsp) {

		/**/
		List<BenefitSearchParams> temp = new ArrayList<BenefitSearchParams>();
		for (int loop = 0; loop < bsp.size(); loop++) {

			BenefitSearchParams param = bsp.get(loop);
			param.setInOrOut("IN");
			temp.add(param);

			String format2 = param.getFormat2();
			String gt2 = param.getGreaterThan2();
			String lt2 = param.getLessThan2();

			if ((null != gt2 && !gt2.isEmpty()) || (null != lt2 && !lt2.isEmpty())
					|| (null != format2 && !format2.isEmpty())) {
				BenefitSearchParams outSearch = new BenefitSearchParams();

				outSearch.setId(param.getId());
				outSearch.setGreaterThan(gt2);
				outSearch.setLessThan(lt2);
				outSearch.setFormat(format2);
				outSearch.setInOrOut("OUT");
				temp.add(outSearch);
			}
		}
		/**/
		StringBuilder sb = new StringBuilder();

		for (int index = 0; index < temp.size(); index++) {
			String query = createBenefitSearchQuery(temp.get(index));
			if (index > 0) {
				sb.append(" ");
				sb.append("AND plan_id IN (");
			}
			sb.append(query);
		}
		for (int index = 1; index < temp.size(); index++) {
			sb.append(")");
		}
		return sb.toString();
	}

	private String getPlanInfoQuery() {
		String query = "SELECT c.display_name as carrier, n.name as network_name, pn.name as plan_name, pn.pnn_id, p.plan_id, pn.cost "
				+ "FROM carrier c, network n, plan_name_by_network pn, plan p " + "WHERE p.plan_id = pn.plan_id "
				+ "AND p.carrier_id = c.carrier_id " + "AND pn.network_id = n.network_id ";
		return query;
	}
	/*
	public PlanDto getPlanById(int planId) {
		ArrayList<Integer> planIds = new ArrayList<Integer>();
		planIds.add((Integer) planId);
		List<PlanDto> planList = getPlansById(planIds);
		if (planList.size() > 0) {
			return planList.get(0);
		}
		return null;
	}
	
	public List<PlanDto> getPlansById(List<Integer> planIds) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		StringBuilder sb = new StringBuilder();
		for (Integer id : planIds) {
			if (sb.length() > 0) {
				sb.append(',');
			}
			sb.append(id);
		}

		List<PlanDto> plans = new ArrayList<PlanDto>();

		try {
			if (sb.length() == 0) {
				return plans;
			}

			//we have something to search
			String completeSQL = getPlanInfoQuery();
			completeSQL += "AND pn.pnn_id IN (" + sb.toString() + ")";

			Query q = session.createNativeQuery(completeSQL);
			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);
				plans.add(createNewPlan(session, (Long) o[3], (Long) o[4], (String) o[0], (String) o[1], (String) o[2],
						(Long) o[5], null, null));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return plans;
	}
	
	private List<BenefitDto> getBenefitsFromPlanId(Session session, Long planId) {
		List<BenefitDto> benefits = new ArrayList<BenefitDto>();
		try {
			String sql = "SELECT bn.benefit_name_id, bn.display_name, b.in_out_network, b.format, b.value, b.restriction FROM benefit b, benefit_name bn "
					+ "WHERE b.benefit_name_id = bn.benefit_name_id " + "AND plan_id = ?";
			Query q = session.createNativeQuery(sql);
			q.setLong(1, planId);
			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);
				long id = (Long) o[0];
				String displayName = (String) o[1];
				String inOut = (String) o[2];
				String format = (String) o[3];
				String value = (String) o[4];
				String restriction = (String) o[5];

				benefits.add(new BenefitDto(id, displayName, inOut, format, value, restriction));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return benefits;
	}*/

	/**
	 * 
	 * @param benefitSearchParams
	 * @return
	 */
	private String createBenefitSearchQuery(BenefitSearchParams benefitSearchParams) {
		int id = benefitSearchParams.getId();
		String format = benefitSearchParams.getFormat();
		String gt = benefitSearchParams.getGreaterThan();
		String lt = benefitSearchParams.getLessThan();
		String inOROut = benefitSearchParams.getInOrOut();
		String list = benefitSearchParams.getList();

		StringBuilder s = new StringBuilder();
		s.append("SELECT plan_id FROM benefit WHERE in_out_network = '" + inOROut + "' AND benefit_name_id=" + id);

		if (null != gt && !gt.isEmpty()) {
			s.append(" ");
			s.append("AND value >= " + gt);
		}
		if (null != lt && !lt.isEmpty()) {
			s.append(" ");
			s.append("AND value <= " + lt);
		}
		if (null != list && !list.isEmpty()) {
			s.append(" ");
			s.append("AND value IN (" + list + ")");
		}
		if (null != format && !format.isEmpty()) {
			s.append(" ");
			s.append("AND format = '" + format + "'");

		}

		return s.toString();
	}

	public boolean removeSelectedPlan(long bucket, long pnnId) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		boolean success = false;
		try {
			String sql = "UPDATE alt_plan_rates SET selected = 0 WHERE alt_bucket_id = ? and pnn_id = ?";
			Query q = session.createNativeQuery(sql);
			q.setLong(1, bucket);
			q.setLong(2, pnnId);
			q.executeUpdate();

			success = true;

		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return success;
	}
/*
	public List<NetworkPlanDto> getAllNetworkPlans() throws Exception {
		List<NetworkPlanDto> allPlans = new ArrayList<NetworkPlanDto>();

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT pnn FROM PlanNameByNetwork";
			Query q = session.createQuery(sql);
			List<PlanNameByNetwork> resultList = q.getResultList();
			for (PlanNameByNetwork pnn : resultList) {
				allPlans.add(pnn.toPlanNameByNetworkDto());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return allPlans;
	}*/

	public EmployeeContributionDto getEmployeeContributions(long clientId, String category) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		EmployeeContributionDto employeeContribution = new EmployeeContributionDto();
		try {
			String sql = "SELECT a.contribution_tier1, a.contribution_tier2, a.contribution_tier3, a.contribution_tier4 "
					+ "FROM base_plan_rates b, plan_name_by_network p, alt_bucket a "
					+ "WHERE b.pnn_id = p.id AND b.alt_bucket_id = a.id AND a.client_id = ? AND a.category = ?;";
			Query q = session.createNativeQuery(sql);
			q.setLong(1, clientId);
			q.setString(2, category);
			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);
				employeeContribution.setTier1((Long) o[0]);
				employeeContribution.setTier2((Long) o[1]);
				employeeContribution.setTier3((Long) o[2]);
				employeeContribution.setTier4((Long) o[3]);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return employeeContribution;
	}
	/*
	public List<PlanDto> getPlansById(List<Long> planIds, Long bucketId) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		StringBuilder sb = new StringBuilder();
		for (Long id : planIds) {
			if (sb.length() > 0) {
				sb.append(',');
			}
			sb.append(id);
		}

		List<PlanDto> plans = new ArrayList<PlanDto>();

		try {
			if (sb.length() == 0) {
				return plans;
			}

			//we have something to search
			String sql = "SELECT apr.alt_bucket_id AS bucket, c.display_name as carrier, n.name as network_name, "
					+ "pn.name as plan_name, pn.id as pnn_id, p.id as plan_id, pn.cost, apr.final_selected "
					+ "FROM carrier c, network n, plan_name_by_network pn, plan p, alt_plan_rates apr "
					+ "WHERE p.id = pn.plan_id AND p.carrier_id = c.id AND pn.network_id = n.id "
					+ "AND apr.pnn_id = pn.id AND apr.alt_bucket_id = ? " + "AND pn.id IN (" + sb.toString() + ")";
			Query q = session.createNativeQuery(sql);
			q.setLong(1, bucketId);

			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);
				plans.add(createNewPlan(session, (Long) o[4], (Long) o[5], (String) o[1], (String) o[2], (String) o[3],
						(Long) o[6], (Long) o[0], (Integer) o[7]));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return plans;
	}

	public List<PlanDetailDto> getAllMatchingPlanDetails(String category, String planType) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		List<PlanDetailDto> plans = new ArrayList<PlanDetailDto>();
		try {

			String sql = "SELECT ab.alt_bucket_id, ab.category, ab.plan_type, ab.name, "
					+ "apr.pnn_id, apr.tier1, apr.tier2, apr.tier3, apr.tier4, " + "pnn.name as plan_name,  "
					+ "c.carrier_id, c.display_name AS carrier, "
					+ "ab.contribution_tier1, ab.contribution_tier2, ab.contribution_tier3, ab.contribution_tier4 "
					+ "FROM alt_plan_rates apr, alt_bucket ab, plan_name_by_network pnn, plan p, carrier c "
					+ "WHERE apr.alt_bucket_id = ab.alt_bucket_id AND apr.pnn_id = pnn.pnn_id AND pnn.plan_id = p.plan_id AND p.carrier_id = c.carrier_id "
					+ "AND apr.selected = true " + "AND ab.plan_type = ? and ab.category = ? ";
			Query q = session.createNativeQuery(sql);
			q.setString(1, planType);
			q.setString(2, category);
			List<Object[]> resultList = q.getResultList();

			for (int i = 0; i < resultList.size(); i++) {
				Object[] o = resultList.get(i);

				PlanDetailDto newPlan = new PlanDetailDto();
				newPlan.setCarrierId((Long) o[10]);
				newPlan.setBucketId((Long) o[0]);
				newPlan.setCarrierName((String) o[11]);
				newPlan.setPlanName((String) o[9]);
				newPlan.setPlanId((Long) o[4]);
				newPlan.setCategory((String) o[1]);
				newPlan.setPlanType((String) o[2]);
				newPlan.setBucketName((String) o[3]);
				newPlan.setTier1((Long) o[5]);
				newPlan.setTier2((Long) o[6]);
				newPlan.setTier3((Long) o[7]);
				newPlan.setTier4((Long) o[8]);
				newPlan.setContributionTier1((Long) o[12]);
				newPlan.setContributionTier2((Long) o[13]);
				newPlan.setContributionTier3((Long) o[14]);
				newPlan.setContributionTier4((Long) o[15]);
				newPlan.setBenefits(getBenefitsFromPlanId(session, newPlan.getPlanId()));

				plans.add(newPlan);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		return plans;
	}*/

	public List<Network> getAllNetworks() throws Exception {
		List<Network> allNetworks = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		try {
			String sql = "SELECT n FROM Network n";
			Query q = session.createQuery(sql);
			allNetworks = q.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}

		session.getTransaction().commit();
		return allNetworks;
	}

	public List<Network> getAllNetworksForCarrier(Carrier carrier) throws Exception {
		List<Network> allNetworks = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		try {
			String sql = "SELECT n FROM Network n WHERE carrier.carrierId = :carrierId";
			Query q = session.createQuery(sql);
			q.setParameter("carrierId", carrier.getCarrierId());
			allNetworks = q.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}

		session.getTransaction().commit();
		return allNetworks;
	}
	
	public Plan findPlanByName(String name, long carrierId) {
		String sql = "SELECT n FROM Plan n WHERE name = :name  and carrier.carrierId = :carrierId ";
		Query q = getEntityManager().createQuery(sql);
		q.setParameter("name", name);
		q.setParameter("carrierId", carrierId);
		List<Plan> resultList = q.getResultList();
		if (resultList.size() > 0) {
			return resultList.get(0);
		}
		return null;
	}

	public PlanNameByNetwork findPnnByName(Plan plan, Network network) {
		String sql = "SELECT n FROM PlanNameByNetwork n WHERE plan.planId = :planId  and network.networkId = :networkId ";
		Query q = getEntityManager().createQuery(sql);
		q.setParameter("planId", plan.getPlanId());
		q.setParameter("networkId", network.getNetworkId());
		List<PlanNameByNetwork> resultList = q.getResultList();
		if (resultList.size() > 0) {
			return resultList.get(0);
		}
		return null;
	}
}
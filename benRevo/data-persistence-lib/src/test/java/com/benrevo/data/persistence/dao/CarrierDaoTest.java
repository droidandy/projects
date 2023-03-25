package com.benrevo.data.persistence.dao;

import com.benrevo.data.persistence.entities.Carrier;

import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@Ignore
public class CarrierDaoTest {

	private CarrierDao dao = new CarrierDao();

	@Test
	public void getCarrierByIdTest() {
		Carrier c = dao.getCarrier(3);
		assertEquals(c.getName(), "ANTHEM_BLUE_CROSS");
		assertEquals(c.getDisplayName(), "Anthem Blue Cross");

		c = dao.getCarrier(22);
		assertEquals(c.getName(), "UHC");
		assertEquals(c.getDisplayName(), "United Health Care");
	}

	@Test
	public void getCarrierByInvalidIdTest() {
		Carrier c = dao.getCarrier(0);
		assertNull(c);

		c = dao.getCarrier(1000000000);
		assertNull(c);

		c = dao.getCarrier(-99);
		assertNull(c);
	}
}

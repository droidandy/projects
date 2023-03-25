package com.benrevo.test.api.rfp;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.test.api.BaseTest;
import com.benrevo.test.utils.ClientUtils;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;

import java.util.HashMap;

public class RfpControllerTest extends BaseTest {

	protected static final int FIFTEEN = 15;
	protected static final long RFP_ID_FROM_OTHER_BROKERAGE = 38L;
	protected static final long CLIENT_FROM_OTHER_BROKERAGE = 1L;
	protected static final String APPLICATION_PDF = "application/pdf";
	protected static final int ZERO = 0;
	protected static final Long INVALID_CLIENT_ID = new Long("0000009");
	protected static final String INVALID_PRODUCT_TYPE = "med";
	protected static HashMap<String, Object> queryParams = new HashMap<String, Object>();
	protected static ClientDto clientDto;

	@DataProvider(name = "rfp_types")
	public Object[][] rfpTypes() {
		return new Object[][] {{Constants.MEDICAL}, {Constants.DENTAL}, {Constants.VISION}};
	}

	@DataProvider(name = "fail_rfp_types")
	public Object[][] rfpFailTypes() {
		return new Object[][] {{"MEDICA"}, {"DENTA"}, {"VISIO"}};
	}

	@BeforeMethod()
	public void setup2() {
		clientDto = gson.fromJson(ClientUtils.createClient().asString(), ClientDto.class);
	}
}

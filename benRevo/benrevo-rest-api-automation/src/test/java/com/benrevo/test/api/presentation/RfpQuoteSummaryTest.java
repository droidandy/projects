package com.benrevo.test.api.presentation;

import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.test.api.rfp.RfpControllerTest;
import com.benrevo.test.utils.presentation.RfpQuoteSummaryUtil;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RfpQuoteSummaryTest extends RfpControllerTest {

	/**
	 * Test that posting correctly formatted QuoteSummary returns expected results.
	 */
	@Test
	public void createRfpQuoteSummaryTest() {
		RfpQuoteSummaryDto randomRfpQuoteSummary = RfpQuoteSummaryUtil.getRandomRfpQuoteSummaryDto();
		RfpQuoteSummaryDto rfpQuoteSummaryDto = RfpQuoteSummaryUtil.createRfpQuoteSummary(randomRfpQuoteSummary, clientDto);
		randomRfpQuoteSummary.setId(rfpQuoteSummaryDto.getId());
		Assert.assertEquals(rfpQuoteSummaryDto, randomRfpQuoteSummary);
//		Assert.assertEquals(rfpQuoteSummaryDto.getClientId(), clientDto.getId());
		
	}
}

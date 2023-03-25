package com.benrevo.be.modules.shared.service.cache;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;

public class CacheKeyBuilderTest {

	@Test
	public void testRfpQuoteOptionKey() throws Exception {

	    // simple key
	    String simpleKey = CacheKeyBuilder.build(CacheKeyType.RFP_QUOTE_OPTION, 123L);
		assertThat(simpleKey).isEqualTo("rfp_quote_option:123");
		
		// key with field
		String keyWithField = CacheKeyBuilder.build(CacheKeyType.RFP_QUOTE_OPTION, 123L, "anyField");
        assertThat(keyWithField).isEqualTo("rfp_quote_option:123:anyField");
	}
}

package com.benrevo.be.modules.shared.util;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import org.junit.Test;


public class BenefitUtilTest {

    private BenefitUtil util = new BenefitUtil();
    
    @Test
    public void splitBenefits() {

        List<String> values = util.splitBenefits("$1,000x4");
        assertThat(values).containsExactly("$1,000","$4000");

        values = util.splitBenefits("$3333X3");
        assertThat(values).containsExactly("$3333","$9999");
        
        values = util.splitBenefits("$10x4");
        assertThat(values).containsExactly("$10","$40");

        values = util.splitBenefits("$1,010/$3,200");
        assertThat(values).containsExactly("$1,010","$3,200");

        values = util.splitBenefits("$2,020/5,200");
        assertThat(values).containsExactly("$2,020","$5,200");

        values = util.splitBenefits("$2,020/6200");
        assertThat(values).containsExactly("$2,020","$6200");

        values = util.splitBenefits("$3020/$4200");
        assertThat(values).containsExactly("$3020","$4200");

        values = util.splitBenefits("");
        assertThat(values).containsExactly("N/A","N/A");

        values = util.splitBenefits("$0");
        assertThat(values).containsExactly("N/A","N/A");

        values = util.splitBenefits("$2,000/$2,700/$4,000");
        assertThat(values).containsExactly("$2,000/$2,700","$4,000");

        values = util.splitBenefits("$6,000/$6,000/$12,000");
        assertThat(values).containsExactly("$6,000","$12,000");

        values = util.splitBenefits("$1,350/2,700/$3,000");
        assertThat(values).containsExactly("$1,350/$2,700","$3,000");

        values = util.splitBenefits("$4,500/$4,500,$9,000");
        assertThat(values).containsExactly("$4,500","$9,000");
        
    }
}

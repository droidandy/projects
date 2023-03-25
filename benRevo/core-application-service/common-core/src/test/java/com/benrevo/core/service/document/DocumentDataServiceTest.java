package com.benrevo.core.service.document;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.data.persistence.entities.RFP;
import java.util.HashMap;
import java.util.Map;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

@Ignore // TODO/FIXME: broken...
public class DocumentDataServiceTest extends AbstractControllerTest {

    private static final String WAITING_PERIOD_KEY = "waiting_period_for_new_hires";
    private static final String MONTHS_DAYS_OF_EMPLOYMENT_KEY = "months_days_of_employment_following_date_of_hire";
    private static final String FIRST_OF_MONTH_KEY = "first_of_month";

    @Autowired
    @Qualifier("questionnaire")
    AbstractDocumentDataService ds;
    
    @Override
        public void init() {
    
    }

    @Test
    public void testWaitingPeriodData(){
        Map<String, String>  answers = new HashMap();
        RFP medicalRfp = new RFP();
        Map<String, String> expectedAnswers = new HashMap();

        medicalRfp.setWaitingPeriod("30 days after hire");
        expectedAnswers.put(WAITING_PERIOD_KEY, "Amount of days");
        expectedAnswers.put(MONTHS_DAYS_OF_EMPLOYMENT_KEY, "30");
        checkAnswers(answers, expectedAnswers);

        medicalRfp.setWaitingPeriod("First of the month following date of hire");
        expectedAnswers.put(WAITING_PERIOD_KEY, "First Of The Month Date of Hire");
        checkAnswers(answers, expectedAnswers);

        medicalRfp.setWaitingPeriod("First of the month following 30 days of hire");
        expectedAnswers.put(WAITING_PERIOD_KEY, "First Of The Month");
        expectedAnswers.put(FIRST_OF_MONTH_KEY, "30 days");
        checkAnswers(answers, expectedAnswers);

        medicalRfp.setWaitingPeriod("First of the month following one month of hire");
        expectedAnswers.put(WAITING_PERIOD_KEY, "First Of The Month");
        expectedAnswers.put(FIRST_OF_MONTH_KEY, "1 month");
        checkAnswers(answers, expectedAnswers);

        medicalRfp.setWaitingPeriod("First of the month following 60 days of hire");
        expectedAnswers.put(WAITING_PERIOD_KEY, "First Of The Month");
        expectedAnswers.put(FIRST_OF_MONTH_KEY, "60 days");
        checkAnswers(answers, expectedAnswers);
    }

    private void checkAnswers(Map<String, String> answers, Map<String, String> expectedAnswers){
        expectedAnswers.entrySet().stream().forEach(entry -> {
            assertTrue("The answer is not found for key: " + entry.getKey(), answers.containsKey(entry.getKey()));
            assertEquals(String.format("The answer %s is not right for key: %s. Expected: %s", answers.get(entry.getKey()), entry.getKey(), entry.getValue())
                , answers.get(entry.getKey()),entry.getValue());
        });
        cleanMaps(answers, expectedAnswers);
    }

    private void cleanMaps(Map<String, String> answers, Map<String, String> expectedAnswers){
        expectedAnswers.clear();
        answers.clear();
    }
}

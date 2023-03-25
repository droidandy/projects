package com.benrevo.be.modules.salesforce;

import com.benrevo.be.modules.salesforce.aop.SalesforceLookupAspect;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.dto.query.SFQuery;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeoutException;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockitoTestExecutionListener;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.annotation.Commit;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static java.util.concurrent.TimeUnit.SECONDS;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.springframework.boot.test.mock.mockito.MockReset.BEFORE;
import static org.springframework.test.context.TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS;

/**
 * Created by ebrandell on 2/8/18 at 3:29 PM.
 */
@TestExecutionListeners(
    listeners = {
        TransactionalTestExecutionListener.class,
        MockitoTestExecutionListener.class
    },
    mergeMode = MERGE_WITH_DEFAULTS
)
public class SalesforceLookupAspectAndClientTest extends AbstractControllerTest {

    @Autowired
    ApplicationEventPublisher publisher;

    @Autowired
    CustomLogger logger;

    @MockBean(reset = BEFORE)
    SalesforceClient client;

    @Autowired
    SalesforceLookupAspect salesforceLookupAspect;

    @Autowired
    SalesforceEventListener salesforceEventListener;

    /**
     * Hacky workaround to test @TransactionalEventListener
     */
    @Before
    public void setup() {
        TestTransaction.end();
        TestTransaction.start();
        TestTransaction.flagForCommit();
    }

    @Test
    public void test_publishEventVerifyClientCallsInsertWithSomeData()
        throws InterruptedException, ExecutionException, TimeoutException {
        given(client.insert(any())).willReturn("testInsert");

        SalesforceEvent e = new SalesforceEvent.Builder()
            .withObject(
                new SFOpportunity.Builder()
                    .withName("testName")
                    .withAmount(200.00)
                    .withCarrier(fromStrings(appCarrier))
                    .build()
            )
            .build();

        publishEvent(e);

        // Required
        TestTransaction.end();

        Future<Void> r = salesforceEventListener.handleEvent(e);

        if(r.get(10, SECONDS) != null) {
            // Verify calls
            then(client).should(times(3)).insert(any());
            then(client).should(never()).update(anyString(), any());

            // Verify data
            assertTrue("Id should be null", ((SFOpportunity) e.getObject()).getId() == null);
            assertTrue(
                "Carrier mismatch",
                e.getObject().getCarrier().equals(fromStrings(appCarrier))
            );
            assertTrue("Opportunity name mismatch", e.getObject().getName().equals("testName"));
            assertTrue(
                "Opportunity amount mismatch",
                ((SFOpportunity) e.getObject()).getAmount().equals(200.00)
            );
        }
    }

    @Test
    public void test_publishEventVerifyClientCallsUpdateWithSomeData()
        throws InterruptedException, ExecutionException, TimeoutException {
        given(client.query(any(SFQuery.class), any())).willReturn("testResult");

        SalesforceEvent e = new SalesforceEvent.Builder()
            .withObject(
                new SFOpportunity.Builder()
                    .withName("testName")
                    .withBrokerageFirm("testResult")
                    .withAmount(200.00)
                    .withCarrier(fromStrings(appCarrier))
                    .build()
            )
            .build();

        publishEvent(e);

        // Required
        TestTransaction.end();

        Future<Void> r = salesforceEventListener.handleEvent(e);

        if(r.get(10, SECONDS) != null) {
            // Verify calls
            then(client).should(times(2)).update(anyString(), any());
            then(client).should(never()).insert(any());

            // Verify data
            assertTrue(
                "Account id should be testResult",
                ((SFOpportunity) e.getObject()).getAccountId().equals("testResult")
            );
            assertTrue(
                "Opportunity id should be testResult",
                ((SFOpportunity) e.getObject()).getId().equals("testResult")
            );
            assertTrue(
                "Brokerage firm should be testResult",
                ((SFOpportunity) e.getObject()).getBrokerageFirm().equals("testResult")
            );
        }
    }

    @Test
    public void test_publishEventRandomExceptionThrown() {
        given(client.query(any(SFQuery.class), any())).willThrow(new BaseException("test"));

        SalesforceEvent e = new SalesforceEvent.Builder()
            .withObject(
                new SFOpportunity.Builder()
                    .withName("testName")
                    .withBrokerageFirm("testResult")
                    .withAmount(200.00)
                    .withCarrier(fromStrings(appCarrier))
                    .build()
            )
            .build();

        publishEvent(e);

        // Required
        TestTransaction.end();

        // Verify data is unchanged
        assertTrue("Salesforce object should be identical before/after", ((SFOpportunity) e.getObject()).getId() == null);
        assertTrue("Salesforce object should be identical before/after", ((SFOpportunity) e.getObject()).getAccountId() == null);
    }

    @Commit
    private void publishEvent(Object o) {
        publisher.publishEvent(o);
    }

}

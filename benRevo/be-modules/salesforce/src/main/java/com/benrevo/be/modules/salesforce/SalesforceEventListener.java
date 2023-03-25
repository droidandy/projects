package com.benrevo.be.modules.salesforce;

import com.benrevo.be.modules.salesforce.dto.SFAccount;
import com.benrevo.be.modules.salesforce.dto.SFBase;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.enums.AccountType;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.logging.CustomLogger;

import java.util.concurrent.Future;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static org.apache.commons.lang3.StringUtils.*;


/**
 * Created by ebrandell on 11/10/17 at 11:57 AM.
 */
@Component
@ConditionalOnProperty(name = "salesforce.enabled", havingValue = "true")
public class SalesforceEventListener {

    private static final String [] EXCLUDED_ACCOUNTS = {
        "automation@benrevo.com"
    };

    @Value("${app.env}")
    String appEnv;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Autowired
    CustomLogger logger;

    @Autowired
    SalesforceClient client;

    @Async
    @TransactionalEventListener(
        phase = TransactionPhase.AFTER_COMPLETION,
        condition = "#event.object != null"
    )
    public Future<Void> handleEvent(SalesforceEvent event) {
        // Do not persist Salesforce data for excluded email accounts
        if(ArrayUtils.contains(EXCLUDED_ACCOUNTS, event.getEmail())) {
            return new AsyncResult<>(null);
        }

        SFBase o = event.getObject();

        boolean test = !equalsIgnoreCase(appEnv, "prod");
        CarrierType carrier = fromStrings(appCarrier);

        // Set test flag
        o.setTest(test);

        // Set carrier platform
        o.setCarrier(carrier);

        switch(o.getsObjectType()) {
            case Account:
                // Create if no id provided, update otherwise
                if(isBlank(((SFAccount) o).getId())) {
                    client.insert(o);
                } else {
                    client.update(((SFAccount) o).getId(), o);
                }
            break;
            case Opportunity:
                // If the account doesn't exist, create it
                if(isBlank(((SFOpportunity) o).getAccountId())) {
                    String accountId = client.insert(
                        new SFAccount.Builder()
                            .withName(o.getName())
                            .withTest(test)
                            .withCarrierPlatform(carrier)
                            .withType(AccountType.Employer)
                            .build()
                    );

                    if(isNotBlank(accountId)) {
                        ((SFOpportunity) o).setAccountId(accountId);
                    }
                } else {
                    client.update(
                        ((SFOpportunity) o).getAccountId(),
                        new SFAccount.Builder()
                            .withCurrentName(o.getCurrentName())
                            .withName(o.getName())
                            .withTest(test)
                            .withCarrierPlatform(carrier)
                            .withType(AccountType.Employer)
                            .build()
                    );
                }

                // If the brokerage firm doesn't exist, create it
                if(isBlank(((SFOpportunity) o).getBrokerageFirm())) {
                    String brokerageFirmId = client.insert(
                        new SFAccount.Builder()
                            .withName(((SFOpportunity) o).getBrokerageFirmName())
                            .withTest(test)
                            .withCarrierPlatform(carrier)
                            .withType(AccountType.BrokerageFirm)
                            .build()
                    );

                    if(isNotBlank(brokerageFirmId)) {
                        ((SFOpportunity) o).setBrokerageFirm(brokerageFirmId);
                    }
                } else {
                    client.update(
                        ((SFOpportunity) o).getBrokerageFirm(),
                        new SFAccount.Builder()
                            .withName(((SFOpportunity) o).getBrokerageFirmName())
                            .withTest(test)
                            .withCarrierPlatform(carrier)
                            .withType(AccountType.BrokerageFirm)
                            .build()
                    );
                }

                if(isBlank(((SFOpportunity) o).getId())){
                    client.insert(o);
                } else {
                    client.update(((SFOpportunity) o).getId(), o);
                }
            break;
        }

        return new AsyncResult<>(null);
    }


}

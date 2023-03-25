package com.benrevo.be.modules.salesforce.aop;

import com.benrevo.be.modules.salesforce.SalesforceClient;
import com.benrevo.be.modules.salesforce.annotation.SFLookup;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFCondition;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFField;
import com.benrevo.be.modules.salesforce.dto.SFBase;
import com.benrevo.be.modules.salesforce.dto.query.SFQuery;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.common.logging.CustomLogger;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.apache.commons.lang3.tuple.Triple;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static java.util.Arrays.stream;
import static org.apache.commons.lang3.reflect.FieldUtils.readField;
import static org.apache.commons.lang3.reflect.FieldUtils.writeField;
import static org.springframework.core.annotation.AnnotatedElementUtils.hasAnnotation;
import static org.springframework.core.annotation.AnnotationUtils.getAnnotation;
import static software.amazon.ion.impl.PrivateUtils.copyOf;

/**
 * Created by ebrandell on 11/13/17 at 1:32 PM.
 */
@Aspect
@Component
@ConditionalOnProperty(name = "salesforce.enabled", havingValue = "true")
public class SalesforceLookupAspect {

    @Autowired
    CustomLogger logger;

    @Autowired
    SalesforceClient client;

    @Around("execution(public java.util.concurrent.Future<Void> com.benrevo.be.modules.salesforce.SalesforceEventListener.*(..)) && args(e)")
    public Object populateSalesforceReferences(ProceedingJoinPoint pjp, SalesforceEvent e) throws Throwable {
        SFBase o = e.getObject();

        if(hasAnnotation(o.getClass(), SFLookup.class)) {
            SFLookup l = getAnnotation(o.getClass(), SFLookup.class);

            for(final SFField f : l.value()) {
                List<Triple<String, String, Object>> conditions = new ArrayList<>();

                Try.run(
                    () -> {
                        for(SFCondition c : f.conditions()) {
                            conditions.add(
                                SFQuery.condition(
                                    c.key(),
                                    c.op(),
                                    c.lookup()
                                        ? stream(copyOf(c.values(), c.values().length))
                                            .map(v -> Try.of(() -> readField(o, v, true)).getOrNull())
                                            .filter(v -> !Objects.isNull(v))
                                            .findFirst()
                                            .orElse(null)
                                        : c.values()[0]
                                )
                            );
                        }
                    }
                )
                .andThenTry(
                    () -> {
                        String result = client.query(
                            new SFQuery.Builder()
                                .withFields(f.columns())
                                .withType(f.sobject())
                                .withJsonPath(f.jsonPath())
                                .withConditions(conditions)
                                .build(),
                            String.class
                        );

                        switch(f.override()) {
                            case ALWAYS:
                                writeField(o, f.property(), result, true);
                                break;
                            case ONLY_IF_NULL:
                                if(Objects.isNull(readField(o, f.property(), true))) {
                                    writeField(o, f.property(), result, true);
                                }
                                break;
                            case ONLY_IF_CHANGED:
                                if(!Objects.equals(readField(o, f.property(), true), result)) {
                                    writeField(o, f.property(), result, true);
                                }
                        }
                    }
                )
                .onFailure(t -> logger.errorLog(t.getMessage(), t));
            }
        }

        return pjp.proceed(new Object[] { e });
    }

}

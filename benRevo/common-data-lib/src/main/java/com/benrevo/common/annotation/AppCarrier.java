package com.benrevo.common.annotation;

import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.annotation.AppCarrier.CarrierCondition;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Primary;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.util.MultiValueMap;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static com.benrevo.common.enums.CarrierType.validCarrier;
import static java.util.Arrays.stream;
import static org.apache.commons.lang3.StringUtils.*;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;

/**
 * Created by elliott on 7/12/17.
 *
 * TODO: add documentation on this
 */
@Primary
@Qualifier
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Conditional(CarrierCondition.class)
public @interface AppCarrier {

    CarrierType[] value() default {};

    class CarrierCondition implements Condition {

        @Override
        public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
            if(context != null && context.getEnvironment() != null && metadata.isAnnotated(AppCarrier.class.getName())) {
                MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(AppCarrier.class.getName());
                String appCarrier = context.getEnvironment().getProperty("app.carrier");

                return attrs.get("value") != null &&
                    attrs.get("value")
                        .stream()
                        .map(CarrierType[].class::cast)
                        .anyMatch(
                            o -> o != null &&
                                stream(o)
                                .map(Enum::name)
                                .anyMatch(
                                    c -> validCarrier(c) &&
                                        equalsAnyIgnoreCase(
                                            c,
                                            split(appCarrier, ",")
                                        )
                                )
                        );
            }

            return false;
        }
    }
}

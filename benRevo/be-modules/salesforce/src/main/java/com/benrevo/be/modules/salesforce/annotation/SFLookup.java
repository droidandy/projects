package com.benrevo.be.modules.salesforce.annotation;

import com.benrevo.be.modules.salesforce.enums.SalesforceObject;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static com.benrevo.be.modules.salesforce.annotation.SFLookup.OverrideType.ALWAYS;
import static java.lang.annotation.ElementType.*;

/**
 * Created by ebrandell on 11/13/17 at 1:16 PM.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({TYPE, ANNOTATION_TYPE, FIELD})
public @interface SFLookup {

    SFField[] value();

    @interface SFField {

        /**
         * Name of the corresponding class property
         */
        String property();

        /**
         * When querying, include these columns in the results
         */
        String[] columns();

        /**
         * SObject type
         */
        SalesforceObject sobject();

        /**
         * Conditions for the query (WHERE clause)
         */
        SFCondition[] conditions() default {};

        /**
         * Json path corresponding to the desired value from the query result
         */
        String jsonPath() default "";

        /**
         * Override the property's value (even if the query results in null)
         */
        OverrideType override() default ALWAYS;
    }

    @interface SFCondition {

        /**
         * Key name (column)
         */
        String key();

        /**
         * Operation
         */
        String op();

        /**
         * Value of the condition to compare. Will be processed in order. If lookup is false, it will
         * use the first value of this array as a static String if it is non-null and not empty.
         */
        String[] values();

        /**
         * Use another property to provide the value? Defaults to TRUE and uses the value as
         * the name of the property to lookup.
         */
        boolean lookup() default true;
    }

    enum OverrideType {
        ALWAYS,
        ONLY_IF_NULL,
        ONLY_IF_CHANGED
    }
}

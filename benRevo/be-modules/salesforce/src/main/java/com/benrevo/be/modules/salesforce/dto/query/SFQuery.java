package com.benrevo.be.modules.salesforce.dto.query;

import com.benrevo.be.modules.salesforce.enums.SalesforceObject;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.MutableTriple;
import org.apache.commons.lang3.tuple.Triple;

import static java.lang.String.format;
import static java.util.Arrays.copyOf;
import static java.util.Arrays.stream;
import static java.util.Objects.isNull;
import static java.util.regex.Pattern.compile;
import static org.apache.commons.lang3.StringUtils.*;

/**
 * Created by ebrandell on 12/5/17 at 4:28 PM.
 */
public class SFQuery {

    private static final String FORMAT = "SELECT %s FROM %s %s";
    private static final String CONDITION_FORMAT = "%s %s %s";
    private static final Pattern CONDITION_REGEX = compile("([a-zA-Z0-9]+)\\s([a-zA-Z=!><\\s]+)\\s(.+)");
    private static final Pattern VALUE_REGEX = compile("^('|\"){1}.*('|\"){1}$");

    SalesforceObject type;
    String[] fields;
    List<Triple<String, String, Object>> conditions = new ArrayList<>();
    String jsonPath;

    public SFQuery() {}

    private SFQuery(Builder builder) {
        setType(builder.type);
        setFields(builder.fields);
        setConditions(builder.conditions);
        setJsonPath(builder.jsonPath);
    }

    public SalesforceObject getType() {
        return type;
    }

    public void setType(SalesforceObject type) {
        this.type = type;
    }

    public String[] getFields() {
        return fields;
    }

    public void setFields(String[] fields) {
        this.fields = fields;
    }

    public List<Triple<String, String, Object>> getConditions() {
        return conditions;
    }

    public void setConditions(List<Triple<String, String, Object>> conditions) {
        this.conditions = conditions;
    }

    public String getJsonPath() {
        return jsonPath;
    }

    public void setJsonPath(String jsonPath) {
        this.jsonPath = jsonPath;
    }

    @Override
    public String toString() {
        return toQuery();
    }

    public String toQuery() {
        return format(
            FORMAT,
            String.join(",", fields),
            type.name(),
            conditions.size() > 0
                ? "WHERE " + conditions.stream()
                    .filter(c -> !isNull(c.getRight()))
                    .map(
                        c -> format(
                            CONDITION_FORMAT,
                            c.getLeft(),
                            c.getMiddle(),
                            (c.getRight() instanceof String || c.getRight() instanceof Enum)
                                ? wrap(escapeAndEncode(c.getRight()), "'")
                                : escapeAndEncode(c.getRight())
                        )
                    )
                    .collect(Collectors.joining(" AND "))
                : ""
        );
    }

    public static String escapeAndEncode(Object s) {
        return Try.of(
            () -> replaceEach(
                Objects.toString(s),
                // Intentionally ignore spaces because Salesforce is fucking RETARDED
                new String[]{"\"", "'"},
                new String[]{"", ""}
            )
        ).getOrNull();
    }

    public static <L, M, R> Triple<L, M, R> condition(final L l, final M m, final R r) {
        return new MutableTriple<>(l, m, r);
    }

    public static <L, M, R> Triple<L, M, R> condition(final String condition) {
        Matcher m = CONDITION_REGEX.matcher(condition);

        return m.matches()
            ? new MutableTriple<>((L) m.group(1), (M) m.group(2), (R) m.group(3))
            : null;
    }

    public static final class Builder {

        private SalesforceObject type;
        private String[] fields;
        private List<Triple<String, String, Object>> conditions = new ArrayList<>();
        private String jsonPath;

        public Builder() {}

        public Builder withType(SalesforceObject val) {
            type = val;
            return this;
        }

        public Builder withFields(String ... val) {
            fields = val;
            return this;
        }

        public Builder withConditions(List<Triple<String, String, Object>> val) {
            if(val != null) {
                conditions.addAll(val);
            }

            return this;
        }

        @SafeVarargs
        public final Builder addConditions(Triple<String, String, Object> ... val) {
            stream(copyOf(val, val.length))
                .filter(Objects::nonNull)
                .forEachOrdered(c -> conditions.add(c));

            return this;
        }

        public Builder addConditions(String ... val) {
            for(String v : val) {
                if(isNotBlank(v) && CONDITION_REGEX.matcher(v).matches()) {
                    conditions.add(condition(v));
                }
            }

            return this;
        }

        public Builder withJsonPath(String val) {
            jsonPath = val;
            return this;
        }

        public SFQuery build() {
            return new SFQuery(this);
        }
    }
}

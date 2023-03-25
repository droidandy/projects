package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BenefitClientData {

    private Long clientId;
    private String category;
    private String code;
    private String group;
    private transient String dataType;
    private String value;
    private Long id;
    private Boolean multivalue;
    private Long limit;
    private List<HashMap<Long, String>> values;
    @JsonProperty("bucket_id")
    private Long bucketId;
    @JsonProperty("custom_plan_name")
    private String customPlanName;

    public BenefitClientData() {
        values = new ArrayList<HashMap<Long, String>>();
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getMultivalue() {
        return multivalue;
    }

    public void setMultivalue(Boolean multivalue) {
        this.multivalue = multivalue;
    }

    public long getLimit() {
        return limit;
    }

    public void setLimit(long limit) {
        this.limit = limit;
    }

    public List<HashMap<Long, String>> getValues() {
        return values;
    }

    public void setValues(List<HashMap<Long, String>> values) {
        this.values = values;
    }

    public void addValue(HashMap<Long, String> value) {
        this.values.add(value);
    }

    public void removeValue(String value) {
        this.values.remove(value);
    }

    public String getValueForOpportunity() {
        if (values != null && values.size() > 0) {
            boolean isFirst = true;
            StringBuffer sb = new StringBuffer();
            for (HashMap<Long, String> val : values) {
                for (String valInMap : val.values()) {
                    if (isFirst) {
                        isFirst = false;
                    } else {
                        sb.append(", ");
                    }
                    sb.append(valInMap);
                }
            }
            return sb.toString();
        } else {
            return value;
        }
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getBucketId() {
        return bucketId;
    }

    public void setBucketId(Long bucketId) {
        this.bucketId = bucketId;
    }

    public String getCustomPlanName() {
        return customPlanName;
    }

    public void setCustomPlanName(String customPlanName) {
        this.customPlanName = customPlanName;
    }
}

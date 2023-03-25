package com.benrevo.data.persistence.entities;

import java.util.Objects;
import javax.persistence.*;

@Entity
@Table(name = "rider_meta")
public class RiderMeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rider_meta_id")
    private Long riderMetaId;

    @Column(name = "rider_code")
    private String code;

    @Column(name = "rider_description")
    private String description;

    @Column(name = "category")
    private String category;
    
    @Column(name = "plan_type")
    private String planType;
    
    @Column(name = "type")
    private String type;
    
    @Column(name = "type_value")
    private String typeValue;
    
    @Column(name = "type_2")
    private String type2;
    
    @Column(name = "type_value_2")
    private String typeValue2;

    @Column
    private boolean selectable;

    public Long getRiderMetaId() {
        return riderMetaId;
    }

    public void setRiderMetaId(Long riderMetaId) {
        this.riderMetaId = riderMetaId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeValue() {
        return typeValue;
    }

    public void setTypeValue(String typeValue) {
        this.typeValue = typeValue;
    }
    
    public String getType2() {
        return type2;
    }
    
    public void setType2(String type2) {
        this.type2 = type2;
    }
    
    public String getTypeValue2() {
        return typeValue2;
    }
    
    public void setTypeValue2(String typeValue2) {
        this.typeValue2 = typeValue2;
    }

    public boolean isSelectable() {
        return selectable;
    }

    public void setSelectable(boolean selectable) {
        this.selectable = selectable;
    }

    @Override
    public int hashCode() {
       return Objects.hash(riderMetaId, code, category, description, selectable, 
           planType, type, typeValue, type2, typeValue2);
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(!(obj instanceof RiderMeta)) return false;
        RiderMeta other = (RiderMeta) obj;
        return Objects.equals(this.riderMetaId, other.riderMetaId) 
            && Objects.equals(this.code, other.code) 
            && Objects.equals(this.category, other.category)
            && Objects.equals(this.description, other.description) 
            && Objects.equals(this.selectable, other.selectable) 
            && Objects.equals(this.planType, other.planType)
            && Objects.equals(this.type, other.type)
            && Objects.equals(this.typeValue, other.typeValue)
            && Objects.equals(this.type2, other.type2)
            && Objects.equals(this.typeValue2, other.typeValue2);
    }
}

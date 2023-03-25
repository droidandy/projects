package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class BrokerVolumeDto {
    
    public static class BrokerVolumeItem {
        
        public static class CarrierInfo {

            public CarrierInfo() {}

            public CarrierInfo(Long carrierId, String carrierLogoUrl) {
                this.carrierId = carrierId;
                this.carrierLogoUrl = carrierLogoUrl;
            }

            public Long carrierId;
            public String carrierLogoUrl;
            public Integer count;
            
            @Override
            public boolean equals(Object o) {
                if(o == this) { return true; }
                if(!(o instanceof CarrierInfo)) { return false; }
                CarrierInfo other = (CarrierInfo) o;
                return Objects.equals(this.carrierId, other.carrierId) 
                        && Objects.equals(this.carrierLogoUrl, other.carrierLogoUrl)
                        && Objects.equals(this.count, other.count);
            }

            @Override
            public int hashCode() {
                return Objects.hash(carrierId, carrierLogoUrl, count);
            } 
        }
        
        private Long brokerId;
        private String brokerName;
        private Long salesId;
        private String salesName;
        private Integer groups;
        private Integer members;
        private List<CarrierInfo> carriers;
        
        public BrokerVolumeItem() {}

        public BrokerVolumeItem(Long brokerId, String brokerName, Long salesId, String salesName, Integer groups, Integer members) {
            this.brokerId = brokerId;
            this.brokerName = brokerName;
            this.salesId = salesId;
            this.salesName = salesName;
            this.groups = groups;
            this.members = members;
        }

        public Long getBrokerId() {
            return brokerId;
        }
        
        public void setBrokerId(Long brokerId) {
            this.brokerId = brokerId;
        }

        public String getBrokerName() {
            return brokerName;
        }

        public void setBrokerName(String brokerName) {
            this.brokerName = brokerName;
        }

        public String getSalesName() {
            return salesName;
        }

        public void setSalesName(String salesName) {
            this.salesName = salesName;
        }
        
        public Long getSalesId() {
            return salesId;
        }
        
        public void setSalesId(Long salesId) {
            this.salesId = salesId;
        }

        public Integer getGroups() {
            return groups;
        }

        public void setGroups(Integer groups) {
            this.groups = groups;
        }

        public Integer getMembers() {
            return members;
        }

        public void setMembers(Integer members) {
            this.members = members;
        }

        public List<CarrierInfo> getCarriers() {
            return carriers;
        }

        public void setCarriers(List<CarrierInfo> carriers) {
            this.carriers = carriers;
        }

        @Override
        public boolean equals(Object o) {
            if(o == this) {
                return true;
            }
            if(!(o instanceof BrokerVolumeItem)) {
                return false;
            }
            BrokerVolumeItem other = (BrokerVolumeItem) o;

            return Objects.equals(this.brokerId, other.brokerId) 
                    && Objects.equals(this.brokerName, other.brokerName)
                    && Objects.equals(this.salesId, other.salesId)
                    && Objects.equals(this.salesName, other.salesName)
                    && Objects.equals(this.groups, other.groups)
                    && Objects.equals(this.members, other.members)
                    && Objects.equals(this.carriers, other.carriers);
        }

        @Override
        public int hashCode() {
            return Objects.hash(brokerId, brokerName, salesId, salesName, groups, members, carriers);
        } 
    }

    private Integer groupsTotal;
    private Integer membersTotal;
    private List<BrokerVolumeItem> items = new ArrayList<>();
    
    public BrokerVolumeDto() {}

    public Integer getGroupsTotal() {
        return groupsTotal;
    }

    public void setGroupsTotal(Integer groupsTotal) {
        this.groupsTotal = groupsTotal;
    }

    public Integer getMembersTotal() {
        return membersTotal;
    }

    public void setMembersTotal(Integer membersTotal) {
        this.membersTotal = membersTotal;
    }
    
    public List<BrokerVolumeItem> getItems() {
        return items;
    }

    public void setItems(List<BrokerVolumeItem> items) {
        this.items = items;
    }
}

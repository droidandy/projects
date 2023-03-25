import React from 'react';
import PropTypes from 'prop-types';
import { extractFloat } from '@benrevo/benrevo-react-core';
import Medical from './components/Medical';
import Dental from './components/Dental';
import { MEDICAL_SECTION } from '../constants';
import RXHMO from '../Plans/RXHMO';
import RXPPO from '../Plans/RXPPO';
import RXHSA from '../Plans/RXHSA';
import HMO from '../Plans/HMO';
import PPO from '../Plans/PPO';
import HSA from '../Plans/HSA';
import DPPO from '../Plans/DPPO';
const templates = {
  HMO: { ...HMO, rx: [...RXHMO.benefits] },
  PPO: { ...PPO, rx: [...RXPPO.benefits] },
  HSA: { ...HSA, rx: [...RXHSA.benefits] },
  DPPO: { ...DPPO },
};
class ProductBenefits extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    plans: PropTypes.array.isRequired,
    benefitsPlans: PropTypes.array.isRequired,
    selectedBenefits: PropTypes.object.isRequired,
    changePlanField: PropTypes.func.isRequired,
    selectBenefits: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.changeField = this.changeField.bind(this);
    this.checkDependency = this.checkDependency.bind(this);
  }

  changeField(index, key, type, valueKey, value, planType) {
    const { section, changePlanField, benefitsPlans } = this.props;
    const sysName = (benefitsPlans[index]) ? benefitsPlans[index][type][key].sysName : templates[planType][type][key].sysName;
    const benefits = (benefitsPlans[index]) ? benefitsPlans[index].benefits : templates[planType].benefits;

    changePlanField(section, index, key, type, valueKey, value, planType);

    if (planType === 'HMO' && (sysName === 'IP_DAY_MAX' || sysName === 'INPATIENT_HOSPITAL' || sysName === 'IP_COPAY_TYPE')) {
      let INPATIENT_HOSPITAL = null;
      let IP_DAY_MAX = null;
      let IP_COPAY_TYPE = null;
      let ipCopayMaxKey = 0;
      let ipCopayTypeValue = null;
      let ipDayMaxValue = null;
      let ipHospitalValue = null;

      for (let i = 0; i < benefits.length; i += 1) {
        const benefit = benefits[i];

        if (benefit.sysName === 'IP_COPAY_MAX') {
          ipCopayMaxKey = i;
        }

        if (benefit.sysName === 'INPATIENT_HOSPITAL') {
          INPATIENT_HOSPITAL = benefit;
        }

        if (benefit.sysName === 'IP_COPAY_TYPE') {
          IP_COPAY_TYPE = benefit;
        }

        if (benefit.sysName === 'IP_DAY_MAX') {
          IP_DAY_MAX = benefit;
        }
      }

      if (sysName === 'IP_COPAY_TYPE') ipCopayTypeValue = value;
      else ipCopayTypeValue = IP_COPAY_TYPE.value;

      if (sysName === 'IP_DAY_MAX') ipDayMaxValue = extractFloat(value)[0];
      else ipDayMaxValue = extractFloat(IP_DAY_MAX.value)[0];

      if (sysName === 'INPATIENT_HOSPITAL') ipHospitalValue = extractFloat(value)[0];
      else ipHospitalValue = extractFloat(INPATIENT_HOSPITAL.value)[0];

      if (ipCopayTypeValue === 'Day') {
        const ipCopayMaxValue = (ipHospitalValue !== undefined && ipDayMaxValue !== undefined && ipHospitalValue !== null && ipDayMaxValue !== null) ? ipHospitalValue * ipDayMaxValue : 0;
        changePlanField(section, index, ipCopayMaxKey, 'benefits', 'value', `$${ipCopayMaxValue}`, planType);
      } else {
        changePlanField(section, index, ipCopayMaxKey, 'benefits', 'value', ipHospitalValue, planType);
      }
    }
  }

  checkDependency(field, benefits) {
    if (!field.dependency) return true;

    for (let i = 0; i < Object.keys(field.dependency).length; i += 1) {
      const sysName = Object.keys(field.dependency)[i];
      const value = field.dependency[sysName];

      for (let j = 0; j < benefits.length; j += 1) {
        const benefit = benefits[j];

        if (sysName === benefit.sysName && (benefit.value === value || benefit.valueIn === value || benefit.valueOut === value)) {
          return true;
        }
      }
    }

    return false;
  }

  render() {
    const {
      section,
      title,
      plans,
      benefitsPlans,
      selectedBenefits,
      selectBenefits,
    } = this.props;

    if (section === MEDICAL_SECTION) {
      return (
        <Medical
          section={section}
          plans={plans}
          benefitsPlans={benefitsPlans}
          title={title}
          templates={templates}
          changeField={this.changeField}
          checkDependency={this.checkDependency}
        />
      );
    }
    return (
      <Dental
        section={section}
        title={title}
        plans={plans}
        benefitsPlans={benefitsPlans}
        templates={templates}
        selectedBenefits={selectedBenefits}
        changeField={this.changeField}
        selectBenefits={selectBenefits}
      />
    );
  }
}

export default ProductBenefits;

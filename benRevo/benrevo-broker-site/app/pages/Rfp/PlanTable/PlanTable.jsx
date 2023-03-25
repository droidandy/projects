import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Form, Input } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { extractFloat } from '@benrevo/benrevo-react-core';
import DHMO_ADA from '../Plans/DHMO-ADA.json';
import RXHMO from '../Plans/RXHMO';
import RXPPO from '../Plans/RXPPO';
import RXHSA from '../Plans/RXHSA';
import HMO from '../Plans/HMO';
import PPO from '../Plans/PPO';
import HSA from '../Plans/HSA';
import DHMO from '../Plans/DHMO';
import DPPO from '../Plans/DPPO';
import VISION from '../Plans/Vision';
const templates = {
  HMO: { ...HMO, rx: [...RXHMO.benefits] },
  PPO: { ...PPO, rx: [...RXPPO.benefits] },
  HSA: { ...HSA, rx: [...RXHSA.benefits] },
  DHMO: { ...DHMO },
  DPPO: { ...DPPO },
  VISION: { ...VISION },
};

class PlanTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    changePlanField: PropTypes.func.isRequired,
    benefitsPlans: PropTypes.array.isRequired,
    rfpCarriers: PropTypes.array.isRequired,
    planNetworks: PropTypes.object.isRequired,
    plans: PropTypes.array.isRequired,
    editPlanName: PropTypes.bool,
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
      let IP_COPAY_MAX = null;
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
          IP_COPAY_MAX = benefit;
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

  selectCarrierById(carrierId) {
    const { rfpCarriers } = this.props;

    for (let j = 0; j < rfpCarriers.length; j += 1) {
      const listItem = rfpCarriers[j].carrier;

      if (listItem.carrierId === carrierId) return listItem;
    }

    return {};
  }

  selectNetworkById(networkId, index) {
    const { planNetworks } = this.props;

    if (planNetworks[index]) {
      for (let j = 0; j < planNetworks[index].length; j += 1) {
        const listItem = planNetworks[index][j];

        if (listItem.value === networkId) return listItem;
      }
    }
    return {};
  }

  render() {
    const {
      section,
      benefitsPlans,
      plans,
      editPlanName,
      changePlanField,
    } = this.props;

    return (
      <div>
        <Helmet
          title="Plans"
          meta={[
            { name: 'description', content: 'Description of Plans' },
          ]}
        />

        <Grid stackable columns={2} as={Segment} className="gridSegment rfp-benefits">
          <Grid.Row>
            <Grid.Column width={16}>
              { plans.map((plan, i) => {
                const carrier = this.selectCarrierById(plan.selectedCarrier.carrierId);
                const network = this.selectNetworkById(plan.selectedNetwork.networkId, i);
                const planType = plan.title;
                const template = templates[planType];
                const benefitPlan = benefitsPlans[i] || template;
                // console.log('benefitsPlans[i]', benefitsPlans[i], 'template', template);
                return (
                  <Grid key={i}>
                    <Grid.Row className="rfpRowDivider">
                      <Grid.Column width={2}>
                        <Header as="h3" className="rfpPageSectionHeading">{planType}</Header>
                        { planType === 'DHMO' &&
                          <Grid className="adaTable">
                            {DHMO_ADA.map((item, j) =>
                              <Grid.Row key={item} className="planInputRow">
                                <Grid.Column width={2} className="adaColumn">
                                  <span>{item}</span>
                                </Grid.Column>
                              </Grid.Row>
                            )}
                          </Grid>
                        }
                      </Grid.Column>
                      <Grid.Column computer={12} mobile={14}>
                        <Form>
                          <Form.Field>
                            <Grid>
                              <Grid.Row>
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>Carrier</span>
                                </Grid.Column>
                                <Grid.Column width={10} className="plan-name">
                                  {carrier.displayName || '-'}
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row>
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>Network</span>
                                </Grid.Column>
                                <Grid.Column width={10} className="plan-name">
                                  {network.text || '-'}
                                </Grid.Column>
                              </Grid.Row>

                              <Grid.Row className="header-second">
                                <Grid.Column width={16}> </Grid.Column>
                              </Grid.Row>

                              <Grid.Row>
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>Plan name</span>
                                </Grid.Column>

                                <Grid.Column width={10} className="plan-name">
                                  { editPlanName &&
                                    <Input
                                      name={`name_${i}`}
                                      value={benefitPlan.planName}
                                      placeholder="Enter plan name"
                                      onChange={(e, inputState) => {
                                        changePlanField(section, i, null, 'planName', null, inputState.value, planType);
                                      }}
                                    />
                                  }
                                  { !editPlanName &&
                                    <span>{plan.name || '-'}</span>
                                  }
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row className="header-second">
                                <Grid.Column width={16}> </Grid.Column>
                              </Grid.Row>
                              { (planType === 'PPO' || planType === 'HSA' || planType === 'DPPO') &&
                              <Grid.Row>
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>BENEFITS</span>
                                </Grid.Column>
                                <Grid.Column width={5} className="labelColumn network" verticalAlign="middle">
                                  <span>IN-NETWORK</span>
                                </Grid.Column>
                                <Grid.Column width={5} className="labelColumn network" verticalAlign="middle">
                                  <span>OUT-NETWORK</span>
                                </Grid.Column>
                              </Grid.Row> ||
                              <Grid.Row>
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>BENEFITS</span>
                                </Grid.Column>
                                <Grid.Column width={10} className="labelColumn" verticalAlign="middle">
                                  <span> </span>
                                </Grid.Column>
                              </Grid.Row>
                              }
                              { benefitPlan.benefits.map((item, j) =>
                                item.type && !item.hidden && this.checkDependency(item, benefitPlan.benefits) &&
                                <Grid.Row key={item.sysName} className="planInputRow">
                                  <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                    <span>{item.name}</span>
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    { item.options && item.options.length &&
                                    <Form.Dropdown
                                      className="carrier-dropdown"
                                      placeholder="Choose"
                                      name={`${item.sysName}_${i}`}
                                      search
                                      selection
                                      options={item.options}
                                      value={item.value}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'value', inputState.value, planType);
                                      }}
                                    /> ||
                                    <Input
                                      name={`${item.sysName}_${i}`}
                                      id={item.sysName}
                                      value={item.value}
                                      placeholder={item.placeholder}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'value', inputState.value, planType);
                                      }}
                                    />
                                    }
                                  </Grid.Column>
                                </Grid.Row> || (!item.hidden && this.checkDependency(item, benefitPlan.benefits)) &&
                                <Grid.Row key={item.sysName} className="planInputRow">
                                  <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                    <span>{item.name}</span>
                                  </Grid.Column>
                                  <Grid.Column width={5}>
                                    { item.options && item.options.length &&
                                    <Form.Dropdown
                                      className="carrier-dropdown"
                                      placeholder="Choose"
                                      name={`${item.sysName}_IN_${i}`}
                                      search
                                      selection
                                      options={item.options}
                                      value={item.valueIn}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'valueIn', inputState.value, planType);
                                      }}
                                    /> ||
                                    <Input
                                      className={(item.hideIn) ? 'inline hidden' : 'inline'}
                                      name={`${item.sysName}_IN_${i}`}
                                      id={`${item.sysName}_IN_${i}`}
                                      value={item.valueIn}
                                      placeholder={item.placeholderIn}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'valueIn', inputState.value, planType);
                                      }}
                                    />
                                    }
                                  </Grid.Column>
                                  <Grid.Column width={5}>
                                    { item.options && item.options.length &&
                                    <Form.Dropdown
                                      className="carrier-dropdown"
                                      placeholder="Choose"
                                      name={`${item.sysName}_OUT_${i}`}
                                      search
                                      selection
                                      options={item.options}
                                      value={item.valueOut}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'valueOut', inputState.value, planType);
                                      }}
                                    /> ||
                                    <Input
                                      className="inline"
                                      name={`${item.sysName}_OUT_${i}`}
                                      id={`${item.sysName}_OUT_${i}`}
                                      value={item.valueOut}
                                      placeholder={item.placeholderOut}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'benefits', 'valueOut', inputState.value, planType);
                                      }}
                                    />
                                    }
                                  </Grid.Column>
                                </Grid.Row>
                              )}
                              { (benefitPlan.rx && benefitPlan.rx.length > 0) &&
                              <Grid.Row className="rx-header-block">
                                <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                  <span>RX</span>
                                </Grid.Column>
                                <Grid.Column width={10} className="labelColumn" verticalAlign="middle">
                                  <span> </span>
                                </Grid.Column>
                              </Grid.Row>
                              }
                              { (benefitPlan.rx && benefitPlan.rx.length > 0) &&
                              benefitPlan.rx.map((item, j) =>
                                <Grid.Row key={j} className="planInputRow rx-row">
                                  <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                                    <span>{item.name}</span>
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Input
                                      id={item.sysName}
                                      name={`${item.sysName}_${i}`}
                                      value={item.value}
                                      placeholder={item.placeholder}
                                      onChange={(e, inputState) => {
                                        this.changeField(i, j, 'rx', 'value', inputState.value, planType);
                                      }}
                                    />
                                  </Grid.Column>
                                </Grid.Row>
                              )
                              }
                            </Grid>
                          </Form.Field>
                        </Form>
                      </Grid.Column>
                      <Grid.Column width={4}> </Grid.Column>
                    </Grid.Row>
                    { (benefitsPlans.length > 1 && i !== benefitsPlans.length - 1) &&
                    <div className="planDivider"> </div>
                    }
                  </Grid>
                );
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default PlanTable;

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Dimmer, Loader, Form, Input } from 'semantic-ui-react';
import { extractFloat } from '../../../utils/form';
import { checkDependency } from '../selectors';

import { changeCurrentCarrier, changeCurrentNetwork } from '../actions';

class PlanTable extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    loadingPlans: PropTypes.bool.isRequired,
    plansTemplates: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    updatePlanField: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    carrierHistory: PropTypes.array.isRequired,
    networks: PropTypes.object.isRequired,
    changeNetwork: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.changePlanField = this.changePlanField.bind(this);
  }

  changePlanField(index1, index2, valType, value, rxFlag) {
    const { section, updatePlanField, plansTemplates } = this.props;
    let sysName = '';
    if (!rxFlag) sysName = plansTemplates[index1].benefits[index2].sysName;
    updatePlanField(section, index1, index2, valType, value, rxFlag);

    if (plansTemplates[index1].planType === 'HMO' && (sysName === 'IP_DAY_MAX' || sysName === 'INPATIENT_HOSPITAL' || sysName === 'IP_COPAY_TYPE')) {
      let INPATIENT_HOSPITAL = null;
      let IP_DAY_MAX = null;
      let IP_COPAY_TYPE = null;
      let ipCopayMaxKey = 0;
      let ipCopayTypeValue = null;
      let ipDayMaxValue = null;
      let ipHospitalValue = null;

      for (let i = 0; i < plansTemplates[index1].benefits.length; i += 1) {
        const benefit = plansTemplates[index1].benefits[i];

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
        updatePlanField(section, index1, ipCopayMaxKey, 'value', `$${ipCopayMaxValue}`, false);
      } else {
        updatePlanField(section, index1, ipCopayMaxKey, 'value', ipHospitalValue, false);
      }
    }
  }

  render() {
    const { plansTemplates, loadingPlans, carrierHistory, section, changeCarrier, networks, changeNetwork } = this.props;
    let carrierList = [];
    if (carrierHistory && carrierHistory.length > 0) {
      carrierList = carrierHistory.map((item) => ({
        key: item.carrierId,
        value: item.carrierId,
        text: item.displayName,
      }));
    }

    if (!loadingPlans) {
      return (
        <div className="add-plan-table">
          { plansTemplates.map((template, i) => {
            let networksList = [];
            const carrierId = template.selectedCarrier.carrierId;
            const networkId = template.selectedNetwork.networkId;
            const planType = template.planType;
            const networkType = `${(planType === 'H.S.A') ? 'HSA' : planType}_${carrierId}`;
            if (networks && networks[networkType] && networks[networkType].length > 0) {
              networksList = networks[networkType].map((item) => ({
                key: item.networkId,
                value: item.networkId,
                text: item.name,
              }));
            }
            return (
              <Grid key={i}>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <header className="plan-table-type">{planType} {template.isKaiser && ' KAISER'}</header>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Form>
                      <Form.Field>
                        <Grid>
                          <Grid.Row className="plan-input-row">
                            <Grid.Column width={6} className="label-column">
                              <span>Carrier</span>
                            </Grid.Column>
                            <Grid.Column width={10}>
                              <Form.Dropdown
                                className="carrier-dropdown"
                                placeholder="Choose"
                                search
                                selection
                                options={carrierList}
                                value={carrierId}
                                onChange={(e, inputState) => {
                                  changeCarrier(section, inputState.value, i, planType);
                                }}
                              />
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row className="plan-input-row">
                            <Grid.Column width={6} className="label-column">
                              <span>Network</span>
                            </Grid.Column>
                            <Grid.Column width={10}>
                              <Form.Dropdown
                                placeholder="Choose"
                                className="network-dropdown"
                                search
                                selection
                                options={networksList}
                                value={networkId}
                                onChange={(e, inputState) => { changeNetwork(section, inputState.value, i, carrierId, (planType === 'H.S.A') ? 'HSA' : planType); }}
                              />
                            </Grid.Column>
                          </Grid.Row>

                          <Grid.Row className="header-second">
                            <Grid.Column width={16}> </Grid.Column>
                          </Grid.Row>

                          <Grid.Row>
                            <Grid.Column width={6} className="label-column">
                              <span>Plan name</span>
                            </Grid.Column>
                            <Grid.Column width={10}>
                              <Input
                                id="planName"
                                value={template.planName}
                                error={template.nameError}
                                onChange={(e, inputState) => {
                                  this.changePlanField(i, 0, 'name', inputState.value);
                                }}
                                className="plan-form-input"
                              />
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row className="header-second">
                            <Grid.Column width={16}> </Grid.Column>
                          </Grid.Row>
                          { (planType === 'PPO' || planType === 'H.S.A' || planType === 'DPPO') &&
                          <Grid.Row>
                            <Grid.Column width={6} className="label-column">
                              <span>BENEFITS</span>
                            </Grid.Column>
                            <Grid.Column width={5} className="label-column network">
                              <span>IN-NETWORK</span>
                            </Grid.Column>
                            <Grid.Column width={5} className="label-column network">
                              <span>OUT-NETWORK</span>
                            </Grid.Column>
                          </Grid.Row> ||
                          <Grid.Row>
                            <Grid.Column width={6} className="label-column">
                              <span>BENEFITS</span>
                            </Grid.Column>
                            <Grid.Column width={10} className="label-column">
                              <span> </span>
                            </Grid.Column>
                          </Grid.Row>
                          }
                          { template.benefits.map((item, j) =>
                            item.type && !item.hidden && checkDependency(item, template.benefits) &&
                            <Grid.Row key={j} className="plan-input-row">
                              <Grid.Column width={6} className="label-column">
                                <span>{item.name}</span>
                              </Grid.Column>
                              <Grid.Column width={10}>
                                { item.options && item.options.length &&
                                <Form.Dropdown
                                  className="carrier-dropdown"
                                  placeholder="Choose"
                                  search
                                  selection
                                  options={item.options}
                                  value={item.value}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'value', inputState.value);
                                  }}
                                /> ||
                                <Input
                                  name={item.sysName}
                                  id={item.sysName}
                                  value={item.value}
                                  placeholder={item.placeholder}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'value', inputState.value);
                                  }}
                                  className="plan-form-input"
                                />
                                }
                              </Grid.Column>
                            </Grid.Row> || (!item.hidden && checkDependency(item, template.benefits)) &&
                            <Grid.Row key={j} className="plan-input-row">
                              <Grid.Column width={6} className="label-column">
                                <span>{item.name}</span>
                              </Grid.Column>
                              <Grid.Column width={5}>
                                { item.sysName !== 'REIMBURSEMENT_SCHEDULE' && item.options && item.options.length &&
                                <Form.Dropdown
                                  className="carrier-dropdown"
                                  placeholder="Choose"
                                  search
                                  selection
                                  options={item.options}
                                  value={item.valueIn}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'valueIn', inputState.value);
                                  }}
                                /> ||
                                <Input
                                  name={`${item.sysName}_IN`}
                                  id={`${item.sysName}_IN`}
                                  value={item.valueIn}
                                  placeholder={item.placeholderIn}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'valueIn', inputState.value);
                                  }}
                                  className="plan-form-input"
                                />
                                }
                              </Grid.Column>
                              <Grid.Column width={5}>
                                { item.options && item.options.length &&
                                <Form.Dropdown
                                  className="carrier-dropdown"
                                  placeholder="Choose"
                                  search
                                  selection
                                  options={item.options}
                                  value={item.valueOut}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'valueOut', inputState.value);
                                  }}
                                /> ||
                                <Input
                                  className="plan-form-input"
                                  name={`${item.sysName}_OUT`}
                                  id={`${item.sysName}_OUT`}
                                  value={item.valueOut}
                                  placeholder={item.placeholderOut}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'valueOut', inputState.value);
                                  }}
                                />
                                }
                              </Grid.Column>
                            </Grid.Row>
                          )}
                          { (template.rx && template.rx.length > 0) &&
                          <Grid.Row className="rx-header-block">
                            <Grid.Column width={6} className="label-column">
                              <span>RX</span>
                            </Grid.Column>
                            <Grid.Column width={10} className="label-column">
                              <span> </span>
                            </Grid.Column>
                          </Grid.Row>
                          }
                          { (template.rx && template.rx.length > 0) &&
                          template.rx.map((item, j) =>
                            <Grid.Row key={j} className="plan-input-row rx-row">
                              <Grid.Column width={6} className="label-column">
                                <span>{item.name}</span>
                              </Grid.Column>
                              <Grid.Column width={10}>
                                <Input
                                  id={item.sysName}
                                  name={item.sysName}
                                  value={item.value}
                                  placeholder={item.placeholder}
                                  onChange={(e, inputState) => {
                                    this.changePlanField(i, j, 'value', inputState.value, true);
                                  }}
                                  className="plan-form-input"
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
                { (plansTemplates.length > 1 && i !== plansTemplates.length - 1) &&
                <div className="plan-divider"> </div>
                }
              </Grid>
            );
          })}
        </div>
      );
    }
    const active = true;
    return (
      <div className="add-plan-table dimmer">
        <Dimmer active={active} inverted>
          <Loader indeterminate size="big">Getting plans templates</Loader>
        </Dimmer>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('plans');

  return {
    carrierHistory: overviewState.get(ownProps.section).toJS().carrierHistory,
    networks: overviewState.get(ownProps.section).toJS().networks,
    loadingPlans: overviewState.toJS().loadingPlans,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    changeCarrier: (section, carrierId, index, planType) => { dispatch(changeCurrentCarrier(section, carrierId, index, planType)); },
    changeNetwork: (section, networkId, index, carrierId, planType) => { dispatch(changeCurrentNetwork(section, networkId, index, carrierId, planType)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanTable);

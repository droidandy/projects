import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Input, Button, Loader } from 'semantic-ui-react';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';
import volLifeCostList from '../../../components/CostComponents/volLifeCostList';
import volLifeBenefitsList from '../../../components/BenefitsComponents/volLifeBenefitsList';
import volStdCostList from '../../../components/CostComponents/volStdCostList';
import volStdBenefitsList from '../../../components/BenefitsComponents/volStdBenefitsList';
import volLtdCostList from '../../../components/CostComponents/volLtdCostList';
import volLtdBenefitsList from '../../../components/BenefitsComponents/volLtdBenefitsList';
import planRatesTemplate from './planRatesTemplate';
import * as types from '../../../constants';

class NewPlanColumnVol extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    newPlan: PropTypes.object.isRequired,
    currentPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    status: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    addPlanVol: PropTypes.func.isRequired,
    savePlanVol: PropTypes.func.isRequired,
    cancelAddingPlan: PropTypes.func.isRequired,
    networkIndex: PropTypes.number.isRequired,
    rfpQuoteNetworkId: PropTypes.number,
    updatePlanField: PropTypes.func.isRequired,
    optionName: PropTypes.string.isRequired,
    editPlanField: PropTypes.func,
    detailedPlan: PropTypes.object.isRequired,
    benefitsLoading: PropTypes.bool,
    editingPlan: PropTypes.string.isRequired,
  };

  static defaultProps = {
    planIndex: null,
    rfpQuoteNetworkId: null,
    editPlanField: () => {},
    secondPosition: false,
    benefitsLoading: false,
    planToEdit: {},
  };

  constructor(props) {
    super(props);
    this.changePlanField = this.changePlanField.bind(this);
    this.setParams = this.setParams.bind(this);
    this.showManualInput = this.showManualInput.bind(this);
    this.cancelAddingPlan = this.cancelAddingPlan.bind(this);
    this.validateName = this.validateName.bind(this);

    this.state = {
      twoColsFlag: false,
      addPlanManually: false,
      position: null,
      selectedBenefits: 1,
    };
    this.typeOfPlan = 'alt';
    this.newColumn = null;
  }

  componentDidMount() {
    const {
      editingPlan,
      section,
    } = this.props;
    // if new Plan
    if (!editingPlan) {
      const plan = {
        ancillaryPlanId: null,
        carrierDisplayName: null,
        carrierName: null,
        percentDifference: null,
        planName: null,
        planYear: 0,
        rfpQuoteAncillaryPlanId: null,
        rfpQuoteId: null,
        selectedSecond: null,
        type: 'alternative',
        matchPlan: false,
        selected: false,
        planType: 'VOLUNTARY',
      };
      if (section === types.VOL_LIFE_SECTION) {
        const classItem = {
          javaclass: 'LifeClassDto',
          name: 'className',
          ancillaryClassId: null,
        };
        volLifeBenefitsList.forEach((benefit) => {
          if (benefit.key !== '') {
            classItem[benefit.key] = null;
          }
        });
        plan.classes = [classItem, classItem, classItem, classItem];
        plan.rates = planRatesTemplate;
      }
      if (section === types.VOL_STD_SECTION) {
        const classItem = {
          javaclass: 'StdClassDto',
          name: 'className',
          ancillaryClassId: null,
        };
        volStdBenefitsList.forEach((benefit) => {
          if (benefit.key !== '') {
            classItem[benefit.key] = null;
          }
        });
        plan.classes = [classItem, classItem, classItem, classItem];
        plan.rates = planRatesTemplate;
      }
      if (section === types.VOL_LTD_SECTION) {
        const classItem = {
          javaclass: 'LtdClassDto',
          name: 'className',
          ancillaryClassId: null,
        };
        volLtdBenefitsList.forEach((benefit) => {
          if (benefit.key !== '') {
            classItem[benefit.key] = null;
          }
        });
        plan.classes = [classItem, classItem, classItem, classItem];
        plan.rates = planRatesTemplate;
      }
      this.definePlan(plan);
    } else {
      this.definePlan(editingPlan);
    }
  }

  setParams() {
    const { status } = this.props;
    const altColumns = document.querySelectorAll('.alternatives-table-column');
    const newColumn = document.getElementById('new-plan');
    let leftOffset = 0;
    const planIndex = (status === 'newAlt' || status === 'editAlt') ? 2 : 1;
    if (newColumn && altColumns && altColumns.length) {
      leftOffset = (planIndex * 300) - 21;
      this.typeOfPlan = 'alt';
      newColumn.style.left = `${leftOffset + 19}px`;
      newColumn.style.top = `${altColumns[0].offsetTop - 18}px`;
    }
  }

  definePlan(plan) {
    const {
      newPlan,
      section,
      rfpQuoteNetworkId,
      status,
    } = this.props;
    const newStatus = (status === 'new' || status === 'newAlt' || status === 'newSelected' || status === 'newMatch');
    if (plan.carrier) {
      newPlan.carrier = plan.carrier;
    }
    newPlan.rfpQuoteAncillaryPlanId = newStatus ? null : plan.rfpQuoteAncillaryPlanId;
    newPlan.ancillaryPlanId = newStatus ? null : plan.ancillaryPlanId;
    newPlan.classes = plan.classes;
    newPlan.rates = plan.rates;
    newPlan.rfpQuoteId = plan.rfpQuoteId;
    newPlan.selected = plan.selected;
    newPlan.carrierId = plan.carrierId;
    newPlan.matchPlan = (status === 'newMatch') ? true : plan.matchPlan;
    newPlan.planType = plan.planType;
    newPlan.planYear = plan.planYear;
    newPlan.name = newStatus ? '' : plan.planName;
    newPlan.nameByNetwork = newStatus ? '' : plan.planName;
    newPlan.rfpQuoteNetworkId = rfpQuoteNetworkId;
    this.props.updatePlanField(section, 'newPlan', newPlan, '');
  }

  showManualInput(pnnId) {
    if (pnnId === 'addPlan') {
      this.setState({ addPlanManually: true });
    }
  }

  cancelAddingPlan(oldStatus, typeOfPlan) {
    const { cancelAddingPlan, updatePlanField, section } = this.props;
    updatePlanField(section, 'newPlan', {}, '');
    cancelAddingPlan(oldStatus, typeOfPlan);
  }

  changePlanField(e, name, value, part, valName) {
    const { section, editPlanField } = this.props;
    if ((part === 'cost' && validator.isFloat(value)) || part !== 'cost') {
      editPlanField(section, name, value, part, valName, this.props.status);
    }
  }

  handleBenefitsClasses = (e, { value }) => {
    this.setState({ selectedBenefits: value }
    );
  };

  validateName() {
    const { newPlan, status } = this.props;
    const strippedName = newPlan.name && newPlan.name.replace(new RegExp(' ', 'g'), '');
    const oldStatus = (status === 'editAlt' || status === 'editSelected' || status === 'edit') ? 'edit' : 'new';
    if (oldStatus && strippedName !== '') {
      return true;
    }
    scrollToInvalid(['plan-name'], null, null, null);
    return false;
  }

  render() {
    const {
      newPlan,
      planIndex,
      savePlanVol,
      section,
      networkIndex,
      optionName,
      currentPlan,
      benefitsLoading,
      detailedPlan,
      status,
      addPlanVol,
    } = this.props;
    this.setParams();
    // const { addPlanManually } = this.state;
    newPlan.carrier = currentPlan.carrier;
    const oldStatus = (this.props.status === 'editAlt' || this.props.status === 'editSelected' || this.props.status === 'edit') ? 'edit' : 'new';
    let current = null;

    for (let i = 0; i < detailedPlan.plans.length; i += 1) {
      const plan = detailedPlan.plans[i];
      if (plan.type === 'current') {
        current = plan;
        break;
      }
    }
    if (current && newPlan && newPlan.classes && current.classes.length < newPlan.classes.length) {
      current = newPlan;
    }
    if (current === null) {
      current = newPlan;
    }

    const optionsBenefits = [
      { key: 1, text: 'Class 1 & 2', value: 1 },
      { key: 2, text: 'Class 3 & 4', value: 2 },
    ];
    if (current && current.classes && current.classes.length === 3) {
      optionsBenefits[1] = { key: 2, text: 'Class 3', value: 2 };
    }
    // console.log('newPlanColumnVol props', this.props);
    return (
      <Grid.Row id="new-plan" className={`new-plan-next life ${section}`} ref={(c) => { this.newColumn = c; }}>
        <Grid columns={1} className={optionName && optionName === 'Renewal' ? 'renewal newPlanHeader' : 'newPlanHeader'}>
          <Grid.Row className="center-aligned plan-name-header">
            { !benefitsLoading &&
            <span className="hdr">Edit Plan Information:</span>
            }
            { benefitsLoading &&
            <Grid.Row className="alternatives-container centered">
              <Loader inline active={benefitsLoading} indeterminate size="medium">Loading benefits</Loader>
            </Grid.Row>
            }
            <div className="edit-benefits-info-space"></div>
          </Grid.Row>
          { oldStatus &&
          <Grid.Row className="input-row plan-name-title">
            <Input
              type="text"
              name="plan-name"
              placeholder="Enter plan name"
              value={newPlan.name}
              onChange={(e, inputState) => {
                this.changePlanField(e, 'planName', 'nameByNetwork', inputState.value, '', this.typeOfPlan);
              }}
            />
          </Grid.Row>
          }
        </Grid>
        {/* cost */}
        { (section === types.VOL_LIFE_SECTION && newPlan.rates) && volLifeCostList.map((item, j) => {
          if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyCost') {
            if (item.key.indexOf('age') !== -1) {
              const ind = item.key.substring(3, item.length);
              return (
                <Grid columns={3} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                  <Grid.Row className="input-row">
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind] ? newPlan.rates.ages[ind].currentEmp : ''}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmp', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind] ? newPlan.rates.ages[ind].currentEmpTobacco : ''}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmpTobacco', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind] ? newPlan.rates.ages[ind].currentSpouse : ''}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentSpouse', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'monthlyRates') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column width={10}>EMPLOYEE</Grid.Column>
                    <Grid.Column width={6}>SPOUSE</Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'currentLife') {
              return (
                <Grid columns={3} key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column>NON-SMOKER</Grid.Column>
                    <Grid.Column>SMOKER</Grid.Column>
                    <Grid.Column>-</Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid vol-life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[item.key]}
                      placeholder={item.key}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'monthlyCost') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      disabled={status === 'editAlt' || status === 'editSelected' || status === 'edit'}
                      value={newPlan.rates[j]}
                      placeholder="Enter Monthly Cost ($)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'volume') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[j]}
                      placeholder="Enter Volume (Covered Weekly Benefit)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          return (
            <div key={j}></div>
          );
        })
        }
        { (section === types.VOL_STD_SECTION && newPlan.rates) && volStdCostList.map((item, j) => {
          if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyCost') {
            if (item.key.indexOf('age') !== -1) {
              const ind = item.key.substring(3, item.length);
              return (
                <Grid columns={3} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                  <Grid.Row className="input-row">
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentEmp}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmp', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentEmpTobacco}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmpTobacco', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentSpouse}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentSpouse', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'monthlyRates') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'std') {
              return (
                <Grid columns={3} key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid vol-life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[item.key]}
                      placeholder={item.key}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'monthlyCost') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[j]}
                      placeholder="Enter Monthly Cost ($)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'volume') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[j]}
                      placeholder="Enter Volume (Covered Weekly Benefit)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          return (
            <div key={j}></div>
          );
        })
        }
        { (section === types.VOL_LTD_SECTION && newPlan.rates) && volLtdCostList.map((item, j) => {
          if (item.key !== '' && item.key !== 'volume' && item.key !== 'monthlyCost') {
            if (item.key.indexOf('age') !== -1) {
              const ind = item.key.substring(3, item.length);
              return (
                <Grid columns={3} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                  <Grid.Row className="input-row">
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentEmp}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmp', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentEmpTobacco}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentEmpTobacco', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        maxLength="55"
                        type="text"
                        value={newPlan.rates.ages[ind].currentSpouse}
                        placeholder={'Enter amount'}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, 'currentSpouse', inputState.value, 'ages', ind, oldStatus, planIndex);
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'monthlyRates') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            if (item.key === 'ltd') {
              return (
                <Grid columns={3} key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid vol-life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[item.key]}
                      placeholder={item.key}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'monthlyCost') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[j]}
                      placeholder="Enter Monthly Cost ($)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          if (item.key === 'volume') {
            return (
              <Grid columns={1} key={j} className={`new-row-grid vol-life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      value={newPlan.rates[j]}
                      placeholder="Enter Volume (Covered Weekly Benefit)"
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'rates', item.key, oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }
          return (
            <div key={j}></div>
          );
        })
        }
        {/* benefits */}
        <Grid columns={1} className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            <Grid.Column className="four-cols-benefits" />
          </Grid.Row>
        </Grid>
        <Grid columns={4} className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            <Grid.Column className="four-cols-benefits">CLASS 1 - (CLASS NAME)</Grid.Column>
            <Grid.Column className="four-cols-benefits">CLASS 2 - (CLASS NAME)</Grid.Column>
            <Grid.Column className="four-cols-benefits">CLASS 3 - (CLASS NAME)</Grid.Column>
            <Grid.Column className="four-cols-benefits">CLASS 4 - (CLASS NAME)</Grid.Column>
          </Grid.Row>
        </Grid>
        { (section === 'vol_life' && newPlan.classes) && volLifeBenefitsList.map((item, j) => {
          return (
            <Grid columns={4} key={j} className="new-row-grid benefits">
              <Grid.Row className="input-row">
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[0] ? newPlan.classes[0][item.key] : ''}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 0, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[1] ? newPlan.classes[1][item.key] : ''}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 1, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[2] ? newPlan.classes[2][item.key] : ''}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 2, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[3] ? newPlan.classes[3][item.key] : ''}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 3, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        })
        }
        { (section === 'vol_std' && newPlan.classes && newPlan.classes[0]) && volStdBenefitsList.map((item, j) => {
          return (
            <Grid columns={4} key={j} className="new-row-grid benefits">
              <Grid.Row className="input-row">
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[0][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 0, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[1][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 1, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[2][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 2, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[3][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 3, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        })
        }
        { (section === 'vol_ltd' && newPlan.classes && newPlan.classes[0]) && volLtdBenefitsList.map((item, j) => {
          return (
            <Grid columns={4} key={j} className="new-row-grid benefits">
              <Grid.Row className="input-row">
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[0][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 0, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[1][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 1, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[2][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 2, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
                <Grid.Column className="four-cols-benefits">
                  <Input
                    maxLength="55"
                    type="text"
                    placeholder={item.name}
                    value={newPlan.classes[3][item.key]}
                    onChange={(e, inputState) => {
                      this.changePlanField(e, 3, inputState.value, 'classes', item.key, oldStatus, planIndex);
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        })
        }
        <Grid columns={1} className="bottom">
          <Grid.Row className="button-row">
            <Grid.Column width={1} />
            <Grid.Column width={12}>
              { oldStatus === 'new' &&
              <Button size="medium" primary onClick={() => { if (this.validateName()) addPlanVol(section, networkIndex, status, detailedPlan.rfpQuoteId); }}>
                Add Plan
              </Button>
              }
              { oldStatus !== 'new' &&
              <Button size="medium" primary onClick={() => { if (this.validateName()) savePlanVol(newPlan); }}>Save</Button>
              }
              <Button size="medium" basic className="cancelAddingPlan" onClick={() => this.cancelAddingPlan(oldStatus, this.typeOfPlan)}>Cancel</Button>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>
      </Grid.Row>
    );
  }
}

export default NewPlanColumnVol;

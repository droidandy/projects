import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Input, Button, Loader, Dropdown } from 'semantic-ui-react';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';
import lifeCostList from '../../../components/CostComponents/lifeCostList';
import lifeBenefitsList from '../../../components/BenefitsComponents/lifeBenefitsList';
import stdCostList from '../../../components/CostComponents/stdCostList';
import stdBenefitsList from '../../../components/BenefitsComponents/stdBenefitsList';
import ltdCostList from '../../../components/CostComponents/ltdCostList';
import ltdBenefitsList from '../../../components/BenefitsComponents/ltdBenefitsList';
import planRatesTemplate from './planRatesTemplate';
import * as types from '../../../constants';

class NewPlanColumnLifeRefactored extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    updatePlanField: PropTypes.func.isRequired,
    optionName: PropTypes.string.isRequired,
    editPlanField: PropTypes.func,
    detailedPlan: PropTypes.object.isRequired,
    benefitsLoading: PropTypes.bool,
  };

  static defaultProps = {
    editPlan: null,
    planIndex: null,
    rfpQuoteNetworkId: null,
    editPlanField: () => {},
    secondPosition: false,
    benefitsLoading: false,
    modalView: false,
    element: null,
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
    this.checkNewPlan(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status !== this.props.status) {
      this.checkNewPlan(nextProps);
    }
  }

  setClasses(javaClass, plan, benefitList) {
    const classItem = {};
    benefitList.forEach((benefit) => {
      if (benefit.key !== '') {
        classItem[benefit.key] = null;
      }
    });
    plan.classes = [
      {
        javaclass: javaClass,
        name: 'Class 1',
        ancillaryClassId: null,
        ...classItem,
      }, {
        javaclass: javaClass,
        name: 'Class 2',
        ancillaryClassId: null,
        ...classItem,
      }, {
        javaclass: javaClass,
        name: 'Class 3',
        ancillaryClassId: null,
        ...classItem,
      }, {
        javaclass: javaClass,
        name: 'Class 4',
        ancillaryClassId: null,
        ...classItem,
      }
    ];
  }

  setParams() {
    const { status, detailedPlan } = this.props;
    const altColumns = document.querySelectorAll('.alternatives-table-column');
    const newColumn = document.getElementById('new-plan');
    let leftOffset = 0;
    const planIndex = (status === 'newAlt' || status === 'editAlt') ? 2 : 1;
    if (newColumn && altColumns && altColumns.length) {
      if (detailedPlan && detailedPlan.plans && detailedPlan.plans[0] && detailedPlan.plans[0].type === 'current') {
        leftOffset = (planIndex * 300) - 21;
      } else {
        leftOffset = ((planIndex * 300) - 98) - 21;
      }
      this.typeOfPlan = planIndex === 2 ? 'alt' : 'match';
      newColumn.style.left = `${leftOffset + 19}px`;
      newColumn.style.top = `${altColumns[0].offsetTop - 18}px`;
    }
  }

  checkNewPlan(props) {
    const {
      editingPlan,
      section,
    } = props;
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
        planType: 'BASIC',
      };
      plan.classes = this.defineClasses(props);
      plan.rates = planRatesTemplate;
      if (!plan.classes || !plan.classes.length) {
        if (section === types.LIFE_SECTION) {
          this.setClasses('LifeClassDto', plan, lifeBenefitsList);
        }

        if (section === types.STD_SECTION) {
          this.setClasses('StdClassDto', plan, stdBenefitsList);
        }

        if (section === types.LTD_SECTION) {
          this.setClasses('LtdClassDto', plan, ltdBenefitsList);
        }
      }
      this.definePlan(plan, props);
    } else {
      this.definePlan(editingPlan, props);
    }
  }

  defineClasses(props) {
    const { detailedPlan, status } = props;
    let current = null;
    let classes = [];
    for (let i = 0; i < detailedPlan.plans.length; i += 1) {
      const planItem = detailedPlan.plans[i];
      if (planItem.type === 'current') {
        current = planItem;
        break;
      }
    }
    if (status.indexOf('new') !== -1 && current && current.classes && current.classes.length > 0) {
      classes = current.classes;
      classes.forEach((classItem, i) => {
        Object.keys(classItem).forEach((key, j) => {
          if (key !== 'name' && key !== 'javaclass') {
            if (classes[i] && classes[i][key]) {
              classes[i][key] = null;
            }
          }
        });
      });
    }
    return classes;
  }

  definePlan(plan, props) {
    const {
      newPlan,
      section,
      rfpQuoteNetworkId,
      status,
    } = props;
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
    let finalVal = value;
    if (finalVal === '.') {
      finalVal = '0.';
    }
    const { section, editPlanField } = this.props;
    if ((part === 'rates' && (validator.isFloat(finalVal) || valName === 'rateGuarantee' || finalVal === '')) || part !== 'rates') {
      editPlanField(section, name, finalVal, part, valName, this.props.status);
    }
  }

  handleBenefitsClasses = (e, { value }) => {
    this.setState({ selectedBenefits: value }
    );
  };

  validateName() {
    const { newPlan, status } = this.props;
    const strippedName = newPlan.name && newPlan.name.replace(new RegExp(' ', 'g'), '');
    const oldStatus = status.indexOf('new') === -1 ? 'edit' : 'new';
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
      // addPlan,
      optionName,
      currentPlan,
      // quoteType,
      benefitsLoading,
      // multiMode,
      detailedPlan,
      // page,
      status,
      addPlanVol,
    } = this.props;
    let optionsBenefits = [];
    if (newPlan.classes && newPlan.classes.length > 2) {
      optionsBenefits = [
        { key: 1, text: 'Class 1 & 2', value: 1 },
        { key: 2, text: 'Class 3 & 4', value: 2 },
      ];
      if (newPlan && newPlan.classes && newPlan.classes.length === 3) {
        optionsBenefits[1] = { key: 2, text: 'Class 3', value: 2 };
      }
    }
    this.setParams();
    newPlan.carrier = currentPlan.carrier;
    const oldStatus = status.indexOf('new') === -1 ? 'edit' : 'new';
    return (
      <Grid.Row key={status} id="new-plan" className={`new-plan-next life ${section}`} ref={(c) => { this.newColumn = c; }}>
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
        { (section === types.LIFE_SECTION && newPlan.rates) && lifeCostList.map((item, j) => {
          if (item.key !== 'volume') {
            if (item.key === 'monthlyRates' || item.key === 'monthlyCost') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`} />
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className={item.key !== 'rateGuarantee' ? 'dollared life-dollared' : ''}
                      value={newPlan.rates[item.key] === null ? '' : newPlan.rates[item.key]}
                      placeholder={item.name}
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
              <Grid columns={1} key={j} className={`new-row-grid life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className="dollared life-dollared-wide"
                      value={newPlan.rates.volume === null ? '' : newPlan.rates.volume}
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
        { (section === types.STD_SECTION && newPlan.rates) && stdCostList.map((item, j) => {
          if (item.key !== 'volume') {
            if (item.key === 'monthlyRates' || item.key === 'monthlyCost') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className={item.key !== 'rateGuarantee' ? 'dollared' : ''}
                      value={newPlan.rates[item.key] === null ? '' : newPlan.rates[item.key]}
                      placeholder={item.name}
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
              <Grid columns={1} key={j} className={`new-row-grid life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      disabled
                      className="dollared"
                      value={newPlan.rates.monthlyCost === null ? '' : newPlan.rates.monthlyCost}
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
              <Grid columns={1} key={j} className={`new-row-grid life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className="dollared"
                      value={newPlan.rates.volume === null ? '' : newPlan.rates.volume}
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
        { (section === types.LTD_SECTION && newPlan.rates) && ltdCostList.map((item, j) => {
          if (item.key !== 'volume') {
            if (item.key === 'monthlyRates' || item.key === 'monthlyCost') {
              return (
                <Grid key={j} className="new-row-grid cost">
                  <Grid.Row className={`input-row empty ${section}`}>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid life cost">
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className={item.key !== 'rateGuarantee' ? 'dollared' : ''}
                      value={newPlan.rates[item.key] === null ? '' : newPlan.rates[item.key]}
                      placeholder={item.name}
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
              <Grid columns={1} key={j} className={`new-row-grid life ${(j === 0 || j === 1) ? 'big' : ''} ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                <Grid.Row className="input-row">
                  <Grid.Column>
                    <Input
                      maxLength="55"
                      type="text"
                      className="dollared"
                      value={newPlan.rates.volume === null ? '' : newPlan.rates.volume}
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
        <Grid className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            { newPlan.classes && newPlan.classes.length <= 2 &&
            <Grid.Column width={16}>
              <Grid className="new-row-grid benefits">
                <Grid.Column className="two-cols-benefits" />
              </Grid>
            </Grid.Column>
            }
            { newPlan.classes && newPlan.classes.length > 2 &&
            <Dropdown
              fluid
              selection
              name="benefitsClasses"
              className={'benefits-classes current'}
              options={optionsBenefits}
              text="Select Class"
              onChange={this.handleBenefitsClasses}
            /> }
            <Grid.Column width={16}>
              <Grid columns={newPlan.classes && ((newPlan.classes.length >= 2 && this.state.selectedBenefits === 1) || (newPlan.classes.length === 4 && this.state.selectedBenefits !== 1)) ? 2 : 1} className="new-row-grid benefits">
                <Grid.Row>
                  <Grid.Column className="two-cols-benefits">
                    { this.state.selectedBenefits === 1 ? (newPlan.classes && newPlan.classes[0] && newPlan.classes[0].name) : (newPlan.classes && newPlan.classes[2] && newPlan.classes[2].name) }
                  </Grid.Column>
                  { newPlan.classes && (newPlan.classes.length === 2 || newPlan.classes.length === 4 || (this.state.selectedBenefits === 1 && newPlan.classes.length === 3)) &&
                  <Grid.Column className="two-cols-benefits">
                    { this.state.selectedBenefits === 1 ? (newPlan.classes && newPlan.classes[1] && newPlan.classes[1].name) : (newPlan.classes && newPlan.classes[3] && newPlan.classes[3].name) }
                  </Grid.Column>
                  }
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        { (section === 'life' && newPlan.classes) && lifeBenefitsList.map((item, j) =>
          <BenefitsInner
            newPlan={newPlan}
            selectedBenefits={this.state.selectedBenefits}
            item={item}
            oldStatus={oldStatus}
            planIndex={planIndex}
            j={j}
            changePlanField={this.changePlanField}
          />
        )}
        { (section === 'std' && newPlan.classes && newPlan.classes[0]) && stdBenefitsList.map((item, j) =>
          <BenefitsInner
            newPlan={newPlan}
            selectedBenefits={this.state.selectedBenefits}
            item={item}
            oldStatus={oldStatus}
            planIndex={planIndex}
            j={j}
            changePlanField={this.changePlanField}
          />
        )}
        { (section === 'ltd' && newPlan.classes && newPlan.classes[0]) && ltdBenefitsList.map((item, j) =>
          <BenefitsInner
            newPlan={newPlan}
            selectedBenefits={this.state.selectedBenefits}
            item={item}
            oldStatus={oldStatus}
            planIndex={planIndex}
            j={j}
            changePlanField={this.changePlanField}
          />
        )}
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

function BenefitsInner(props) {
  const {
    newPlan,
    selectedBenefits,
    item,
    oldStatus,
    planIndex,
    j,
    changePlanField,
  } = props;
  if (item.key !== 'ageReductionSchedule') {
    return (
      <Grid
        columns={newPlan.classes && ((newPlan.classes.length >= 2 && selectedBenefits === 1) || (newPlan.classes.length === 4 && selectedBenefits !== 1)) ? 2 : 1}
        key={j}
        className="new-row-grid benefits"
      >
        <Grid.Row className="input-row">
          <Grid.Column className="four-cols-benefits">
            { selectedBenefits === 1 &&
            <Input
              maxLength="55"
              type="text"
              placeholder={item.name}
              value={newPlan.classes[0] ? newPlan.classes[0][item.key] : ''}
              onChange={(e, inputState) => {
                changePlanField(e, 0, inputState.value, 'classes', item.key, oldStatus, planIndex);
              }}
            />
            }
            { selectedBenefits !== 1 &&
            <Input
              maxLength="55"
              type="text"
              placeholder={item.name}
              value={newPlan.classes[2] ? newPlan.classes[2][item.key] : ''}
              onChange={(e, inputState) => {
                changePlanField(e, 2, inputState.value, 'classes', item.key, oldStatus, planIndex);
              }}
            />
            }
          </Grid.Column>
          { (newPlan.classes.length === 2 || newPlan.classes.length === 4 || (selectedBenefits === 1 && newPlan.classes.length === 3)) &&
          <Grid.Column className="four-cols-benefits">
            { selectedBenefits === 1 &&
            <Input
              maxLength="55"
              type="text"
              placeholder={item.name}
              value={newPlan.classes[1] ? newPlan.classes[1][item.key] : ''}
              onChange={(e, inputState) => {
                changePlanField(e, 1, inputState.value, 'classes', item.key, oldStatus, planIndex);
              }}
            />
            }
            { selectedBenefits !== 1 &&
            <Input
              maxLength="55"
              type="text"
              placeholder={item.name}
              value={newPlan.classes[3] ? newPlan.classes[3][item.key] : ''}
              onChange={(e, inputState) => {
                changePlanField(e, 3, inputState.value, 'classes', item.key, oldStatus, planIndex);
              }}
            />
            }
          </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <Grid className="new-row-grid benefits">
      <Grid.Column className="two-cols-benefits" />
    </Grid>
  );
}

export default NewPlanColumnLifeRefactored;

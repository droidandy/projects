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
import * as types from '../../../constants';

class NewPlanColumnLife extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    newPlan: PropTypes.object.isRequired,
    currentPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    status: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    addPlan: PropTypes.func.isRequired,
    savePlan: PropTypes.func.isRequired,
    cancelAddingPlan: PropTypes.func.isRequired,
    networkIndex: PropTypes.number.isRequired,
    rfpQuoteNetworkId: PropTypes.number,
    updatePlanField: PropTypes.func.isRequired,
    optionName: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    editPlanField: PropTypes.func,
    detailedPlan: PropTypes.object.isRequired,
    benefitsLoading: PropTypes.bool,
    modalView: PropTypes.bool,
    editPlan: PropTypes.object,
    element: PropTypes.object,
    getDefaultValuesEditPlanLife: PropTypes.func,
    editingPlan: PropTypes.object,
    secondSelected: PropTypes.bool,
    scrollBarPosition: PropTypes.object.isRequired,
  };

  static defaultProps = {
    editPlan: null,
    editingPlan: {},
    planIndex: null,
    rfpQuoteNetworkId: null,
    editPlanField: () => {},
    secondPosition: false,
    benefitsLoading: false,
    modalView: false,
    element: null,
  };

  constructor(props) {
    super(props);
    this.changePlanField = this.changePlanField.bind(this);
    this.editPlanField = this.editPlanField.bind(this);
    this.setParams = this.setParams.bind(this);
    this.showManualInput = this.showManualInput.bind(this);
    this.cancelAddingPlan = this.cancelAddingPlan.bind(this);
    this.validateName = this.validateName.bind(this);

    this.state = {
      addPlanManually: false,
      position: null,
      selectedBenefits: 1,
    };
    this.typeOfPlan = 'alt';
    this.newColumn = null;
  }

  componentDidMount() {
    const {
      editPlan,
      section,
      detailedPlan,
      editingPlan,
      secondSelected,
    } = this.props;
    const typeOfPlan = editingPlan ? editingPlan.type : '';
    // if new Plan
    if (!editPlan) {
      let plan;
      if (secondSelected) {
        plan = detailedPlan.plans.find((currPlan) => currPlan.type === typeOfPlan && currPlan.selectedSecond);
      } else {
        plan = detailedPlan.plans.find((currPlan) => currPlan.type === typeOfPlan) || detailedPlan.plans[0] ||
          {
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
      }


      if (section === types.LIFE_SECTION) {
        plan.cost = lifeCostList;
        plan.benefits = lifeBenefitsList;
        if (!plan.classes) {
          const classItem = {
            javaclass: 'LifeClassDto',
            name: 'className',
            ancillaryClassId: null,
          };
          ltdBenefitsList.forEach((benefit) => {
            if (benefit.key !== '') {
              classItem[benefit.key] = null;
            }
          });
          plan.classes = [classItem, classItem, classItem, classItem];
        }
        if (!plan.rates) {
          plan.rates = {};
          lifeCostList.forEach((rate) => {
            if (rate.key !== '' && rate.key !== 'monthlyCost') {
              plan.rates[rate.key] = null;
            }
            plan.rates.javaclass = 'BasicRateDto';
            plan.rates.ancillaryRateId = null;
          });
        }
      }
      if (section === types.STD_SECTION) {
        plan.cost = stdCostList;
        plan.benefits = stdBenefitsList;
        if (!plan.classes) {
          const classItem = {
            javaclass: 'StdClassDto',
            name: 'className',
            ancillaryClassId: null,
          };
          ltdBenefitsList.forEach((benefit) => {
            if (benefit.key !== '') {
              classItem[benefit.key] = null;
            }
          });
          plan.classes = [classItem, classItem, classItem, classItem];
        }
        if (!plan.rates) {
          plan.rates = {};
          stdCostList.forEach((rate) => {
            if (rate.key !== '' && rate.key !== 'monthlyCost') {
              plan.rates[rate.key] = null;
            }
            plan.rates.javaclass = 'BasicRateDto';
            plan.rates.ancillaryRateId = null;
          });
        }
      }
      if (section === types.LTD_SECTION) {
        plan.cost = ltdCostList;
        plan.benefits = ltdBenefitsList;
        if (!plan.classes) {
          const classItem = {
            javaclass: 'LtdClassDto',
            name: 'className',
            ancillaryClassId: null,
          };
          ltdBenefitsList.forEach((benefit) => {
            if (benefit.key !== '') {
              classItem[benefit.key] = null;
            }
          });
          plan.classes = [classItem, classItem, classItem, classItem];
        }
        if (!plan.rates) {
          plan.rates = {};
          ltdCostList.forEach((rate) => {
            if (rate.key !== '' && rate.key !== 'monthlyCost') {
              plan.rates[rate.key] = null;
            }
            plan.rates.javaclass = 'BasicRateDto';
            plan.rates.ancillaryRateId = null;
          });
        }
      }
      this.definePlan(plan);
    } else {
      this.props.updatePlanField(section, 'newPlan', editPlan, '');
    }
  }

  setParams() {
    const { status, modalView, editPlan, element, section, editingPlan, scrollBarPosition, secondSelected } = this.props;
    const leftScroll = scrollBarPosition._container.scrollLeft; // eslint-disable-line
    const typeOfPlan = editingPlan ? editingPlan.type : '';
    let { position } = this.state;
    if (modalView) {
      if (editPlan) {
        if (!position) {
          position = {
            left: element.parentNode.parentNode.parentNode.offsetLeft % 600,
            top: element.parentNode.parentNode.parentNode.offsetTop,
          };
          this.setState({ position });
        }
        const newColumn = document.getElementById('new-plan');
        if (newColumn && element) {
          const altColumnLeft = `${position.left + 380}px`;
          const altColumnTop = `${position.top + 34}px`;
          newColumn.style.left = altColumnLeft;
          newColumn.style.top = altColumnTop;
        }
        this.typeOfPlan = 'edit';
      } else {
        const altColumns = document.querySelectorAll('.modal .alternatives-scrolling');
        const newColumn = document.getElementById('new-plan');
        if (newColumn && altColumns && altColumns.length) {
          const altColumnLeft = `${altColumns[0].offsetLeft}px`;
          const altColumnTop = `${altColumns[0].offsetTop + 12}px`;
          newColumn.style.left = altColumnLeft;
          newColumn.style.top = altColumnTop;
        }
      }
    } else {
      const altColumns = document.querySelectorAll('.alternatives-table-column');
      let className;
      if (typeOfPlan === 'matchPlan') {
        className = 'match';
      } else if (typeOfPlan === 'alternative') {
        className = 'alt';
      }
      const currentColumn = document.querySelectorAll(`.corner.${className}`);
      const tabMenu = document.querySelector('.tab-menu');
      const tabMenuOffsetLeft = tabMenu && tabMenu.getBoundingClientRect().left;
      const currentColumnOffsetLeft = currentColumn[0] && currentColumn[0].getBoundingClientRect().left;
      const currentColumnInnerLeft = currentColumnOffsetLeft - tabMenuOffsetLeft;
      const newColumn = document.getElementById('new-plan');
      if (newColumn && altColumns && altColumns.length) {
        let leftOffset = 0;
        if (status === 'editAlt') {
          let second = 0;
          if (secondSelected && currentColumn.length > 1) {
            second = 300;
          }
          leftOffset = (currentColumnInnerLeft - 124) + leftScroll + second;
          this.typeOfPlan = 'alt';
        }
        if (status === 'editSelected') {
          leftOffset = 200;
          this.typeOfPlan = 'selected';
        }
        if (status === 'newAlt') {
          leftOffset = (altColumns.length * 300) - 21;
          this.typeOfPlan = 'alt';
        }
        if (status === 'newSelected') {
          leftOffset = 200;
          this.typeOfPlan = 'selected';
        }
        if (status === 'newMatch') {
          leftOffset = 280;
          this.typeOfPlan = 'matchPlan';
        }

        let altColumnLeft;
        let altColumnTop;
        if (section !== 'medical' || 'dental' || 'vision') {
          altColumnTop = `${altColumns[0].offsetTop - 18}px`;
          altColumnLeft = `${leftOffset + 19}px`;
        } else {
          altColumnTop = `${altColumns[0].offsetTop - 57}px`;
          altColumnLeft = `${altColumns[0].offsetLeft + leftOffset}px`;
        }

        newColumn.style.left = altColumnLeft;
        newColumn.style.top = altColumnTop;
      }
    }
  }

  definePlan(plan) {
    const {
      newPlan,
      section,
      rfpQuoteNetworkId,
      status,
      detailedPlan,
    } = this.props;
    const newStatus = (status === 'new' || status === 'newAlt' || status === 'newSelected' || status === 'newMatch');
    if (plan.carrier) {
      newPlan.carrier = plan.carrier;
    }
    if (plan.cost && plan.cost.length) {
      newPlan.cost = [];
      // Monthly cost, % change from current, Employee Rate are not editable
      plan.cost.forEach((item) => {
        if (item.name !== '% change from current') {
          const newItem = {
            name: item.name,
            sysName: item.sysName || null,
            value: newStatus ? '' : item.value,
            key: item.key,
          };
          newPlan.cost.push(newItem);
        }
      });
    }
    if (plan.benefits && plan.benefits.length) {
      newPlan.benefits = [];
      let newItem = {};
      plan.benefits.forEach((item) => {
        newItem = {
          name: item.name,
          sysName: item.sysName || null,
          value: newStatus ? null : item.value,
          key: item.key,
        };
        newPlan.benefits.push(newItem);
      });
    }
    newPlan.rfpQuoteAncillaryPlanId = newStatus ? null : plan.rfpQuoteAncillaryPlanId;
    newPlan.ancillaryPlanId = newStatus ? null : plan.ancillaryPlanId;
    newPlan.classes = plan.classes;
    newPlan.rates = plan.rates;
    newPlan.rfpQuoteId = plan.rfpQuoteId;
    newPlan.selected = plan.selected;
    newPlan.carrierId = plan.carrierId;
    newPlan.matchPlan = status === 'newMatch' ? true : plan.matchPlan;
    newPlan.planType = plan.planType;
    newPlan.planYear = plan.planYear;
    newPlan.name = newStatus ? '' : plan.carrierDisplayName;
    newPlan.nameByNetwork = newStatus ? '' : plan.planName;
    newPlan.rfpQuoteNetworkId = rfpQuoteNetworkId;
    if (status === 'newSelected') {
      newPlan.rfpQuoteOptionNetworkId = detailedPlan.rfpQuoteOptionNetworkId;
    }
    this.showManualInput(newPlan.pnnId);
    this.props.updatePlanField(section, 'newPlan', newPlan, '');
    if (!newStatus) {
      let current = null;
      for (let i = 0; i < detailedPlan.plans.length; i += 1) {
        const countedPlan = detailedPlan.plans[i];
        if (countedPlan.type === 'current') {
          current = countedPlan;
          break;
        }
      }
      const lengthClasses = current && current.classes.length;
      this.props.getDefaultValuesEditPlanLife(section, newPlan, lengthClasses);
    }
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

  editPlanField(e, name, value, part, valName, typeOfPlan) {
    const { section } = this.props;
    if ((part === 'rates' && (validator.isFloat(value) || valName === "rateGuarantee" || value === '')) || part !== 'rates') {
      this.props.editPlanField(section, name, value, part, valName, typeOfPlan);
    }
  }

  changePlanField(e, name, value, part, valName, status, planIndex, externalRx) {
    const { section } = this.props;
    const elem = e.target;
    if ((part === 'rates' && (validator.isFloat(value) || valName === "rateGuarantee" || value === '')) || part !== 'rates') {
      this.props.updatePlanField(section, name, value, part, valName, status, planIndex, externalRx);
    } else {
      elem.value = null;
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
    if (oldStatus === 'edit' && strippedName !== '') {
      return true;
    }
    scrollToInvalid(['plan-name'], null, null, null);
    return false;
  }

  render() {
    const {
      newPlan,
      planIndex,
      savePlan,
      section,
      networkIndex,
      addPlan,
      optionName,
      currentPlan,
      benefitsLoading,
      multiMode,
      detailedPlan,
      status,
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

    const oneClass = current && current.classes && current.classes.length === 1;
    const twoClasses = current && current.classes && current.classes.length === 2;
    const threeClasses = current && current.classes && current.classes.length === 3;
    const fourClasses = current && current.classes && current.classes.length === 4;
    // console.log('NewPlanColumnLife props', this.props);
    // console.log('newPlan', newPlan);
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
                this.editPlanField(e, 'planName', 'nameByNetwork', inputState.value, '', this.typeOfPlan);
              }}
            />
          </Grid.Row>
          }
        </Grid>
        {/* cost */}
        { (newPlan.cost && newPlan.cost.length > 0) && newPlan.cost.map((item, j) => {
          if (oldStatus === 'new') {
            let placeholder;
            if (j === 0) {
              placeholder = 'Enter Total Covered Volume';
            } else if (j === 1) {
              placeholder = 'Enter Monthly Cost';
            } else {
              placeholder = 'Enter Amount';
            }
            if (item.name !== 'MONTHLY RATES PER $1,000'
              && item.name !== 'MONTHLY RATES PER $10'
              && item.name !== 'Monthly Cost'
            ) {
              return (
                <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                  <Grid.Row className="input-row">
                    <Input
                      maxLength="55"
                      type="text"
                      className={item.key.length && item.key !== 'volume' && item.key !== 'rateGuarantee' ? 'dollared' : ''}
                      value={item.value}
                      placeholder={placeholder}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'cost', 'value', oldStatus, planIndex);
                      }}
                    />
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={1} key={j} className="new-row-grid cost">
                <Grid.Row className={`input-row empty ${section}`} />
              </Grid>
            );
          }
          if (oldStatus === 'edit') {
            let placeholder;
            if (j === 0) {
              placeholder = 'Enter Total Covered Volume';
            } else if (j === 1) {
              placeholder = 'Enter Monthly Cost';
            } else {
              placeholder = 'Enter Amount';
            }
            if (item.name !== '% change from current') {
              if (item.name !== 'MONTHLY RATES PER $1,000' && item.name !== 'MONTHLY RATES PER $10' && item.name !== 'Monthly Cost') {
                return (
                  <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'MONTHLY RATES PER $1,000' ? 'cost-input' : 'cost'}`}>
                    <Grid.Row className="input-row">
                      <Input
                        maxLength="55"
                        type="text"
                        className={item.key.length && item.key !== 'volume' && item.key !== 'rateGuarantee' ? 'dollared' : ''}
                        value={item.value}
                        placeholder={placeholder}
                        onChange={(e, inputState) => {
                          this.editPlanField(e, j, inputState.value, 'cost', 'value', this.typeOfPlan);
                          // this.changePlanField(e, j, inputState.value, 'cost', 'value', oldStatus, planIndex);
                        }}
                      />
                    </Grid.Row>
                  </Grid>
                );
              }
              return (
                <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                  <Grid.Row className="input-row empty" />
                </Grid>
              );
            }
          }
          return (
            <div key={j}></div>
          );
        }
        )}
        {/* benefits */}
        <Grid columns={twoClasses ? 2 : 1} className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            <Grid.Column className="two-cols-benefits" />
            { twoClasses && <Grid.Column className="two-cols-benefits" /> }
            { (threeClasses || fourClasses) &&
            <Dropdown
              fluid
              selection
              name="benefitsClasses"
              className={'benefits-classes current'}
              options={optionsBenefits}
              text="Select Class"
              onChange={this.handleBenefitsClasses}
            /> }
          </Grid.Row>
        </Grid>
        { (newPlan.benefits && newPlan.benefits.length > 0) && newPlan.benefits.length > 0 && !('valueIn' in newPlan.benefits[0]) &&
        <Grid columns={(twoClasses || fourClasses || (threeClasses && this.state.selectedBenefits === 1)) ? 2 : 1} className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            <Grid.Column className="two-cols-benefits">
              CLASS {(oneClass || (fourClasses && this.state.selectedBenefits === 1) || (threeClasses && this.state.selectedBenefits === 1)) ? 1 : 3} - { newPlan.classes[0] && newPlan.classes[0].name}
            </Grid.Column>
            { (twoClasses || fourClasses || (threeClasses && this.state.selectedBenefits === 1)) &&
            <Grid.Column className="two-cols-benefits">
              CLASS {twoClasses || (fourClasses && this.state.selectedBenefits === 1) ? 2 : 4} - { newPlan.classes[1] && newPlan.classes[1].name}
            </Grid.Column>
            }
          </Grid.Row>
        </Grid>
        }
        { (newPlan.benefits && newPlan.benefits.length > 0) && newPlan.benefits.map((item, j) => {
            if (item.value !== undefined) {
              return (
                <Grid
                  columns={(twoClasses || fourClasses || (threeClasses && this.state.selectedBenefits === 1)) ? 2 : 1}
                  key={j} className="new-row-grid benefits"
                >
                  <Grid.Row className="input-row">
                    <Grid.Column className="two-cols benefits content-col">
                      { oldStatus !== 'new' && item.name !== 'AGE REDUCTION SCHEDULE' &&
                      <Input
                        name="one"
                        maxLength="55"
                        type="text"
                        placeholder="Enter Amount"
                        value={(oneClass || twoClasses || (fourClasses && this.state.selectedBenefits === 1) || (threeClasses && this.state.selectedBenefits === 1)) ?
                        item.value || '' : item.valueThree || ''}
                        onChange={(e, inputState) => {
                          this.editPlanField(e, `${(oneClass ||
                          (threeClasses && this.state.selectedBenefits === 1) ||
                          (fourClasses && this.state.selectedBenefits === 1)) ? j : `${j}three`}`, inputState.value, 'benefits', 'value', this.typeOfPlan);
                        }}
                      />
                      }
                      { oldStatus === 'new' && item.name !== 'AGE REDUCTION SCHEDULE' &&
                      <Input
                        name="one"
                        maxLength="55"
                        type="text"
                        placeholder="Enter Amount"
                        value={(oneClass || twoClasses || (fourClasses && this.state.selectedBenefits === 1) || (threeClasses && this.state.selectedBenefits === 1)) ?
                        item.value || '' : item.valueThree || ''}
                        onChange={(e, inputState) => {
                          this.editPlanField(e, `${(oneClass ||
                          (threeClasses && this.state.selectedBenefits === 1) ||
                          (fourClasses && this.state.selectedBenefits === 1)) ? j : `${j}three`}`, inputState.value, 'benefits', 'value', this.typeOfPlan);
                        }}
                      />
                      }
                    </ Grid.Column>
                    {(twoClasses || fourClasses || (threeClasses && this.state.selectedBenefits === 1)) &&
                    <Grid.Column className="two-cols benefits content-col">
                      { oldStatus !== 'new' && item.name !== 'AGE REDUCTION SCHEDULE' &&
                      <Input
                        name="two"
                        maxLength="55"
                        type="text"
                        placeholder="Enter Amount"
                        value={(twoClasses || (fourClasses && this.state.selectedBenefits === 1)) ? item.valueTwo || '' : item.valueFour || ''}
                        onChange={(e, inputState) => {
                          this.editPlanField(e, `${(twoClasses ||
                          (fourClasses && this.state.selectedBenefits === 1) ||
                          (threeClasses && this.state.selectedBenefits === 1)) ? `${j}two` : `${j}four`}`, inputState.value, 'benefits', 'value', this.typeOfPlan);
                        }}
                      />
                      }
                      { oldStatus === 'new' && item.name !== 'AGE REDUCTION SCHEDULE' &&
                      <Input
                        name="two"
                        maxLength="55"
                        type="text"
                        placeholder="Enter Amount"
                        value={(twoClasses || (fourClasses && this.state.selectedBenefits === 1)) ? item.valueTwo || '' : item.valueFour || ''}
                        onChange={(e, inputState) => {
                          this.editPlanField(e, `${(twoClasses || (fourClasses && this.state.selectedBenefits === 1)) ? `${j}two` : `${j}four`}`, inputState.value, 'benefits', 'value', this.typeOfPlan);
                        }}
                      />
                      }
                    </ Grid.Column>
                    }
                  </Grid.Row>
                </Grid>
              );
            }
            return (
              <Grid columns={2} key={j} className="new-row-grid benefits">
                { oldStatus === 'new' &&
                <Grid.Row className="input-row">
                  <Grid.Column className="two-cols-benefits">
                    <Input
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueIn}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'benefits', 'valueIn', oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column className="two-cols-benefits">
                    <Input
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueOut}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'benefits', 'valueOut', oldStatus, planIndex);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
                }
                { oldStatus !== 'new' &&
                <Grid.Row className="input-row">
                  <Grid.Column className="two-cols-benefits" >
                    <Input
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueIn}
                      onChange={(e, inputState) => {
                        this.editPlanField(e, j, inputState.value, 'benefits', 'valueIn', this.typeOfPlan);
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column className="two-cols-benefits" >
                    <Input
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueOut}
                      onChange={(e, inputState) => {
                        this.editPlanField(e, j, inputState.value, 'benefits', 'valueOut', this.typeOfPlan);
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
                }
              </Grid>
            );
        }
        )}
        <Grid columns={1} className="bottom">
          <Grid.Row className="button-row">
            <Grid.Column width={1} />
            <Grid.Column width={12}>
              { oldStatus === 'new' &&
              <Button size="medium" primary onClick={() => { if (this.validateName()) addPlan(section, newPlan, networkIndex, multiMode, status, detailedPlan.rfpQuoteId); }}>
                Add Plan
              </Button>
              }
              { oldStatus !== 'new' &&
              <Button size="medium" primary onClick={() => { if (this.validateName()) savePlan(newPlan); }}>Save</Button>
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

export default NewPlanColumnLife;

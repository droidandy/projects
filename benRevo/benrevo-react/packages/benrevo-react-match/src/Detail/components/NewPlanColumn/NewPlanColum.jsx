import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Grid, Input, Button, Loader, Ref } from 'semantic-ui-react';
import { scrollToInvalid } from '@benrevo/benrevo-react-core';
import PlansBenefitsDropdown from './../PlanBenefitsDropdown';
import PlanRxDropdown from './../PlanRxDropdown';
import CarrierLogo from './../../../components/CarrierLogo';
import InputFieldTyped from './components/InputFieldTyped';

class NewPlanColumn extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    newPlan: PropTypes.object.isRequired,
    currentPlan: PropTypes.object.isRequired,
    planTypeTemplates: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    status: PropTypes.string.isRequired,
    detailedPlanType: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    addPlan: PropTypes.func.isRequired,
    savePlan: PropTypes.func.isRequired,
    cancelAddingPlan: PropTypes.func.isRequired,
    networkIndex: PropTypes.number.isRequired,
    rfpQuoteNetworkId: PropTypes.number,
    updatePlanField: PropTypes.func.isRequired,
    optionName: PropTypes.string.isRequired,
    quoteType: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    editPlanField: PropTypes.func,
    detailedPlan: PropTypes.object.isRequired,
    benefitsLoading: PropTypes.bool,
    page: PropTypes.object.isRequired,
    modalView: PropTypes.bool,
    editPlan: PropTypes.object,
    element: PropTypes.object,
    planToEdit: PropTypes.object,
    kaiserTab: PropTypes.bool,
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
    kaiserTab: false,
  };

  constructor(props) {
    super(props);
    this.changePlanField = this.changePlanField.bind(this);
    this.editPlanField = this.editPlanField.bind(this);
    this.setParams = this.setParams.bind(this);
    this.showManualInput = this.showManualInput.bind(this);
    this.cancelAddingPlan = this.cancelAddingPlan.bind(this);
    this.noType = this.noType.bind(this);
    this.validateName = this.validateName.bind(this);

    this.state = {
      twoColsFlag: false,
      addPlanManually: false,
      position: null,
    };
    this.typeOfPlan = 'alt';
    this.newColumn = null;
  }

  componentDidMount() {
    const {
      currentPlan,
      editPlan,
      section,
      planToEdit,
    } = this.props;
    // if we have current plan - we should use it, else use planTemplate to define benefits.
    let templatePlan = {};
    if (Object.keys(planToEdit).length > 0) {
      templatePlan = planToEdit;
    }
    if (!Object.keys(planToEdit).length && currentPlan && Object.keys(currentPlan).length > 0) {
      templatePlan = currentPlan;
      if (templatePlan.benefits) templatePlan.benefits = templatePlan.benefits.map((item) => this.noType(item));
      if (templatePlan.rx) templatePlan.rx = templatePlan.rx.map((item) => this.noType(item));
    }
    if (!editPlan) {
      this.definePlan(templatePlan);
    } else {
      this.props.updatePlanField(section, 'newPlan', editPlan, '');
    }
  }

  setParams() {
    const { status, modalView, editPlan, element } = this.props;
    let { position } = this.state;
    const newColumn = document.getElementById('new-plan');
    const altContainer = document.querySelectorAll('.alternatives-container');
    let newColumnHeight = 0;
    if (newColumn && altContainer && altContainer[0]) {
      newColumnHeight = newColumn.offsetHeight;
      const containerElement = altContainer[0];
      if (containerElement.offsetHeight < newColumnHeight) {
        containerElement.style.height = `${newColumnHeight + 100}px`;
      }
    }
    if (modalView) {
      if (editPlan) {
        if (!position) {
          position = {
            left: element.parentNode.parentNode.parentNode.offsetLeft % 600,
            top: element.parentNode.parentNode.parentNode.offsetTop,
          };
          this.setState({ position });
        }
        if (newColumn && element) {
          const altColumnLeft = `${position.left + 380}px`;
          const altColumnTop = `${position.top + 34}px`;
          newColumn.style.left = altColumnLeft;
          newColumn.style.top = altColumnTop;
        }
        this.typeOfPlan = 'edit';
      } else {
        const altColumns = document.querySelectorAll('.modal .alternatives-scrolling');
        if (newColumn && altColumns && altColumns.length) {
          const altColumnLeft = `${altColumns[0].offsetLeft}px`;
          const altColumnTop = `${altColumns[0].offsetTop + 12}px`;
          newColumn.style.left = altColumnLeft;
          newColumn.style.top = altColumnTop;
        }
      }
    } else {
      const altColumns = document.querySelectorAll('.alternatives-table-column');

      if (newColumn && altColumns && altColumns.length) {
        let leftOffset = 0;
        if (status === 'editAlt') {
          leftOffset = 460;
          this.typeOfPlan = 'alt';
        }
        if (status === 'editSelected') {
          leftOffset = 200;
          this.typeOfPlan = 'selected';
        }
        if (status === 'newAlt') {
          leftOffset = 432;
          this.typeOfPlan = 'alt';
        }
        if (status === 'newSelected') {
          leftOffset = 200;
          this.typeOfPlan = 'selected';
        }
        const altColumnLeft = `${altColumns[0].offsetLeft + leftOffset}px`;
        const altColumnTop = `${altColumns[0].offsetTop - 57}px`;
        newColumn.style.left = altColumnLeft;
        newColumn.style.top = altColumnTop;
      }
    }
  }

  changePlanField(e, name, value, part, valName, status, planIndex, externalRx) {
    const { section } = this.props;
    if ((part === 'cost' && (validator.isFloat(value) || value === '')) || part !== 'cost') {
      this.props.updatePlanField(section, name, value, part, valName, status, planIndex, externalRx);
    }
  }

  editPlanField(e, name, value, part, valName, typeOfPlan) {
    const { section } = this.props;
    if ((part === 'cost' && (validator.isFloat(value) || value === '')) || part !== 'cost') {
      this.props.editPlanField(section, name, value, part, valName, typeOfPlan);
    }
  }

  definePlan(plan) {
    const {
      newPlan,
      section,
      rfpQuoteNetworkId,
      status,
      detailedPlan,
      planTypeTemplates,
      detailedPlanType,
    } = this.props;
    const newStatus = (status === 'new' || status === 'newAlt' || status === 'newSelected');
    const rx = plan.rx && plan.rx.length ? plan.rx : planTypeTemplates[`RX_${detailedPlanType}`];
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
            type: item.type,
            sysName: item.sysName || null,
            value: newStatus ? '' : item.value,
          };
          newPlan.cost.push(newItem);
        }
      });
    }
    let twoColsFlag = false;
    if (plan.benefits && plan.benefits.length) {
      newPlan.benefits = [];
      let newItem = {};
      plan.benefits.forEach((item) => {
        if (item.valueIn || item.valueOut) {
          twoColsFlag = true;
          newItem = {
            name: item.name,
            typeIn: item.typeIn,
            typeOut: item.typeOut,
            sysName: item.sysName || null,
            valueIn: newStatus ? null : item.valueIn,
            valueOut: newStatus ? null : item.valueOut,
          };
        } else {
          newItem = {
            name: item.name,
            type: item.type,
            sysName: item.sysName || null,
            value: newStatus ? null : item.value,
          };
        }
        newPlan.benefits.push(newItem);
      });
    }
    newPlan.rx = [];
    if (rx && rx.length) {
      rx.forEach((item) => {
        const newItem = {
          name: item.name,
          type: item.type,
          sysName: item.sysName || null,
          value: newStatus ? null : item.value,
        };
        newPlan.rx.push(newItem);
      });
    }
    newPlan.rfpQuoteNetworkPlanId = newStatus ? null : plan.rfpQuoteNetworkPlanId;
    newPlan.planId = newStatus ? null : plan.planId;
    newPlan.name = newStatus ? '' : plan.name;
    newPlan.nameByNetwork = newStatus ? '' : plan.name;
    newPlan.rfpQuoteNetworkId = rfpQuoteNetworkId;
    if (status === 'newSelected') {
      newPlan.rfpQuoteOptionNetworkId = detailedPlan.rfpQuoteOptionNetworkId;
    }
    this.showManualInput(newPlan.pnnId);
    this.props.updatePlanField(section, 'newPlan', newPlan, '');
    this.setState({ twoColsFlag });
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

  noType(item) {
    const result = item;
    result.type = 'NUMBER';
    return result;
  }

  validateName() {
    const { newPlan, status } = this.props;
    const strippedName = newPlan.name && newPlan.name.replace(new RegExp(' ', 'g'), '');
    const strippedNameByNetwork = newPlan.nameByNetwork && newPlan.nameByNetwork.replace(new RegExp(' ', 'g'), '');
    const oldStatus = (status === 'editAlt' || status === 'editSelected' || status === 'edit') ? 'edit' : 'new';
    if (oldStatus === 'edit' && strippedName !== '') {
      return true;
    }
    if (oldStatus !== 'edit' && (strippedName !== '' || strippedNameByNetwork !== '')) {
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
      page,
      status,
      quoteType,
      kaiserTab,
    } = this.props;
    this.setParams();
    const { addPlanManually } = this.state;
    newPlan.carrier = currentPlan.carrier;
    const oldStatus = (this.props.status === 'editAlt' || this.props.status === 'editSelected' || this.props.status === 'edit') ? 'edit' : 'new';
    const rxDropdown = true;
    const rxNetworks = detailedPlan.rxNetworks || [];
    return (
      <Ref innerRef={(c) => { this.newColumn = c; }}>
        <Grid.Row id="new-plan" className="new-plan-next">
          <Grid columns={1} className={optionName && optionName === 'Renewal' ? 'renewal newPlanHeader' : 'newPlanHeader'}>
            <Grid.Row className="center-aligned plan-name-header">
              <div className="corner new">
                <span>NEW</span>
              </div>
              <div className="logo-block">
                { (page.carrier && page.carrier.carrier) &&
                <CarrierLogo carrier={page.carrier.carrier.displayName} section={section} quoteType={quoteType} />
                }
              </div>
              { !benefitsLoading &&
              <span className="hdr">Enter Plan Information</span>
              }
              { benefitsLoading &&
                <Grid.Row className="alternatives-container centered">
                  <Loader inline active={benefitsLoading} indeterminate size="medium">Loading benefits</Loader>
                </Grid.Row>
              }
              <div className="edit-benefits-info-space"></div>
            </Grid.Row>
            { oldStatus === 'edit' &&
            <Grid.Row className="input-row plan-name-title">
              <Input
                name="plan-name"
                type="text"
                placeholder="Enter plan name"
                value={newPlan.name}
                onChange={(e, inputState) => {
                  this.editPlanField(e, 'planName', 'nameByNetwork', inputState.value, '', this.typeOfPlan);
                }}
              />
            </Grid.Row>
            }
            { oldStatus !== 'edit' &&
            <Grid.Row className="input-row plan-name-title">
              <PlansBenefitsDropdown
                openModalClick={this.showManualInput}
                networkId={detailedPlan.networkId}
                section={section}
                pnnId={newPlan.pnnId}
              />
              { addPlanManually &&
              <Input
                name="plan-name"
                className="add-plan-manually"
                type="text"
                placeholder="Enter plan name"
                value={newPlan.nameByNetwork}
                onChange={(e, inputState) => {
                  this.changePlanField(e, 'planName', 'nameByNetwork', inputState.value, '', oldStatus, planIndex);
                }}
              />
              }
            </Grid.Row>
            }
          </Grid>
          {/* cost */}
          { (newPlan.cost && newPlan.cost.length > 0) && newPlan.cost.map((item, j) => {
            if (oldStatus === 'new') {
              if (item.name !== 'Monthly cost') {
                return (
                  <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                    <Grid.Row className="input-row">
                      <Input
                        maxLength="55"
                        className="dollared non-life-dollared"
                        type="text"
                        value={item.value}
                        placeholder={item.name}
                        onChange={(e, inputState) => {
                          this.changePlanField(e, j, inputState.value, 'cost', 'value', oldStatus, planIndex);
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
            if (oldStatus === 'edit') {
              if (item.name !== '% change from current') {
                if (item.name !== 'Monthly cost') {
                  return (
                    <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
                      <Grid.Row className="input-row">
                        <Input
                          maxLength="55"
                          className="dollared non-life-dollared"
                          type="text"
                          value={item.value}
                          placeholder={item.name}
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
          { (newPlan.benefits && newPlan.benefits.length > 0) && newPlan.benefits.length > 0 && !('valueIn' in newPlan.benefits[0]) &&
          <Grid columns={1} className="new-row-grid benefits title">
            <Grid.Row />
          </Grid>
          }
          { (newPlan.benefits && newPlan.benefits.length > 0 && ('valueIn' in newPlan.benefits[0])) &&
          <Grid columns={2} className="new-row-grid benefits title height-row-2">
            <Grid.Row>
              <Grid.Column className="two-cols-benefits">IN-NETWORK</Grid.Column>
              <Grid.Column className="two-cols-benefits">OUT-NETWORK</Grid.Column>
            </Grid.Row>
          </Grid>
          }
          { (newPlan.benefits && newPlan.benefits.length > 0) && newPlan.benefits.map((item, j) => {
            if (item.value !== undefined) {
              return (
                <Grid columns={1} key={j} className="new-row-grid benefits">
                  <Grid.Row className="input-row">
                    { oldStatus === 'new' &&
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.value}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'benefits', 'value', oldStatus, planIndex);
                      }}
                      textType={item.type}
                      pnnId={newPlan.pnnId}
                    />
                    }
                    { oldStatus !== 'new' &&
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.value}
                      onChange={(e, inputState) => {
                        this.editPlanField(e, j, inputState.value, 'benefits', 'value', this.typeOfPlan);
                      }}
                      textType={item.type}
                      pnnId={newPlan.pnnId}
                    />
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
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueIn}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'benefits', 'valueIn', oldStatus, planIndex);
                      }}
                      textType={item.typeIn}
                      pnnId={newPlan.pnnId}
                    />
                  </Grid.Column>
                  <Grid.Column className="two-cols-benefits">
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueOut}
                      onChange={(e, inputState) => {
                        this.changePlanField(e, j, inputState.value, 'benefits', 'valueOut', oldStatus, planIndex);
                      }}
                      textType={item.typeOut}
                      pnnId={newPlan.pnnId}
                    />
                  </Grid.Column>
                </Grid.Row>
                }
                { oldStatus !== 'new' &&
                <Grid.Row className="input-row">
                  <Grid.Column className="two-cols-benefits" >
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueIn}
                      onChange={(e, inputState) => {
                        this.editPlanField(e, j, inputState.value, 'benefits', 'valueIn', this.typeOfPlan);
                      }}
                      textType={item.typeIn}
                      pnnId={newPlan.pnnId}
                    />
                  </Grid.Column>
                  <Grid.Column className="two-cols-benefits" >
                    <InputFieldTyped
                      maxLength="55"
                      type="text"
                      placeholder={item.name}
                      value={item.valueOut}
                      onChange={(e, inputState) => {
                        this.editPlanField(e, j, inputState.value, 'benefits', 'valueOut', this.typeOfPlan);
                      }}
                      textType={item.typeOut}
                      pnnId={newPlan.pnnId}
                    />
                  </Grid.Column>
                </Grid.Row>
                }
              </Grid>
            );
          }
          )}
          {/* rx */}
          { (newPlan.rx && newPlan.rx.length > 0 && rxDropdown) &&
          <Grid columns={1} className="new-row-grid rx title">
            <Grid.Row className="input-row plan-name-title">
              { !kaiserTab && rxNetworks && rxNetworks.length > 0 &&
              <PlanRxDropdown
                openModalClick={this.showManualInput}
                networkId={rxNetworks[0].networkId}
                section={section}
                pnnRxId={newPlan.pnnRxId}
              />
              }
            </Grid.Row>
          </Grid>
          }
          { (newPlan.rx && newPlan.rx.length > 0 && !rxDropdown) &&
          <Grid columns={1} className="new-row-grid rx title">
            <Grid.Row />
          </Grid>
          }
          { (newPlan.rx && newPlan.rx.length > 0) && newPlan.rx.map((item, j) =>
            <Grid columns={1} key={j} className="new-row-grid rx">
              <Grid.Row className="input-row">
                { oldStatus === 'new' &&
                <InputFieldTyped
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={item.value}
                  onChange={(e, inputState) => {
                    this.changePlanField(e, j, inputState.value, 'rx', 'value', oldStatus, planIndex);
                  }}
                  textType={item.type}
                  pnnId={newPlan.pnnRxId ? newPlan.pnnRxId : newPlan.pnnId}
                />
                }
                { oldStatus !== 'new' &&
                <InputFieldTyped
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={item.value}
                  onChange={(e, inputState) => {
                    this.editPlanField(e, j, inputState.value, 'rx', 'value', this.typeOfPlan);
                  }}
                  textType={item.type}
                  pnnId={newPlan.pnnRxId ? newPlan.pnnRxId : newPlan.pnnId}
                />
                }
              </Grid.Row>
            </Grid>
          )}

          <Grid columns={1} className="bottom">
            <Grid.Row className="button-row">
              <Grid.Column width={1} />
              <Grid.Column width={12}>
                { oldStatus === 'new' &&
                <Button size="medium" primary onClick={() => { if (this.validateName()) addPlan(section, newPlan, networkIndex, multiMode, status, detailedPlan.rfpQuoteOptionNetworkId); }}>
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
          <div className="rates hint">Enter Rates</div>
          <div className="benefits hint">Review/Edit Benefits</div>
        </Grid.Row>
      </Ref>
    );
  }
}

export default NewPlanColumn;

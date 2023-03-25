import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Button } from 'semantic-ui-react';

class NewPlanColumn extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    newPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    offset: PropTypes.number,
    status: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    changePlanField: PropTypes.func.isRequired,
    addPlan: PropTypes.func,
    savePlan: PropTypes.func,
    cancelAddingPlan: PropTypes.func.isRequired,
    networkIndex: PropTypes.number,
    currentPlan: PropTypes.object.isRequired,
    rfpQuoteNetworkId: PropTypes.number.isRequired,
    updatePlanField: PropTypes.func,
    optionName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: 7,
    };
  }

  componentDidMount() {
    this.setParams();
    this.definePlan(this.props.currentPlan);
  }

  setParams() {
    const altColumns = document.querySelectorAll('.row-header-main');
    const newColumn = document.getElementById('new-plan');
    if (newColumn && altColumns && altColumns.length) {
      // console.log('altColumns[0].offsetLeft', altColumns[0].offsetLeft, 'altColumns.length = ', altColumns.length);
      const altColumnLeft = `${altColumns[0].offsetLeft + (altColumns.length * 200)}px`;
      const altColumnTop = `${altColumns[0].offsetTop - 10}px`;
      newColumn.style.left = altColumnLeft;
      newColumn.style.top = altColumnTop;
    }
  }

  definePlan(plan) {
    const { newPlan, section, rfpQuoteNetworkId } = this.props;
    if (plan.cost && plan.cost.length) {
      newPlan.cost = [];
      // Monthly cost, % change from current, Employee Rate are not editable
      plan.cost.forEach((item) => {
        if (item.name !== '% change from current') {
          const newItem = {
            name: item.name,
            type: item.type,
            sysName: item.sysName || null,
            value: null,
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
            valueIn: '',
            valueOut: '',
          };
        } else {
          newItem = {
            name: item.name,
            type: item.type,
            sysName: item.sysName || null,
            value: '',
          };
        }
        newPlan.benefits.push(newItem);
      });
    }
    newPlan.rx = [];
    if (plan.rx && plan.rx.length) {
      plan.rx.forEach((item) => {
        const newItem = {
          name: item.name,
          type: item.type,
          sysName: item.sysName || null,
          value: null,
        };
        newPlan.rx.push(newItem);
      });
    }
    newPlan.nameByNetwork = '';
    newPlan.rfpQuoteNetworkId = rfpQuoteNetworkId;
    this.props.updatePlanField(section, 'newPlan', newPlan, '');
    this.setState({ twoColsFlag });
  }

  render() {

    const {
      newPlan,
      offset,
      changePlanField,
      cancelAddingPlan,
      status,
      planIndex,
      savePlan,
      section,
      networkIndex,
      addPlan,
      optionName,
    } = this.props;
    const twoColsFlag = true;
    return (
      <Grid.Row id="new-plan" className="new-plan-next">
        <Grid columns={1} className={ optionName && optionName === 'Renewal' ? 'renewal newPlanHeader' : 'newPlanHeader'}>
          <Grid.Row className="center-aligned big-header newPlanH">
            Add plan information:
          </Grid.Row>
          <Grid.Row className="input-row plan-name-title">
            { status === 'new' &&
            <Input
              type="text"
              placeholder="Enter plan name"
              value={newPlan.nameByNetwork}
              onChange={(e, inputState) => { changePlanField(e, 'planName', 'nameByNetwork', inputState.value, '', status, planIndex); }}
            /> ||
            <Input // e, name, value, part, type, valName
              type="text" //  name, value, part, valName
              placeholder="Enter plan name"
              value={newPlan.name}
              onChange={(e, inputState) => { changePlanField(e, 'planName', 'nameByNetwork', inputState.value, '', status, planIndex); }}
            />
            }
          </Grid.Row>

        </Grid>
        <Grid.Row className="height-row" />
        {/* cost */}
        { newPlan.cost.map((item, j) =>
          (status === 'edit' && j > offset) &&
          <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
            <Grid.Row className="input-row">
              { item.name !== 'Monthly cost' &&
                <Input
                  maxLength="55"
                  type="text"
                  value={item.value}
                  placeholder={item.name}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'cost', 'value', status, planIndex);
                  }}
                />
              }
            </Grid.Row>
          </Grid> ||
          status === 'new' &&
          <Grid columns={1} key={j} className={`new-row-grid ${item.name === 'Monthly cost' ? 'cost-input' : 'cost'}`}>
            <Grid.Row className="input-row">
              {item.name !== 'Monthly cost' &&
                <Input
                  maxLength="55"
                  type="text"
                  value={newPlan[item.name]}
                  placeholder={item.name}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'cost', 'value', status, planIndex);
                  }}
                />
              }
            </Grid.Row>
          </Grid>
        )}
        {/* benefits */}
        { newPlan.benefits.length > 0 && !twoColsFlag &&
        <Grid columns={1} className="new-row-grid benefits title">
          <Grid.Row />
        </Grid>
        }
        { newPlan.benefits.length > 0 && twoColsFlag &&
        <Grid columns={2} className="new-row-grid benefits title height-row-2">
          <Grid.Row>
            <Grid.Column className="two-cols-benefits">IN-NETWORK</Grid.Column>
            <Grid.Column className="two-cols-benefits">OUT-NETWORK</Grid.Column>
          </Grid.Row>
        </Grid>
        }
        { newPlan.benefits.map((item, j) =>
          (item.value !== null && item.value !== undefined) &&
          <Grid columns={1} key={j} className="new-row-grid benefits">
            <Grid.Row className="input-row">
              { status === 'new' &&
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={newPlan[item.name]}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'benefits', 'value', status, planIndex);
                }}
              /> ||
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={item.value}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'benefits', 'value', status, planIndex);
                }}
              />
              }
            </Grid.Row>
          </Grid> ||
          <Grid columns={2} key={j} className="new-row-grid benefits">
            { status === 'new' &&
            <Grid.Row className="input-row">
              <Grid.Column className="two-cols-benefits">
                <Input
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={newPlan[item.name]}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'benefits', 'valueIn', status, planIndex);
                  }}
                />
              </Grid.Column>
              <Grid.Column className="two-cols-benefits">
                <Input
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={newPlan[item.name]}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'benefits', 'valueOut', status, planIndex);
                  }}
                />
              </Grid.Column>
            </Grid.Row> ||
            <Grid.Row className="input-row">
              <Grid.Column className="two-cols-benefits" >
                <Input
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={item.valueIn}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'benefits', 'valueIn', status, planIndex);
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
                    changePlanField(e, j, inputState.value, 'benefits', 'valueOut', status, planIndex);
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            }
          </Grid>
        )}
        {/* rx */}
        { (newPlan.rx && newPlan.rx.length) > 0 &&
        <Grid columns={1} className="new-row-grid benefits title">
          <Grid.Row />
        </Grid>
        }
        { (newPlan.rx && newPlan.rx.length > 0) && newPlan.rx.map((item, j) =>
          <Grid columns={1} key={j} className="new-row-grid rx">
            <Grid.Row className="input-row">
              { status === 'new' &&
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={newPlan[item.name]}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'rx', 'value', status, planIndex);
                }}
              /> ||
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={item.value}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'rx', 'value', status, planIndex);
                }}
              />
              }
            </Grid.Row>
          </Grid>
        )}

        <Grid columns={1} className="bottom">
          <Grid.Row className="button-row">
            <Grid.Column width={1} />
            <Grid.Column width={12}>
              {status === 'new' &&
              <Button size="medium" primary onClick={() => addPlan(section, newPlan, networkIndex, true)}>Add Plan</Button> ||
              <Button size="medium" primary onClick={() => savePlan(newPlan)}>Save</Button>
              }
              <Button size="medium" basic className="cancelAddingPlan" onClick={() => cancelAddingPlan(planIndex)}>Cancel</Button>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>
      </Grid.Row>
    );
  }
}

export default NewPlanColumn;

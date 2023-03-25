import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Button } from 'semantic-ui-react';

class BenefitsInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    newPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
    offset: PropTypes.number,
    section: PropTypes.string.isRequired,
    disabledName: PropTypes.bool,
    disabledRX: PropTypes.bool,
    changePlanField: PropTypes.func.isRequired,
    addPlan: PropTypes.func,
    savePlan: PropTypes.func,
    cancelEditing: PropTypes.func.isRequired,
    networkIndex: PropTypes.number,
    currentPlan: PropTypes.object.isRequired,
    rfpQuoteNetworkId: PropTypes.number.isRequired,
    updatePlanField: PropTypes.func,
    currentRxPlanExists: PropTypes.bool,
    newPlanRx: PropTypes.object,
    currentRxPlan: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: 7,
    };
  }

  componentDidMount() {
    this.setParams();
    this.definePlan(this.props.currentPlan, this.props.currentRxPlan);
  }

  setParams() {
    const anchor = document.getElementById('benefits-editing-anchor');
    const newColumn = document.getElementById('plan-benefits');
    if (newColumn && anchor) {
      const anchorLeft = `${anchor.offsetLeft + (200 * this.props.planIndex)}px`;
      const anchorTop = `${anchor.offsetTop - 120}px`;
      newColumn.style.left = anchorLeft;
      newColumn.style.top = anchorTop;
    }
  }

  definePlan(plan) {
    const { newPlan, section, rfpQuoteNetworkId } = this.props;
    let twoColsFlag = false;
    if (!newPlan.benefits || !newPlan.benefits.length) {
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
    if (!newPlan.rx || !newPlan.rx.length) {
      newPlan.rx = [];
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
      changePlanField,
      cancelEditing,
      planIndex,
      savePlan,
      currentRxPlanExists,
      newPlanRx,
    } = this.props;
    const twoColsFlag = !!(newPlan.benefits[0].valueIn);
    return (
      <Grid.Row id="plan-benefits" className="new-plan-next plan-bebefits-editing">
        <Grid columns={1} className="newPlanHeader">
          <Grid.Row className="center-aligned big-header newPlanH">
            Add benefit information for:
          </Grid.Row>
          <Grid.Row className="plan-name">
            {newPlan.name}
          </Grid.Row>

        </Grid>
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
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={item.value}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'benefits', 'value', 'edit', planIndex);
                }}
              />
            </Grid.Row>
          </Grid> ||
          <Grid columns={2} key={j} className="new-row-grid benefits">
            <Grid.Row className="input-row">
              <Grid.Column className="two-cols-benefits" >
                <Input
                  maxLength="55"
                  type="text"
                  placeholder={item.name}
                  value={item.valueIn}
                  onChange={(e, inputState) => {
                    changePlanField(e, j, inputState.value, 'benefits', 'valueIn', 'edit', planIndex);
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
                    changePlanField(e, j, inputState.value, 'benefits', 'valueOut', 'edit', planIndex);
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
        {/* rx */}
        { !currentRxPlanExists && !newPlanRx && newPlan.rx.length > 0 &&
        <Grid columns={1} className="new-row-grid benefits title">
          <Grid.Row />
        </Grid>
        }
        { !currentRxPlanExists && !newPlanRx && newPlan.rx.map((item, j) =>
          <Grid columns={1} key={j} className="new-row-grid rx">
            <Grid.Row className="input-row">
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={item.value}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'rx', 'value', 'edit', planIndex);
                }}
              />
            </Grid.Row>
          </Grid>
        )}
        { (currentRxPlanExists && newPlanRx && newPlanRx.rx) &&
          <Grid columns={1} className="new-row-grid rx separator">
            <Grid.Row />
          </Grid>
        }
        { (currentRxPlanExists && newPlanRx && newPlanRx.rx) && newPlanRx.rx.map((item, j) =>
          <Grid columns={1} key={j} className="new-row-grid rx">
            <Grid.Row className="input-row">
              <Input
                maxLength="55"
                type="text"
                placeholder={item.name}
                value={item.value}
                onChange={(e, inputState) => {
                  changePlanField(e, j, inputState.value, 'rx', 'value', 'edit', planIndex, true);
                }}
              />
            </Grid.Row>
          </Grid>
        )}
        <Grid columns={1} className="bottom">
          <Grid.Row className="button-row">
            <Grid.Column width={1} />
            <Grid.Column width={12}>
              <Button size="medium" primary onClick={() => savePlan(newPlan)}>Save</Button>
              <Button size="medium" basic className="cancelAddingPlan" onClick={() => cancelEditing(planIndex)}>Cancel</Button>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>
      </Grid.Row>
    );
  }
}

export default BenefitsInfo;

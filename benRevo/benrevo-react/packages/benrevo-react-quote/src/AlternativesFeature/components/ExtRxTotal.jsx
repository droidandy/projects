import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Image } from 'semantic-ui-react';

class ExtRxTotal extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    setBorderRxColor: PropTypes.func,
    plan: PropTypes.object,
    selectedIcon: PropTypes.string,
    selectNtRxPlan: PropTypes.func,
    selectedMatchIcon: PropTypes.string,
  };

  render() {
    const { type, setBorderRxColor, plan, selectedIcon, selectNtRxPlan, selectedMatchIcon } = this.props;
    if (type === 'alternative') {
      return (
        <Grid.Column className={`alt-table-column ${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
          { plan.selected &&
          <Grid.Row className="center-aligned total-row selected-label last-row">
            <div className={`selected ${plan.type}`}>
              <Image className="icon-selected" src={selectedIcon} />
              Selected
            </div>
          </Grid.Row>
          }
          { !plan.selected &&
          <Grid.Row className="center-aligned total-row last-row">
            <Button onClick={() => {selectNtRxPlan(plan);}} size="medium" primary className="select-button select-footer">
              Select Plan
            </Button>
          </Grid.Row>
          }
        </Grid.Column>
      )
    }
    return (
      <Grid.Column key="selected-rx-footer" className={`${setBorderRxColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type} alt-table-column`}>
        { plan.selected &&
        <Grid.Row className="center-aligned total-row selected-label last-row">
          <div className={`selected ${plan.type}`}>
            {plan.type === 'matchPlan' && <Image className="icon-selected" src={selectedMatchIcon} />}
            {plan.type !== 'matchPlan' && <Image className="icon-selected" src={selectedIcon} />}
            Selected
          </div>
        </Grid.Row>
        }
        { !plan.selected &&
        <Grid.Row className="center-aligned total-row last-row">
          <Button onClick={() => {selectNtRxPlan(plan);}} size="medium" primary className="select-button select-footer">
            Select Plan
          </Button>
        </Grid.Row>
        }
      </Grid.Column>
    );
  }
}

export default ExtRxTotal;
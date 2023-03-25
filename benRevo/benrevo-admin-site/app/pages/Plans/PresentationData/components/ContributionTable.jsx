import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Dropdown, Table, Button, Input } from 'semantic-ui-react';
import {
  OUT_OF_STATE_TRUE,
  OUT_OF_STATE_FALSE,
  CONTRIBUTION_OPTIONS,
} from '../../constants';

const stateOptions = [
  { key: 't', text: 'True', value: OUT_OF_STATE_TRUE },
  { key: 'f', text: 'False', value: OUT_OF_STATE_FALSE },
];

class ContributionTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    plan: PropTypes.object.isRequired,
    changedPlans: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    updateSelectedPlan: PropTypes.func.isRequired,
    resetPlanChanges: PropTypes.func.isRequired,
    selectedTiers: PropTypes.array.isRequired,
  };

  render() {
    const { plan, changedPlans, index, updateSelectedPlan, resetPlanChanges, selectedTiers } = this.props;
    return (
      <Grid celled key={plan.client_plan_id}>
        <Grid.Row>
          <Grid.Column width={4}>
            <Form>
              <Form.Input label="Plan Name" value={(changedPlans[index] && (typeof changedPlans[index].planName === 'string')) ? changedPlans[index].planName : plan.planName} onChange={(e) => { updateSelectedPlan(index, plan.client_plan_id, 'planName', e.target.value); }} />
              <Form.Field>
                <label htmlFor={`${plan.client_plan_id}_out_of_state`}>Out of State</label>
                <Dropdown
                  id={`${plan.client_plan_id}_out_of_state`}
                  fluid search selection
                  options={stateOptions}
                  value={((changedPlans[index] && (typeof changedPlans[index].out_of_state === 'string')) && changedPlans[index].out_of_state) || (plan.out_of_state ? OUT_OF_STATE_TRUE : OUT_OF_STATE_FALSE)}
                  onChange={(e, inputState) => { updateSelectedPlan(index, plan.client_plan_id, 'out_of_state', inputState.value); }}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor={`${plan.client_plan_id}_contribution_format`}>Contribution Format</label>
                <Dropdown
                  id={`${plan.client_plan_id}_contribution_format`}
                  fluid search selection
                  options={CONTRIBUTION_OPTIONS}
                  value={(changedPlans[index] && (typeof changedPlans[index].er_contribution_format === 'string')) ? changedPlans[index].er_contribution_format : plan.er_contribution_format}
                  onChange={(e, inputState) => { updateSelectedPlan(index, plan.client_plan_id, 'er_contribution_format', inputState.value); }}
                />
              </Form.Field>
            </Form>
            <div className="static-plan-data">
              <p>Carrier: {plan.carrierName}</p>
              <p>Plan Type: {plan.planType}</p>
            </div>
          </Grid.Column>
          <Grid.Column width={12}>
            <Table className="data-table" style={{ margin: 0, marginBottom: '50px' }}>
              <Table.Header className="data-table-head">
                <Table.Row>
                  <Table.HeaderCell width="1">Tier</Table.HeaderCell>
                  <Table.HeaderCell width="1">Census</Table.HeaderCell>
                  <Table.HeaderCell width="1">Contribution</Table.HeaderCell>
                  <Table.HeaderCell width="1">Rate</Table.HeaderCell>
                  <Table.HeaderCell width="1">Renewal</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { selectedTiers[index].map((tier, k) => (
                  <Table.Row key={`tier[${index}][${k}]`}>
                    <Table.Cell>
                      Tier {k}
                    </Table.Cell>
                    <Table.Cell>
                      <Input className="number-input" value={(changedPlans[index] && typeof changedPlans[index][`tier${k}_census`] !== 'undefined') ? changedPlans[index][`tier${k}_census`] : ((tier.census !== null && (tier.census || '0')) || '')} onChange={(e) => { if (!isNaN(e.target.value)) updateSelectedPlan(index, plan.client_plan_id, `tier${k}_census`, e.target.value); }} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input className="number-input" value={(changedPlans[index] && typeof changedPlans[index][`tier${k}_er_contribution`] !== 'undefined') ? changedPlans[index][`tier${k}_er_contribution`] : ((tier.contribution !== null && (tier.contribution || '0')) || '')} onChange={(e) => { if (!isNaN(e.target.value)) updateSelectedPlan(index, plan.client_plan_id, `tier${k}_er_contribution`, e.target.value); }} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input className="number-input" value={(changedPlans[index] && typeof changedPlans[index][`tier${k}_rate`] !== 'undefined') ? changedPlans[index][`tier${k}_rate`] : ((tier.rate !== null && (tier.rate || '0')) || '')} onChange={(e) => { if (!isNaN(e.target.value)) updateSelectedPlan(index, plan.client_plan_id, `tier${k}_rate`, e.target.value); }} />
                    </Table.Cell>
                    <Table.Cell>
                      <Input className="number-input" value={(changedPlans[index] && typeof changedPlans[index][`tier${k}_renewal`] !== 'undefined') ? changedPlans[index][`tier${k}_renewal`] : ((tier.renewal !== null && (tier.renewal || '0')) || '')} onChange={(e) => { if (!isNaN(e.target.value)) updateSelectedPlan(index, plan.client_plan_id, `tier${k}_renewal`, e.target.value); }} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Button disabled={!changedPlans[index]} className="reset-button" primary size="small" floated="right" onClick={() => resetPlanChanges(index)}>Restore Default Values</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ContributionTable;

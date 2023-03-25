import React from 'react';
import PropTypes from 'prop-types';
import {Header, Input, Grid, Dropdown } from 'semantic-ui-react';
import * as types from '../constants';

class ClassSTD extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    dropdownOptions: PropTypes.object.isRequired,
    updatePlan: PropTypes.func.isRequired
  };

  render() {
    const { section, item, updatePlan, type, index, dropdownOptions } = this.props;

    return (
      <Grid className="life-std-ltd-class">
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Class {index + 1} name</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_NAME}_${type}_${index}`} value={item.name} fluid
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_NAME, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Weekly Benefit</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_WEEKLY_BENEFIT}_${type}_${index}`}
              value={item.weeklyBenefit}
              placeholder="%"
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WEEKLY_BENEFIT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Maximum Weekly Benefit</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_MAX_WEEKLY_BENEFIT}_${type}_${index}`}
              value={item.maxWeeklyBenefit}
              placeholder="$"
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_MAX_WEEKLY_BENEFIT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Maximum Benefit Duration</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_MAX_BENEFIT_DURATION}_${type}_${index}`}
              value={item.maxBenefitDuration}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_MAX_BENEFIT_DURATION, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Waiting Period - Accident/Injury (days): </Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_WP_ACCIDENT}_${type}_${index}`} value={item.waitingPeriodAccident || ''}
              onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WP_ACCIDENT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Waiting Period - Sickness (days):</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_WP_SICKNESS}_${type}_${index}`} value={item.waitingPeriodSickness ||  ''}
              onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WP_SICKNESS, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        { type === 'voluntaryPlan' &&
          <Grid.Row className="voluntaryPlan">
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Pre-Existing Condition Exclusion</Header>
              <Dropdown
                placeholder="Choose"
                search
                name={`${types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION}_${type}_${index}`}
                selection
                options={dropdownOptions.conditionExclusion}
                value={item.conditionExclusion}
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        { item.conditionExclusion === 'Other' &&
          <Grid.Row className="conditionExclusion">
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Other Condition Exclusion</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER}_${type}_${index}`} value={item.conditionExclusionOther}
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
      </Grid>
    );
  }
}

export default ClassSTD;

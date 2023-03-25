import React from 'react';
import PropTypes from 'prop-types';
import {Header, Input, Grid, Dropdown, Form, Radio } from 'semantic-ui-react';
import * as types from '../constants';

class ClassLTD extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
            <Input maxLength="50" name={`${types.LIFE_STD_LTD_CLASS_NAME}_${type}_${index}`} value={item.name} fluid
                   onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_NAME, inputState.value, index); }} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Monthly Benefit</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_LTD_MONTHLY_BENEFIT}_${type}_${index}`}
              value={item.monthlyBenefit}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_LTD_MONTHLY_BENEFIT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Maximum Benefit</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_LTD_MAX_BENEFIT}_${type}_${index}`}
              value={item.maxBenefit}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_LTD_MAX_BENEFIT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Maximum Benefit Duration</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_LTD_MAX_BENEFIT_DURATION}_${type}_${index}`}
              value={item.maxBenefitDuration}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_LTD_MAX_BENEFIT_DURATION, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Elimination Period (days): </Header>
            <Input maxLength="10" name={`${types.LIFE_STD_LTD_CLASS_ELIMINATION_PERIOD}_${type}_${index}`} value={item.eliminationPeriod || ''}
                   onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_ELIMINATION_PERIOD, (inputState.value) ? parseFloat(inputState.value) : null, index); }} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
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
        { item.conditionExclusion === 'Other' &&
          <Grid.Row className="conditionExclusion">
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Other Condition Exclusio</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER}_${type}_${index}`} value={item.conditionExclusionOther}
                onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Own Occupation Definition</Header>
            <Dropdown
              placeholder="Choose"
              search
              name={`${types.LIFE_STD_LTD_CLASS_OCCUPATION}_${type}_${index}`}
              selection
              options={dropdownOptions.occupationDefinition}
              value={item.occupationDefinition}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_OCCUPATION, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        { item.occupationDefinition === 'Other' &&
          <Grid.Row className="occupationDefinition">
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Other Occupation Definition</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_OCCUPATION_OTHER}_${type}_${index}`} value={item.occupationDefinitionOther}
                onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_OCCUPATION_OTHER, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Mental Health/Substance Abuse Limitation</Header>
            <Dropdown
              placeholder="Choose"
              search
              name={`${types.LIFE_STD_LTD_CLASS_ABUSE}_${type}_${index}`}
              selection
              options={dropdownOptions.abuseLimitation}
              value={item.abuseLimitation}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_ABUSE, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        { item.abuseLimitation === 'Other' &&
          <Grid.Row className="abuseLimitation">
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Other Mental Health/Substance Abuse Limitation</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_ABUSE_OTHER}_${type}_${index}`} value={item.abuseLimitationOther}
                onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_ABUSE_OTHER, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {/* <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Does the current plan include Waiver of Premium?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name={`${types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM}_${type}_${index}`}
                  value="yes"
                  checked={item.waiverOfPremium === 'yes'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name={`${types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM}_${type}_${index}`}
                  value="no"
                  checked={item.waiverOfPremium === 'no'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row> */}
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Premiums Paid</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Pre-tax"
                  name={`${types.LIFE_STD_LTD_CLASS_PREMIUMS_PAID}_${type}_${index}`}
                  value="Pre-tax"
                  checked={item.premiumsPaid === 'Pre-tax'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_PREMIUMS_PAID, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Post-tax"
                  name={`${types.LIFE_STD_LTD_CLASS_PREMIUMS_PAID}_${type}_${index}`}
                  value="Post-tax"
                  checked={item.premiumsPaid === 'Post-tax'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_PREMIUMS_PAID, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ClassLTD;

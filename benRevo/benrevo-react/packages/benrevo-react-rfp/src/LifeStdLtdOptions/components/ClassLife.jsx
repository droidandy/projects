import React from 'react';
import PropTypes from 'prop-types';
import {Header, Input, Form, Radio, Grid } from 'semantic-ui-react';
import * as types from '../constants';

class ClassLife extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    updatePlan: PropTypes.func.isRequired
  };

  render() {
    const { section, item, updatePlan, type, index } = this.props;

    return (
      <Grid className="life-std-ltd-class">
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Class {index + 1} name</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_NAME}_${type}_${index}`}
              value={item.name}
              fluid
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_NAME, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">{type === 'voluntaryPlan' ? 'Employee ' : ''}Benefit Amount</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_BENEFIT_AMOUNT}_${type}_${index}`}
              value={item.employeeBenefitAmount}
              fluid
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_BENEFIT_AMOUNT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">{type === 'voluntaryPlan' ? 'Employee ' : ''}Maximum Benefit</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_MAX_BENEFIT}_${type}_${index}`}
              value={item.employeeMaxBenefit}
              fluid
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_MAX_BENEFIT, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">{type === 'voluntaryPlan' ? 'Employee ' : ''}Guarantee Issue</Header>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_GUARANTEE_ISSUE}_${type}_${index}`}
              value={item.employeeGuaranteeIssue}
              fluid
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_GUARANTEE_ISSUE, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Spouse Benefit Amount</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_SPOUSE_BENEFIT_AMOUNT}_${type}_${index}`}
                value={item.spouseBenefitAmount}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_SPOUSE_BENEFIT_AMOUNT, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Spouse Maximum Benefit</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_SPOUSE_MAX_BENEFIT}_${type}_${index}`}
                value={item.spouseMaxBenefit}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_SPOUSE_MAX_BENEFIT, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Spouse Guarantee Issue</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_SPOUSE_GUARANTEE_ISSUE}_${type}_${index}`}
                value={item.spouseGuaranteeIssue}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_SPOUSE_GUARANTEE_ISSUE, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Child Benefit Amount</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_CHILD_BENEFIT_AMOUNT}_${type}_${index}`}
                value={item.childBenefitAmount}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CHILD_BENEFIT_AMOUNT, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Child Maximum Benefit</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_CHILD_MAX_BENEFIT}_${type}_${index}`}
                value={item.childMaxBenefit}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CHILD_MAX_BENEFIT, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {type === 'voluntaryPlan' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Child Guarantee Issue</Header>
              <Input
                maxLength="50"
                name={`${types.LIFE_STD_LTD_CLASS_CHILD_GUARANTEE_ISSUE}_${type}_${index}`}
                value={item.childGuaranteeIssue}
                fluid
                onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_CHILD_GUARANTEE_ISSUE, inputState.value, index); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Does the current plan include Waiver of Premium?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name={`${types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM}_${type}_${index}`}
                  value="Yes"
                  checked={item.waiverOfPremium === 'Yes'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name={`${types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM}_${type}_${index}`}
                  value="No"
                  checked={item.waiverOfPremium === 'No'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_WAIVER_PREMIUM, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Does the current plan include Accelerated Death Benefit?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_BENEFIT}_${type}_${index}`}
                  value="Yes"
                  checked={item.deathBenefit === 'Yes'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_BENEFIT, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_BENEFIT}_${type}_${index}`}
                  value="No"
                  checked={item.deathBenefit === 'No'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_BENEFIT, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        {item.deathBenefit === 'Yes' &&
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" className="rfpPageFormSetHeading">Percentage</Header>
              <Input maxLength="50" name={`${types.LIFE_STD_LTD_CLASS_PERCENTAGE}_${type}_${index}`} value={item.percentage || ''} placeholder="%"
                     onChange={ (e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_PERCENTAGE, (inputState.value) ? parseFloat(inputState.value) : null, index); }} />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Does the current plan include a Conversion option?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_CONVERSION}_${type}_${index}`}
                  value="Yes"
                  checked={item.conversion === 'Yes'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_CONVERSION, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_CONVERSION}_${type}_${index}`}
                  value="No"
                  checked={item.conversion === 'No'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_CONVERSION, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Does the current plan include a Portability option?</Header>
            <Form>
              <Form.Field>
                <Radio
                  label="Yes"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_PORTABILITY}_${type}_${index}`}
                  value="Yes"
                  checked={item.portability === 'Yes'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_PORTABILITY, inputState.value, index); }}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="No"
                  name={`${types.LIFE_STD_LTD_CLASS_DEATH_PORTABILITY}_${type}_${index}`}
                  value="No"
                  checked={item.portability === 'No'}
                  onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_DEATH_PORTABILITY, inputState.value, index); }}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" className="rfpPageFormSetHeading">Age reduction schedule (reduced by %)</Header>
            <span>Age 65: </span>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_AGE_65}_${type}_${index}`}
              value={item.age65reduction}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_AGE_65, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <span>Age 70: </span>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_AGE_70}_${type}_${index}`}
              value={item.age70reduction}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_AGE_70, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <span>Age 75: </span>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_AGE_75}_${type}_${index}`}
              value={item.age75reduction || ''}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_AGE_75, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <span>Age 80: </span>
            <Input
              maxLength="50"
              name={`${types.LIFE_STD_LTD_CLASS_AGE_80}_${type}_${index}`}
              value={item.age80reduction}
              onChange={(e, inputState) => { updatePlan(section, type, types.LIFE_STD_LTD_CLASS_AGE_80, inputState.value, index); }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ClassLife;

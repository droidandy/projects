import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Input, Form, Checkbox } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import {
  CHANGE_BUY_FROM_BASE_PLAN,
  EMPLOYEE_ONLY,
  EMPLOYEE_FAMILY,
  EMPLOYEE_1,
  EMPLOYEE_2,
  EMPLOYEE_SPOUSE,
  EMPLOYEE_CHILD,
} from './../../constants';

class TiersForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onInputKeyUp = this.onInputKeyUp.bind(this);
  }

  onInputKeyUp(e) {
    const input = e.target;
    if (e.keyCode === 9) {
      input.setSelectionRange(0, input.value.length);
    }
  }

  render() {
    const { updatePlanTier, item, index, tiers, tierLength, outOfStateTiers, outOfState, contributionType, section, updateForm, buyUp, isRates, outOfStateTitle, formErrors, tierType } = this.props;
    const labels = {
      1: [EMPLOYEE_ONLY],
      2: [EMPLOYEE_ONLY, EMPLOYEE_FAMILY],
      3: [EMPLOYEE_ONLY, EMPLOYEE_1, EMPLOYEE_2],
      4: [EMPLOYEE_ONLY, EMPLOYEE_SPOUSE, EMPLOYEE_CHILD, EMPLOYEE_FAMILY],
    };
    // const error = formErrors[tierType];
    return (
      <Grid.Row columns={6} className="rfpRowDivider">
        <Grid.Column width={5}>
          {!isRates &&
            <div>
              <Header as="h3" className="rfpPageTopSectionHeading">{(index === 0) ? 'BASEPLAN' : item.title}</Header>
              <Header as="h3" className="rfpPageSubSectionHeading">{item.name}</Header>
            </div>
          }
          {isRates &&
          <div>
            <Header as="h3" className="rfpPageTopSectionHeading">{(index === 0) ? 'BASEPLAN' : `${section} plan - option ${index}`}</Header>
            <Header as="h3" className="rfpPageSubSectionHeading">{`${item.title} (${item.name})`}</Header>
          </div>
          }
        </Grid.Column>
        {item[tiers].map(
          (tier, j) => (
            <Grid.Column className="rfpColumnPadding" key={j}>
              <Header as="h3" className="rfpPageSectionHeading">Tier {j + 1}</Header>
              <Header as="h3" className={(tierLength <= 2) ? 'rfpPageSubSectionHeading' : 'rfpPageSubSectionHeading minHeight'}>{labels[tierLength][j]}</Header>
              <NumberFormat
                customInput={Input}
                prefix={(contributionType === '$') ? '$' : ''}
                suffix={(contributionType === '%') ? '%' : ''}
                name={`${tierType}-${index}-${j}`}
                placeholder={contributionType}
                value={(tier.value !== null) ? tier.value : ''}
                fluid
                allowNegative={false}
                onValueChange={(inputState) => { updatePlanTier(section, index, tiers, outOfState, j, inputState.value, item[outOfState]); }}
                onKeyUp={this.onInputKeyUp}
                className={(item[tiers].length > 1) ? `tier-item-${j + 1}` : 'tier-item'}
              />
            </Grid.Column>
            )
        )}
        { item[tiers].length <= 2 && <Grid.Column />}
        { item[tiers].length <= 2 && <Grid.Column />}
        <Grid.Column width={5} />
        { outOfState &&
        <Grid.Column width="11" className="rfpBlockTop">
          <Checkbox label={outOfStateTitle} checked={item[outOfState]} onChange={(e, inputState) => { updatePlanTier(section, index, null, outOfState, null, null, inputState.checked); }} />
        </Grid.Column>
        }
        { item[outOfState] && <Grid.Column width={5} /> }
        { item[outOfState] &&
        item[outOfStateTiers].map(
          (tier, j) => (
            <Grid.Column className="tier-item rfpColumnPadding rfpBlockTop" key={j}>
              <NumberFormat
                customInput={Input}
                prefix={(contributionType === '$') ? '$' : ''}
                suffix={(contributionType === '%') ? '%' : ''}
                name={`${tierType}-oos-${index}-${j}`}
                placeholder={contributionType}
                value={tier.value}
                fluid
                allowNegative={false}
                onKeyUp={this.onInputKeyUp}
                onValueChange={(inputState) => { updatePlanTier(section, index, outOfStateTiers, outOfState, j, inputState.value, item[outOfState]); }}
              />
            </Grid.Column>
            )
        )}

        { item[outOfState] && item[outOfStateTiers].length <= 2 && <Grid.Column />}
        { item[outOfState] && item[outOfStateTiers].length <= 2 && <Grid.Column />}

        { buyUp && index === 0 && <Grid.Column width={5} only="computer" />}
        { buyUp && index === 0 && <Grid.Column width={5} only="tablet" />}
        { buyUp && index === 0 && <Grid.Column width={5} only="large screen" />}
        { buyUp && index === 0 &&
        <Grid.Column width="11">
          <Form className="rfpBlockTop">
            <Form.Group inline>
              <label htmlFor="buyUp">* Are the plan options a buy up from the baseplan?</label>
              <Form.Radio
                label="Yes"
                value="yes"
                name="buyUp"
                checked={buyUp === 'yes'}
                onChange={(e, inputState) => { updateForm(section, CHANGE_BUY_FROM_BASE_PLAN, inputState.value); }}
              />
              <Form.Radio
                label="No"
                value="no"
                name="buyUp"
                checked={buyUp === 'no'}
                onChange={(e, inputState) => { updateForm(section, CHANGE_BUY_FROM_BASE_PLAN, inputState.value); }}
              />
            </Form.Group>
          </Form>
        </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

TiersForm.propTypes = {
  item: PropTypes.object.isRequired,
  formErrors: PropTypes.object.isRequired,
  contributionType: PropTypes.string,
  outOfStateTitle: PropTypes.string,
  tiers: PropTypes.string.isRequired,
  tierLength: PropTypes.number.isRequired,
  outOfStateTiers: PropTypes.string,
  outOfState: PropTypes.string,
  tierType: PropTypes.string,
  index: PropTypes.number.isRequired,
  updatePlanTier: PropTypes.func.isRequired,
  updateForm: PropTypes.func,
  section: PropTypes.string.isRequired,
  buyUp: PropTypes.string,
  isRates: PropTypes.bool,
};

export default TiersForm;

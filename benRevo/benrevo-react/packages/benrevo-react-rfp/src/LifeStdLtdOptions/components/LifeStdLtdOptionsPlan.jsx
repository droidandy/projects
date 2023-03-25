import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Button, Icon, Dropdown, Input } from 'semantic-ui-react';
import ClassLife from './ClassLife';
import ClassSTD from './ClassSTD';
import ClassLTD from './ClassLTD';
import {
  RFP_LIFE_SECTION,
  RFP_STD_SECTION,
  RFP_LTD_SECTION,
} from '../../constants';
import {
  LIFE_STD_LTD_CARRIER,
  LIFE_STD_LTD_PLAN_NAME,
} from '../constants';

class LifeStdLtdOptionsPlan extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    carrierList: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    dropdownOptions: PropTypes.object.isRequired,
    changeLifeStdLtdPlan: PropTypes.func.isRequired,
    addLifeStdLtdPlan: PropTypes.func.isRequired,
    removeLifeStdLtdPlan: PropTypes.func.isRequired,
    changeLifeStdLtdPlanClass: PropTypes.func.isRequired,
  };

  render() {
    const {
      section,
      header,
      type,
      title,
      plan,
      addLifeStdLtdPlan,
      removeLifeStdLtdPlan,
      changeLifeStdLtdPlanClass,
      changeLifeStdLtdPlan,
      dropdownOptions,
      carrierList,
    } = this.props;

    return (
      <Grid stackable columns={2} className="inner-grid-segment">
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading">Current {title} Carrier</Header>
            <Header as="h3" className="rfpPageSubSectionHeading">{header}</Header>
          </Grid.Column>
          <Grid.Column tablet={8} computer={7}>
            <Header as="h3" className="rfpPageFormSetHeading">Which carrier are you currently with?</Header>
            <Dropdown
              placeholder="Select"
              search
              fluid
              name={`${LIFE_STD_LTD_CARRIER}_${type}`}
              selection
              options={carrierList}
              value={plan.carrierId}
              onChange={(e, inputState) => {
                changeLifeStdLtdPlan(section, type, 'carrierId', inputState.value);
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading">Name of {title} Plan</Header>
            <Header as="h3" className="rfpPageSubSectionHeading">{header}</Header>
          </Grid.Column>
          <Grid.Column tablet={8} computer={7}>
            <Header as="h3" className="rfpPageFormSetHeading">Please, enter the plan name</Header>
            <Input
              maxLength="50"
              fluid
              name={`${LIFE_STD_LTD_PLAN_NAME}_${type}`}
              value={plan.planName || ''}
              onChange={(e, inputState) => { changeLifeStdLtdPlan(section, type, 'planName', inputState.value); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="rfpRowDivider">
          <Grid.Column width={5}>
            <Header as="h3" className="rfpPageSectionHeading">{title} Classes</Header>
            <Header as="h3" className="rfpPageSubSectionHeading">{header}</Header>
          </Grid.Column>
          <Grid.Column tablet={8} computer={7}>
            <Header as="h3" className="rfpPageFormSetHeading">How many incumbent {title} classes do you have?</Header>
            <div className="count-control rfpBlock">
              <Button disabled={plan.classes.length >= 4} onClick={() => { addLifeStdLtdPlan(section, type); }} icon size="medium"><Icon name="plus" /></Button>
              <span className="indicator big">{ plan.classes.length }</span>
              <Button disabled={plan.classes.length === 1} onClick={() => { removeLifeStdLtdPlan(section, type); }} icon size="medium"><Icon name='minus' /></Button>
            </div>
            <div className="rfpSeparate">
              <span>Details</span>
            </div>
            {plan.classes.map(
              (item, i) => {
                if (section === RFP_LIFE_SECTION) return <ClassLife key={i} section={section} type={type} item={item} updatePlan={changeLifeStdLtdPlanClass} index={i} />
                else if (section === RFP_STD_SECTION) return <ClassSTD key={i} section={section} type={type} item={item} updatePlan={changeLifeStdLtdPlanClass} index={i} dropdownOptions={dropdownOptions} />
                else if (section === RFP_LTD_SECTION) return <ClassLTD key={i} section={section} type={type} item={item} updatePlan={changeLifeStdLtdPlanClass} index={i} dropdownOptions={dropdownOptions} />
              }
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default LifeStdLtdOptionsPlan;

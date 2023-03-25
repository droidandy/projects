import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, Input, Checkbox } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { PLAN_CURRENT_TIERS } from '../../constants';

class BandedForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    outOfState: PropTypes.string.isRequired,
    outOfStateTitle: PropTypes.string.isRequired,
    bandedType: PropTypes.string.isRequired,
    outOfStateBandedType: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updatePlanBanded: PropTypes.func.isRequired,
    updatePlanTier: PropTypes.func.isRequired,
  };

  render() {
    const { item, section, index, updatePlanBanded, updatePlanTier, outOfState, outOfStateTitle, outOfStateBandedType, bandedType } = this.props;
    return (
      <Grid.Row columns={6} className="rfpRowDivider" key={index}>
        <Grid.Column width={5}>
          <div>
            <Header as="h3" className="rfpPageTopSectionHeading">{(index === 0) ? 'BASEPLAN' : item.title}</Header>
            <Header as="h3" className="rfpPageSubSectionHeading">{`${item.title} (${item.name})`}</Header>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h3" className="rfpPageSectionHeading">Monthly Age Banded Premium</Header>
          <Header as="h3" className="rfpPageSubSectionHeading" />
          <NumberFormat
            customInput={Input}
            prefix={'$'}
            placeholder={'$'}
            suffix={''}
            name={PLAN_CURRENT_TIERS}
            value={(item[bandedType].value !== null) ? item[bandedType].value : ''}
            onValueChange={(inputState) => { updatePlanBanded(section, index, bandedType, inputState.value); }}
            fluid
            allowNegative={false}
            className={'tier-item'}
          />
        </Grid.Column>
        <Grid.Column width={7} />
        <Grid.Column width={5} />
        <Grid.Column width={11} className="rfpBlockTop" key={index}>
          <Checkbox
            label={outOfStateTitle}
            onChange={(e, inputState) => { updatePlanTier(section, index, null, outOfState, null, null, inputState.checked); }}
            checked={item[outOfState]}
          />
        </Grid.Column>
        { item[outOfState] &&
        <Grid.Column width={5} />
        }
        { item[outOfState] &&
        <Grid.Column width={4} className="rfpBlockTop">
          <NumberFormat
            customInput={Input}
            prefix={'$'}
            placeholder={'$'}
            suffix={''}
            name={`${PLAN_CURRENT_TIERS}-oos`}
            value={(item[outOfStateBandedType].value !== null) ? item[outOfStateBandedType].value : ''}
            onValueChange={(inputState) => { updatePlanBanded(section, index, outOfStateBandedType, inputState.value); }}
            fluid
            allowNegative={false}
            className={'tier-item'}
          />
        </Grid.Column>
        }
        { item[outOfState] &&
        <Grid.Column width={7} />
        }
      </Grid.Row>
    );
  }
}

export default BandedForm;

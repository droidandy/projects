import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Header } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class GridBasicLifeADDRow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    withoutRenewal: PropTypes.bool,
    withoutCurrent: PropTypes.bool,
    showRenewalTitle: PropTypes.bool,
    basicRates: PropTypes.object.isRequired,
    updateForm: PropTypes.func.isRequired,
  };
  render() {
    const { section, basicRates, updateForm, withoutRenewal, withoutCurrent, showRenewalTitle } = this.props;
    return (
      <Grid.Row className="rateRow">
        <Grid.Column width={4} />
        {!withoutCurrent &&
          <Grid.Column width={5} className="rfpColumnPadding">
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">{showRenewalTitle ? 'Renewal' : 'Current'}  Rate <strong>AD&D</strong></Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="currentADD"
              placeholder={'$'}
              value={(basicRates.currentADD !== null) ? basicRates.currentADD : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'currentADD', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="currentADD"
            />
          </Grid.Column>
        }
        { !withoutRenewal &&
          <Grid.Column width={5} className="rfpColumnPadding">
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">Renewal Rate <strong>AD&D</strong> (not required)</Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="renewalADD"
              placeholder={'$'}
              value={(basicRates.renewalADD !== null) ? basicRates.renewalADD : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'renewalADD', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="renewalADD"
            />
          </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

export default GridBasicLifeADDRow;

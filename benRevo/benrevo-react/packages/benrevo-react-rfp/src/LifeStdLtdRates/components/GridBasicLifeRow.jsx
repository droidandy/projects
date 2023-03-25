import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Header } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

class GridBasicLifeRow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    withoutRenewal: PropTypes.bool,
    withoutCurrent: PropTypes.bool,
    showRenewalTitle: PropTypes.bool,
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
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">{showRenewalTitle ? 'Renewal' : 'Current'}  Rate <strong>Life</strong></Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="currentLife"
              placeholder={'$'}
              value={(basicRates.currentLife !== null) ? basicRates.currentLife : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'currentLife', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="currentLife"
            />
          </Grid.Column>
        }
        {!withoutRenewal &&
          <Grid.Column width={5} className="rfpColumnPadding">
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">Renewal Rate <strong>Life</strong> (not required)</Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="renewalLife"
              placeholder={'$'}
              value={(basicRates.renewalLife !== null) ? basicRates.renewalLife : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'renewalLife', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="renewalLife"
            />
          </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

export default GridBasicLifeRow;

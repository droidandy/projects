import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Header } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { RFP_STD_SECTION } from './../../constants';

class GridBasicStdLtdRow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
      <Grid.Row className="rateRow" key={section}>
        <Grid.Column width={4} />
        {!withoutCurrent &&
          <Grid.Column width={5} className="rfpColumnPadding">
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">{showRenewalTitle ? 'Renewal' : 'Current'} Rate <strong>{ section === RFP_STD_SECTION && 'STD' || 'LTD' }</strong></Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="currentSL"
              placeholder={'$'}
              value={(basicRates.currentSL !== null) ? basicRates.currentSL : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'currentSL', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="currentLife"
            />
          </Grid.Column>
        }
        {!withoutRenewal &&
          <Grid.Column width={5} className="rfpColumnPadding">
            <Header as="h3" id="CurrentRateLife" className="rfpPageFormSetHeading minHeightFix2">Renewal Rate <strong>{ section === RFP_STD_SECTION && 'STD' || 'LTD' }</strong> (not required)</Header>
            <NumberFormat
              customInput={Input}
              prefix={'$'}
              name="renewalSL"
              decimalScale={3}
              placeholder={'$'}
              value={(basicRates.renewalSL !== null) ? basicRates.renewalSL : ''}
              fluid
              allowNegative={false}
              onValueChange={(inputState) => { updateForm(section, 'basicPlan', 'renewalSL', (inputState.value) ? parseFloat(inputState.value) : null); }}
              className="renewalLife"
            />
          </Grid.Column>
        }
      </Grid.Row>
    );
  }
}

export default GridBasicStdLtdRow;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import {
  DOLLAR_WORD,
  PERCENT_WORD
} from '../../constants';

class BenefitItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    benefit: PropTypes.object.isRequired,
    benefitIndex: PropTypes.number.isRequired,
    planIndex: PropTypes.number.isRequired,
    compareOptions: PropTypes.array.isRequired,
  };

  valueFormat(benefit, value, type) {
    if (value === 'N/A') return 'N/A';

    if (!benefit) return '';
    else if (type  === DOLLAR_WORD && (parseInt(value) || value === '0')) {
      return (
        <FormattedNumber
          style="currency" // eslint-disable-line react/style-prop-object
          currency="USD"
          minimumFractionDigits={0}
          maximumFractionDigits={0}
          value={value}
        />
      )
    } else if (type  === DOLLAR_WORD && !parseInt(value)) {
      return value;
    } else if (type === PERCENT_WORD) {
      return (
        <FormattedNumber
          style="percent" // eslint-disable-line react/style-prop-object
          value={value/100}
        />
      )
    } else if (type === 'NUMBER' || type === 'STRING') return value;

    return '';
  }

  render() {
    const { compareOptions, benefit, benefitIndex, planIndex, plan } = this.props;

    return (
      <Grid.Row className="compare-option-row">
        <Grid.Column className="compare-table-column compare-option-cell">
          {benefit.name}
        </Grid.Column>
        {compareOptions.map((option, l) => {
          let present = option.plans[planIndex] && plan.networkName === option.plans[planIndex].networkName;
          let benefitItem = (present) ? option.plans[planIndex].networkPlan.benefits[benefitIndex] : null;
          let value = '';
          let valueIn;
          let valueOut;

          if (benefitItem && benefitItem.valueIn && benefitItem.valueOut) {
            valueIn = benefitItem.valueIn;
            valueOut = benefitItem.valueOut;
          } else if(benefitItem) value = benefitItem.value;

          return (
            <Grid.Column key={l} className="compare-table-column compare-option compare-option-cell" textAlign="right">
              {valueIn && valueOut &&
              <Grid>
                <Grid.Column className="compare-option-valueIn" width="8">
                    {this.valueFormat(benefitItem, valueIn, (benefitItem) ? benefitItem.typeIn : null)}
                </Grid.Column>
                <Grid.Column width="8">
                  {this.valueFormat(benefitItem, valueOut, (benefitItem) ? benefitItem.typeOut : null)}
                </Grid.Column>
              </Grid>
              }

              {!valueIn && !valueOut && this.valueFormat(benefitItem, value, (benefitItem) ? benefitItem.type : null)}
            </Grid.Column>
          )
        })}
      </Grid.Row>
    );
  }
}

export default BenefitItem;

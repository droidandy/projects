import React from 'react';
import { Grid } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';

class DifferenceColumn extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    borderClass: PropTypes.string.isRequired,
    plan: PropTypes.object.isRequired,
  };

  render() {
    const { borderClass, plan } = this.props;
    const classOfGrid = `alt-table-column blue ${borderClass} ${plan.selected ? 'selected' : ''} ${plan.type}`;
    const separatePercent = (item) => <small>{plan.percentDifference || item.value}<span className="percent">%</span></small>;
    // console.log('DifferenceColumn props', this.props);
    return (
      <Grid key="match-cost" className={classOfGrid}>
        <Grid.Row className="cost-row center-aligned">
          <span className="value">
            {plan.type !== 'current' && plan.cost && plan.cost.map((item, j) =>
              item.name === '% change from current' &&
              <FormattedNumber
                key={j}
                style="percent" // eslint-disable-line react/style-prop-object
                minimumFractionDigits={0}
                maximumFractionDigits={1}
                value={item.value ? item.value / 100 : 0}
              >
                {separatePercent(item)}
              </FormattedNumber>
            )}
            {((!plan.cost) || plan.type === 'current') && '-' }
          </span>
          <span className="name">% Difference from Current</span>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DifferenceColumn;

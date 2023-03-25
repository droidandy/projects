import React from 'react';
import { Grid } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';

class DifferenceColumn extends React.Component {
  static propTypes = {
    borderClass: PropTypes.string.isRequired,
    plan: PropTypes.object.isRequired,
  };

  render() {
    const { borderClass, plan } = this.props;
    const classOfGrid = `alt-table-column blue ${borderClass} ${plan.selected ? 'selected' : ''} ${plan.type}`;
    const separatePercent = () => <span>{plan.percentDifference}<span className="percent">%</span></span>;
    return (
      <Grid key="match-cost" className={classOfGrid}>
        <Grid.Row className="cost-row center-aligned">
          <span className="value">
            {plan.cost[1] && plan.type !== 'current' &&
              <FormattedNumber
                style="percent" // eslint-disable-line react/style-prop-object
                minimumFractionDigits={0}
                maximumFractionDigits={1}
                value={plan.cost[1] ? plan.cost[1].value / 100 : 0}
              >
                {separatePercent}
              </FormattedNumber>
            }
            {(!plan.cost[1] || plan.type === 'current') && '-' }
          </span>
          <span className="name">% Difference from Current</span>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DifferenceColumn;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ItemValueTyped from './ItemValueTyped';

class RXBody extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    rxClassName: PropTypes.string.isRequired,
    bottomSeparatedRxSysName: PropTypes.array,
    rxColumnClassName: PropTypes.string,
    rxRowType: PropTypes.string,
  };

  render() {
    const { plan, rxClassName, bottomSeparatedRxSysName, rxColumnClassName, rxRowType } = this.props;
    return (
      <Grid.Column className={rxClassName}>
        {plan.rx && plan.rx.map((item, j) =>
          <Grid
            columns={1}
            key={j}
            className={`${bottomSeparatedRxSysName.includes(item.sysName) ? 'bottom-separated' : 'bottom-separated-light'}`}
          >
            <Grid.Row className={rxRowType === 'name' ? '' : 'center-aligned'}>
              <Grid.Column className={rxColumnClassName}>
                { rxRowType === 'name' && item.name }
                { rxRowType !== 'name' &&
                <ItemValueTyped item={item} />
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Grid.Column>
    );
  }
}

export default RXBody;

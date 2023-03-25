import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ItemValueTyped from './ItemValueTyped';

class CostBody extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    costClass: PropTypes.string.isRequired,
  };

  render() {
    const { costClass, plan } = this.props;
    return (
      <Grid.Column className={costClass}>
        {plan.cost && plan.cost.map((item, j) =>
          item.name !== '% change from current' &&
          <Grid columns={1} key={j} className="value-row">
            <Grid.Row className="center-aligned">
              <ItemValueTyped className="name" item={item} benefits={''} />
              <span className="name">{item.name}</span>
            </Grid.Row>
          </Grid>
        )}
      </Grid.Column>
    );
  }
}

export default CostBody;

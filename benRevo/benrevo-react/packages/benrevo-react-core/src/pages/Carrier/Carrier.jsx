import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import NavigationCarrier from './NavigationCarrier';

class Carrier extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    console.log('carrier');
    return (
      <div className="carrierMainContainer">
        <NavigationCarrier route={this.props.route} />
        <Grid stackable container columns={2} className="section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              {this.props.children}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Carrier;

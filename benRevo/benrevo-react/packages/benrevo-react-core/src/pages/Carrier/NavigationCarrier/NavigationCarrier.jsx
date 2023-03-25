import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid } from 'semantic-ui-react';

class NavigationCarrier extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
  };

  render() {
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Row className="nav-row">
            <Grid.Column width={3}>
              <Grid.Row>
                <strong>Baker Industries</strong>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={9}>
              <Grid.Row> </Grid.Row>
            </Grid.Column>
            <Grid.Column width={4}>
              <Grid.Row>
                Have a question? <Link href="#"> Contact to you broker </Link>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default NavigationCarrier;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import SubNavigation from '../../components/SubNavigation';
import messages from './messages';
import Navigation from '../../pages/Client/Navigation';

class Sales extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object,
    children: PropTypes.node,
    getPersons: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getPersons } = this.props;
    getPersons();
  }

  render() {
    return (
      <div>
        <Navigation />
        <Grid stackable container className="sales section-wrap">
          <Grid.Row columns={2}>
            <Grid.Column width={2}>
              <SubNavigation route={this.props.route} messages={messages} />
            </Grid.Column>
            <Grid.Column width={14}>
              {this.props.children}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Sales;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import SubNavigation from '../../components/SubNavigation';
import Navigation from '../../pages/Client/Navigation';
import messages from './messages';

class PlanDesign extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object,
    children: PropTypes.node,
  };

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <Navigation />
        <Grid stackable container className="plan-design section-wrap">
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

export default PlanDesign;

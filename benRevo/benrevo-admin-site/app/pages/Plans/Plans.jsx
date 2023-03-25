import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import SubNavigation from '../../components/SubNavigation';
import messages from './messages';
import Navigation from '../Client//Navigation';

class Plans extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object,
    children: PropTypes.node,
    selectedClient: PropTypes.object.isRequired,
    getCPlans: PropTypes.func.isRequired,
    getCHistory: PropTypes.func.isRequired,
    updatePlansPage: PropTypes.func.isRequired,
    getDates: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { selectedClient, getCPlans, getCHistory, updatePlansPage, getDates } = this.props;
    const clientId = selectedClient.id;
    getCPlans(clientId);
    getCHistory('medical');
    getCHistory('dental');
    getCHistory('vision');
    updatePlansPage();
    getDates();
  }

  render() {
    return (
      <div>
        <Navigation />
        <Grid stackable container className="plans section-wrap">
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

export default Plans;

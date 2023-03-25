import React from 'react';
import PropTypes from 'prop-types';
import { Team } from '@benrevo/benrevo-react-rfp';
import SubNavigation from '../components/SubNavigation';
import messages from '../messages';

class TeamPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
  };

  render() {
    const { clientId } = this.props.params;
    const section = this.props.routes[4].path;
    const routes = [...this.props.routes];
    routes.splice(1, 2);

    return (
      <div>
        <SubNavigation
          route={this.props.route}
          messages={messages}
          prefix={`/clients/${clientId}`}
          products={this.props.products}
          virginCoverage={this.props.virginCoverage}
          parent="rfp"
        />
        <Team
          {...this.props}
          routes={routes}
          section={section}
          prefix={`/clients/${clientId}`}
        />
      </div>
    );
  }
}

export default TeamPage;

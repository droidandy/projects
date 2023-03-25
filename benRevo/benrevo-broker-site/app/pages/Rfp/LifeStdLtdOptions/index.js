import React from 'react';
import PropTypes from 'prop-types';
import { LifeStdLtdOptions } from '@benrevo/benrevo-react-rfp';

class LifeStdLtdOptionsPages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const { clientId } = this.props.params;
    const section = this.props.routes[4].path;
    const routes = [...this.props.routes];
    routes.splice(1, 2);

    return (
      <LifeStdLtdOptions
        {...this.props}
        routes={routes}
        section={section}
        prefix={`/clients/${clientId}`}
      />
    );
  }
}

export default LifeStdLtdOptionsPages;

import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  ClientInfo,
} from '@benrevo/benrevo-react-rfp';

class ClientInfoPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
      <ClientInfo
        {...this.props}
        routes={routes}
        clearValue
        hideClearValueMessage
        carrierName="Insurance carrier"
        section={section}
        prefix={`/clients/${clientId}`}
        hideSitusWarning
      />
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, null)(ClientInfoPage);

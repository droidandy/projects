import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  ClientProducts,
} from '@benrevo/benrevo-react-rfp';

class ClientInfoPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    return (
      <ClientProducts
        { ...this.props }
        routes={this.props.routes}
        showDeclined
      />
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, null)(ClientInfoPage);

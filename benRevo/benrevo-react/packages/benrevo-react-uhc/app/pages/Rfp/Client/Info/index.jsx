import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  ClientInfo,
} from '@benrevo/benrevo-react-rfp';
import { carrierName } from '../../../../config'

class ClientInfoPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  render() {
    return (
      <ClientInfo
        {...this.props}
        routes={this.props.routes}
        clearValue={false}
        carrierName={carrierName}
      />
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, null)(ClientInfoPage);

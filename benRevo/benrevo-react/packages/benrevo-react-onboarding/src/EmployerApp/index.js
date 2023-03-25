import { connect } from 'react-redux';
import { getToken, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import EmployerApplication from './EmployerApplication';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const clientId = clientsState.get('current').get('id');
  return {
    url: `${BENREVO_API_PATH}/v1/files/${ownProps.urlName}?clientId=${clientId}`,
    token: getToken(),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployerApplication);

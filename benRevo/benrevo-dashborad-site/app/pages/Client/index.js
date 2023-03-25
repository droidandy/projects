import { connect } from 'react-redux';
import Client from './Client';
import { changeAccessStatus } from './Details/actions';

function mapStateToProps(state, ownProps) {
  const clientDetailsState = state.get('clientDetails');
  const clientId = ownProps.params.clientId;

  return {
    client: clientDetailsState.get('current').toJS(),
    accessStatus: clientDetailsState.get('accessStatus'),
    clientId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeAccessStatus: (status) => { dispatch(changeAccessStatus(status)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Client);

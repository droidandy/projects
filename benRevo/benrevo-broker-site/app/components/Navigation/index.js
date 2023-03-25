import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Navigation from './Navigation';

function mapDispatchToProps(dispatch) {
  return {
    goToClient: (clientId) => { dispatch(push(`/clients/${clientId}`)); },
  };
}

export default connect(null, mapDispatchToProps)(Navigation);

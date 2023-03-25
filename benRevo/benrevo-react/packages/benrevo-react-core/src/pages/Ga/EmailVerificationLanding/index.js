import { connect } from 'react-redux';
import EmailVerificationLanding from './EmailVerificationLanding';
import { verifyAgentEmail } from '../actions';

function mapStateToProps(state) {
  const gaState = state.get('ga');
  return {
    loading: gaState.get('loading'),
    gaForm: gaState.get('form').toJS(),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    verifyAgentEmail: (verificationCode) => { dispatch(verifyAgentEmail(verificationCode)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerificationLanding);

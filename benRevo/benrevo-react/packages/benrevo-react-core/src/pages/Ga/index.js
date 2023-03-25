import { connect } from 'react-redux';
import Ga from './Ga';
// import {  } from './actions';

function mapStateToProps(state) {
  const gaState = state.get('ga');
  return {
    loading: gaState.get('loading'),
  };
}

export function mapDispatchToProps() {
  return {
    /* changeForm: (value) => {
      dispatch(changeForm(value));
    },
    formSubmit: () => {
      dispatch(formSubmit());
    },
    cancelForm: () => {
      dispatch(cancelForm());
    }, */
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ga);

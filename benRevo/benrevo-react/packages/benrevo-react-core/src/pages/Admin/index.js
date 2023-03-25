import { connect } from 'react-redux';
import Admin from './Admin';
import { changeForm, formSubmit, getConfig, cancelForm } from './actions';

function mapStateToProps(state) {
  const disclosure = state.get('adminPage');
  return {
    disclosure: disclosure.get('disclosure').toJS(),
    loading: disclosure.get('loading'),
    configLoaded: disclosure.get('configLoaded'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changeForm: (value) => {
      dispatch(changeForm(value));
    },
    formSubmit: () => {
      dispatch(formSubmit());
    },
    getConfig: () => {
      dispatch(getConfig());
    },
    cancelForm: () => {
      dispatch(cancelForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

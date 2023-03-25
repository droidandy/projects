import { connect } from 'react-redux';
import Contact from './Contact';
import { changeForm, formSubmit } from './actions';

function mapStateToProps(state) {
  const homeState = state.get('contactPage');
  return {
    form: homeState.get('form').toJS(),
    sent: homeState.get('sent'),
    loading: homeState.get('loading'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changeForm: (key, value) => {
      dispatch(changeForm(key, value));
    },
    formSubmit: () => {
      dispatch(formSubmit());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);

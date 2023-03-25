import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import OnBoardingSection from './Section';
import { changeValue, setError, deleteError, saveAnswers, changeShowDisclosure, deleteKey, getFile, changeShowErrors } from '../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[2].path;
  const page = ownProps.routes[3].path;
  const onBoardingState = state.get('onBoarding');
  const clientsState = state.get('clients');
  // console.log('section = ', section, 'page = ', page);
  return {
    section,
    page,
    client: clientsState.get('current').toJS(),
    answers: onBoardingState.get('answers').toJS(),
    errors: onBoardingState.get('errors').toJS(),
    disclosurePersons: onBoardingState.get('disclosurePersons'),
    disclosurePersonsMax: onBoardingState.get('disclosurePersonsMax'),
    showDisclosure: onBoardingState.get('showDisclosure'),
    showErrors: onBoardingState.get('showErrors'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    prevPage: (prev) => {
      dispatch(push(`/onboarding/${prev}`));
    },
    changeValue: (key, value, values) => { dispatch(changeValue(key, value, values)); },
    setError: (key, message) => { dispatch(setError(key, message)); },
    deleteError: (key) => { dispatch(deleteError(key)); },
    deleteKey: (key) => { dispatch(deleteKey(key)); },
    changeShowDisclosure: (show) => { dispatch(changeShowDisclosure(show)); },
    saveAnswers: () => { dispatch(saveAnswers()); },
    getFile: (fileName) => { dispatch(getFile(fileName)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnBoardingSection);

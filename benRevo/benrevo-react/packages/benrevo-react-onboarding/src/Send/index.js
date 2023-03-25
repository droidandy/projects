import { connect } from 'react-redux';
import Send from './Send';
import { saveAnswers, getQuestionnaire, setError, deleteError, changeShowErrors } from '../actions';

function mapStateToProps(state) {
  const onBoardingState = state.get('onBoarding');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    loading: onBoardingState.get('loading'),
    sent: onBoardingState.get('sent'),
    requestError: onBoardingState.get('requestError'),
    submittedDate: onBoardingState.get('submittedDate'),
    answers: onBoardingState.get('answers').toJS(),
    showDisclosure: onBoardingState.get('showDisclosure'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getQuestionnaire: () => { dispatch(getQuestionnaire()); },
    saveAnswers: (page) => { dispatch(saveAnswers(page)); },
    setError: (key, message) => { dispatch(setError(key, message)); },
    deleteError: (key) => { dispatch(deleteError(key)); },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Send);

import { connect } from 'react-redux';
import History from './History';
import { getHistory } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  return {
    history: overviewState.get('history').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHistory: () => { dispatch(getHistory()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(History);

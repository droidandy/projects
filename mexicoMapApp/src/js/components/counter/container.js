/**
 * Created by developercomputer on 11.12.15.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from './counter.js';
import * as CounterActions from "./../../actions/counter.js";

const mapStateToProps = (state) => {
  return {
    counter: state.counter
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(CounterActions, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

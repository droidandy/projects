import { connect } from 'react-redux';
import Compare from './Compare';
import { getCompare, optionsSelect, compareFile } from '../actions';

function mapStateToProps(state, ownProps) {
  const compareState = state.get('presentation').get(ownProps.section);
  return {
    loading: compareState.get('loading'),
    compareOptions: compareState.get('compareOptions').toJS(),
    selected: compareState.get('selected'),
    load: compareState.get('load').get('compare'),
    readonly: state.get('presentation').get('quote').get('readonly'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCompare: (section) => { dispatch(getCompare(section)); },
    compareFile: (section) => { dispatch(compareFile(section)); },
    optionsSelect: (section, id) => { dispatch(optionsSelect(section, id)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);

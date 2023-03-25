import { connect } from 'react-redux';
import Rewards from './Rewards';
import { changeFilter, getRewards, changeSort } from './actions';
import { sortData } from './selectors';

function mapStateToProps(state) {
  const clientsState = state.get('rewards');
  return {
    loading: clientsState.get('loading'),
    rewards: sortData(state),
    sort: clientsState.get('sort').toJS(),
    filters: clientsState.get('filters').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFilter: (type, value) => { dispatch(changeFilter(type, value)); },
    getRewards: () => { dispatch(getRewards()); },
    changeSort: (prop, order) => { dispatch(changeSort(prop, order)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rewards);

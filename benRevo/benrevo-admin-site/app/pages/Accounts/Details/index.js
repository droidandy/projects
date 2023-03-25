import { connect } from 'react-redux';
import Details from './Details';
import { changeField, changeInfo, cancelChangeInfo, saveInfo, approve, updateBCC } from '../actions';
import { selectGaList, selectBrokerageList, selectBrokerage, selectGa, selectSalesList, selectPresalesList } from '../selectors';

function mapStateToProps(state) {
  const accountsPageState = state.get('accountsPage');
  const overviewState = state.get('base');

  return {
    loading: accountsPageState.get('loading'),
    isExistingGA: accountsPageState.get('isExistingGA'),
    isExistingBrokerage: accountsPageState.get('isExistingBrokerage'),
    current: accountsPageState.get('currentOriginal').toJS(),
    editingCurrent: accountsPageState.get('current').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    bccEmail: accountsPageState.get('bccEmail'),
    ga: selectGaList(state),
    presales: selectPresalesList(state),
    sales: selectSalesList(state),
    brokerages: selectBrokerageList(state),
    selectedGA: selectGa(state),
    selectedBrokerage: selectBrokerage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeField: (key, value) => { dispatch(changeField(key, value)); },
    changeInfo: (key, value) => { dispatch(changeInfo(key, value)); },
    cancelChangeInfo: () => { dispatch(cancelChangeInfo()); },
    saveInfo: () => { dispatch(saveInfo()); },
    approve: () => { dispatch(approve()); },
    updateBCC: (text) => { dispatch(updateBCC(text)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);

import { connect } from 'react-redux';
import Brokerage from './Brokerage';
import { changeBrokerage, updateBrokerage, saveBrokerage } from '../actions';
import { selectBrokerageList, selectSalesList, selectPreSalesList } from '../selectors';

function mapStateToProps(state) {
  const salesState = state.get('sales');
  return {
    loading: salesState.get('loading'),
    saving: salesState.get('saving'),
    brokerage: salesState.get('brokerage').toJS(),
    brokerages: selectBrokerageList(state),
    sales: selectSalesList(state),
    presales: selectPreSalesList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveBrokerage: () => { dispatch(saveBrokerage()); },
    changeBrokerage: (brokerage) => { dispatch(changeBrokerage(brokerage)); },
    updateBrokerage: (type, value) => { dispatch(updateBrokerage(type, value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Brokerage);

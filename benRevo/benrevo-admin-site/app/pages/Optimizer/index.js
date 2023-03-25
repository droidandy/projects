import { connect } from 'react-redux';
import { loadOptimizer, validateOptimizer, gaGets, brokerageGets, changeField, changeAddress, changeProduct, updateBCC, changeEditing, changeRenewal } from './actions';
import Optimizer from './Optimizer';
import { selectGaList, selectBrokerageList } from './selectors';

function mapStateToProps(state) {
  const optimizerState = state.get('optimizerPage');
  const overviewState = state.get('base');
  return {
    loading: optimizerState.get('loading'),
    loaded: optimizerState.get('loaded'),
    editing: optimizerState.get('editing'),
    selectedBrokerage: optimizerState.get('selectedBrokerage').toJS(),
    selectedGA: optimizerState.get('selectedGA'),
    overrideClient: optimizerState.get('overrideClient'),
    newClientName: optimizerState.get('newClientName'),
    addressInfo: optimizerState.get('addressInfo').toJS(),
    errors: optimizerState.get('errors').toJS(),
    products: optimizerState.get('products').toJS(),
    existingProducts: optimizerState.get('existingProducts').toJS(),
    brokerage: optimizerState.get('brokerage').toJS(),
    gaBrokerage: optimizerState.get('gaBrokerage').toJS(),
    client: optimizerState.get('client').toJS(),
    bccEmail: optimizerState.get('bccEmail'),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    renewals: optimizerState.get('renewals').toJS(),
    ga: selectGaList(state),
    brokerages: selectBrokerageList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadOptimizer: (file, add) => { dispatch(loadOptimizer(file, add)); },
    validateOptimizer: (file) => { dispatch(validateOptimizer(file)); },
    gaGets: () => { dispatch(gaGets()); },
    changeProduct: (product, value) => { dispatch(changeProduct(product, value)); },
    changeRenewal: (product, value) => { dispatch(changeRenewal(product, value)); },
    changeField: (key, value) => { dispatch(changeField(key, value)); },
    changeAddress: (key, value) => { dispatch(changeAddress(key, value)); },
    brokerageGets: () => { dispatch(brokerageGets()); },
    updateBCC: (text) => { dispatch(updateBCC(text)); },
    changeEditing: (value) => { dispatch(changeEditing(value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Optimizer);

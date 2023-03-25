import { connect } from 'react-redux';
import {
  getPresentationOptions,
  createAlternative,
  getOptions,
  updateAlternativeOption,
  deleteAlternative,
  deleteAlternativeOption,
  addDiscount,
  removeDiscount,
  updateDiscount,
} from '../actions';
import Setup from './Setup';

function mapStateToProps(state) {
  const setupPresentationState = state.get('setupPresentation');
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    currentTotal: setupPresentationState.get('currentTotal'),
    renewalTotal: setupPresentationState.get('renewalTotal'),
    renewalPercentage: setupPresentationState.get('renewalPercentage'),
    options: setupPresentationState.get('options').toJS(),
    currents: setupPresentationState.get('currents').toJS(),
    renewals: setupPresentationState.get('renewals').toJS(),
    alternatives: setupPresentationState.get('alternatives').toJS(),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    getPresentationOptions: () => { dispatch(getPresentationOptions()); },
    createAlternative: () => { dispatch(createAlternative()); },
    updateAlternativeOption: (presentationOptionId, product, rfpQuoteOptionId) => { dispatch(updateAlternativeOption(presentationOptionId, product, rfpQuoteOptionId)); },
    deleteAlternative: (presentationOptionId, index) => { dispatch(deleteAlternative(presentationOptionId, index)); },
    deleteAlternativeOption: (presentationOptionId, product, rfpQuoteOptionId) => { dispatch(deleteAlternativeOption(presentationOptionId, product, rfpQuoteOptionId)); },
    addDiscount: (index) => { dispatch(addDiscount(index)); },
    removeDiscount: (index) => { dispatch(removeDiscount(index)); },
    updateDiscount: (discountIndex, index, type, value) => { dispatch(updateDiscount(discountIndex, index, type, value)); },
    getOptions: (section) => { dispatch(getOptions(section)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Setup);

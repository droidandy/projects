import { connect } from 'react-redux';
import FinalPresentation from './FinalPresentation';
import { optionsUnSelect, submitFinal, changeExternalProducts } from '../actions';

function mapStateToProps(state) {
  const presentationState = state.get('presentation');
  const clients = state.get('clients');
  return {
    client: clients.get('current').toJS(),
    medical: presentationState.get('medical').toJS(),
    dental: presentationState.get('dental').toJS(),
    vision: presentationState.get('vision').toJS(),
    totalAll: presentationState.get('final').get('totalAll'),
    discount: {
      dentalBundleDiscount: presentationState.get('final').get('dentalBundleDiscount'),
      dentalBundleDiscountPercent: presentationState.get('final').get('dentalBundleDiscountPercent'),
      visionBundleDiscount: presentationState.get('final').get('visionBundleDiscount'),
      visionBundleDiscountPercent: presentationState.get('final').get('visionBundleDiscountPercent'),
      subTotalAnnualCost: presentationState.get('final').get('subTotalAnnualCost'),
      summaryBundleDiscount: presentationState.get('final').get('summaryBundleDiscount'),
      medicalWithoutKaiserTotal: presentationState.get('final').get('medicalWithoutKaiserTotal'),
      dentalRenewalDiscountPenalty: presentationState.get('final').get('dentalRenewalDiscountPenalty'),
      visionRenewalDiscountPenalty: presentationState.get('final').get('visionRenewalDiscountPenalty'),
    },
    loading: presentationState.get('final').get('loading'),
    submittedDate: presentationState.get('final').get('submittedDate'),
    externalProducts: presentationState.get('final').get('externalProducts').toJS(),
    extendedBundleDiscount: presentationState.get('final').get('extendedBundleDiscount').toJS(),
    load: presentationState.get('final').get('load').get('final'),
    showSubmitSuccess: presentationState.get('final').get('showSubmitSuccess'),
    readonly: state.get('presentation').get('quote').get('readonly'),
    showErr: presentationState.get('final').get('showErr'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    optionsUnSelect: (section, id) => { dispatch(optionsUnSelect(section, id)); },
    changeExternalProducts: (type, value) => { dispatch(changeExternalProducts(type, value)); },
    submit: () => { dispatch(submitFinal()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalPresentation);

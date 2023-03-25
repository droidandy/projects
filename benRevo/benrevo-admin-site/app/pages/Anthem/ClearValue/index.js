import { connect } from 'react-redux';
import { changeClearValue, clearValueCalculate } from './actions';
import ClearValue from './ClearValue';

function mapStateToProps(state) {
  const clearValuePageState = state.get('clearValuePage');
  return {
    calculated: clearValuePageState.get('calculated').toJS(),
    ratingTiers: clearValuePageState.get('ratingTiers'),
    medicalPaymentMethod: clearValuePageState.get('medicalPaymentMethod'),
    dentalPaymentMethod: clearValuePageState.get('dentalPaymentMethod'),
    commission: clearValuePageState.get('commission'),
    dentalCommission: clearValuePageState.get('dentalCommission'),
    turnOnMedical1Percent: clearValuePageState.get('turnOnMedical1Percent'),
    sicCode: clearValuePageState.get('sicCode'),
    averageAge: clearValuePageState.get('averageAge'),
    predominantCounty: clearValuePageState.get('predominantCounty'),
    effectiveDate: clearValuePageState.get('effectiveDate'),
    error: clearValuePageState.get('error'),
    loading: clearValuePageState.get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeClearValue: (key, value) => { dispatch(changeClearValue(key, value)); },
    clearValueCalculate: () => { dispatch(clearValueCalculate()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearValue);

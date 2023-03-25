import { connect } from 'react-redux';
import UploadPlanDesign from './UploadPlanDesign';
import { uploadPlan, getChanges, changeYear } from '../actions';
import { changeCarrier } from '../../Client/actions';

function mapStateToProps(state) {
  const overviewState = state.get('base');
  const planDesignState = state.get('planDesign');
  return {
    carriers: overviewState.get('carriers').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    loading: planDesignState.get('loading'),
    uploadLoading: planDesignState.get('uploadLoading'),
    fileName: planDesignState.get('fileName'),
    inputYear: planDesignState.get('inputYear'),
    changes: planDesignState.get('changes').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getChanges: (carrier, file) => { dispatch(getChanges(carrier, file)); },
    changeCarrier: (carrier) => { dispatch(changeCarrier(carrier)); },
    changeYear: (year) => { dispatch(changeYear(year)); },
    uploadPlan: (carrier, file) => { dispatch(uploadPlan(carrier, file)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadPlanDesign);

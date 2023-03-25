import { connect } from 'react-redux';
import ViewPlanDesign from './ViewPlanDesign';
import { changeCarrier } from '../../Client/actions';
import { getPlanDesign, getPlanTypes, changeYear, changePlanType } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('base');
  const planDesignState = state.get('planDesign');
  return {
    carriers: overviewState.get('carriers').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    loading: planDesignState.get('loading'),
    viewLoading: planDesignState.get('viewLoading'),
    inputYear: planDesignState.get('inputYear'),
    planType: planDesignState.get('planType'),
    planTypeList: planDesignState.get('planTypeList').toJS(),
    planDesignData: planDesignState.get('planDesignData').toJS(),
    benefitNames: planDesignState.get('benefitNames').toJS(),
    viewProgress: planDesignState.get('viewProgress'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCarrier: (carrier) => { dispatch(changeCarrier(carrier)); },
    getPlanDesign: (carrier, year, planType) => { dispatch(getPlanDesign(carrier, year, planType)); },
    getPlanTypes: (carrier, year, planType) => { dispatch(getPlanTypes(carrier, year, planType)); },
    changeYear: (year) => { dispatch(changeYear(year)); },
    changePlanType: (type) => { dispatch(changePlanType(type)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPlanDesign);

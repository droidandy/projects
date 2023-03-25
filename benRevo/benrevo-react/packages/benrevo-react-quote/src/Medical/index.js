import { connect } from 'react-redux';
import MedicalPresentation from './MedicalPresentation';
import { changeCurrentPage } from '../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const overviewState = state.get('presentation').get(section);
  return {
    section,
    page: overviewState.get('page').toJS(),
    medicalPage: overviewState.get('page').toJS(),
    carrierList: overviewState.get('carrierList').toJS(),
    mainCarrier: overviewState.get('mainCarrier').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicalPresentation);

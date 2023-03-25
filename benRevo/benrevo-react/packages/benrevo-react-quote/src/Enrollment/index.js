import { connect } from 'react-redux';
import Enrollment from './Enrollment';
import { getEnrollment, changeEnrollment, cancelEnrollment, editEnrollment, saveEnrollment } from '../actions';

function mapStateToProps(state) {
  const medical = state.get('presentation').get('medical');
  const dental = state.get('presentation').get('dental');
  const vision = state.get('presentation').get('vision');
  const clientsState = state.get('clients').get('current');
  const enrollmentState = state.get('presentation').get('enrollment');
  return {
    medicalEnrollment: medical.get('enrollment').toJS(),
    virginList: clientsState.get('virginCoverage').toJS(),
    dentalEnrollment: dental.get('enrollment').toJS(),
    visionEnrollment: vision.get('enrollment').toJS(),
    medicalEdit: medical.get('enrollmentEdit'),
    dentalEdit: dental.get('enrollmentEdit'),
    visionEdit: vision.get('enrollmentEdit'),
    load: enrollmentState.get('load').get('enrollment'),
    loading: enrollmentState.get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEnrollment: () => { dispatch(getEnrollment()); },
    cancelEnrollment: (section) => { dispatch(cancelEnrollment(section)); },
    saveEnrollment: (section) => { dispatch(saveEnrollment(section)); },
    editEnrollment: (section, edit) => { dispatch(editEnrollment(section, edit)); },
    changeEnrollment: (section, column, index, value) => { dispatch(changeEnrollment(section, column, index, value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Enrollment);

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TeamMembers from './TeamMembers';
import { getTeamMembers, updateTeam, saveTeam } from './actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.fromRfp ? '/rfp/enrollment/medical' : '/clients';
  const members = state.get('team').get('members');
  const client = state.get('clients').get('current').get('clientName');

  return {
    members,
    client,
    section,
    loading: state.get('team').get('loading'),
    hasError: state.get('team').get('hasError'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateTeam: (member) => { dispatch(updateTeam(member)); },
    continue: (fromRfp) => { dispatch(saveTeam(fromRfp)); },
    fetchTeamMembers: () => { dispatch(getTeamMembers()); },
    changePage: (page) => {
      dispatch(push(`${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamMembers);


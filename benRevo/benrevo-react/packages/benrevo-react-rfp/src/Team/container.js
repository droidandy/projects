import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { saveTeam, updateTeam, getTeamMembers } from '@benrevo/benrevo-react-core';
import TMems from './TMems';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[2].path;
  const members = state.get('team').get('members');
  const clientsState = state.get('clients');

  return {
    members,
    section,
    loading: state.get('team').get('loading'),
    hasError: state.get('team').get('hasError'),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    prefix: ownProps.prefix,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateTeam: (member) => { dispatch(updateTeam(member)); },
    continue: (fromRfp, prefix) => { dispatch(saveTeam(fromRfp, prefix)); },
    fetchTeamMembers: () => { dispatch(getTeamMembers()); },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/rfp/${page}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TMems);

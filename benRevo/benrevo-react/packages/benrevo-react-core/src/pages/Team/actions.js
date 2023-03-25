import { FETCH_TEAM_MEMBERS, UPDATE_TEAM, SAVE_TEAM_MEMBERS } from './constants';

export function getTeamMembers() {
  return {
    type: FETCH_TEAM_MEMBERS,
  };
}

export function saveTeam(fromRfp, prefix) {
  return {
    type: SAVE_TEAM_MEMBERS,
    payload: { fromRfp, prefix },
  };
}

export function updateTeam(member) {
  return {
    type: UPDATE_TEAM,
    payload: {
      member,
    },
  };
}

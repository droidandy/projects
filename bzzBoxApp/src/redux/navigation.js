/**
 * Created by developercomputer on 06.10.16.
 */
export const NAV = 'NAV';

const initialState = {
  pageName: '',
  hackCounter: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NAV:
      return {
        pageName: action.payload.pageName,
        hackCounter: state.hackCounter + 1
      };
    default:
      return state;
  }
};

import { composeReducer } from 'redux-compose-reducer';

import { AVAILABLE_MAP_SCENES } from 'actions/ui/navigation';

const initialState = {
  activeScene: AVAILABLE_MAP_SCENES.orderCreating,
  previousState: null
};

const changeMapScene = (state, { activeScene }) => ({ ...state, activeScene });

const clearNavigation = () => initialState;

export default composeReducer(
  'ui/navigation',
  {
    changeMapScene,
    clearNavigation
  },
  initialState
);

import { createSelector } from 'reselect';
import { TIMELINE_IS_ENABLED } from '@benrevo/benrevo-react-clients';

const selectCurrentClient = () => (state) => state.get('clients').get('current');

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }
    return substate.toJS();
  }
);

const selectTimelineIsEnabled = createSelector(
  selectCurrentClient(),
  (substate) => checkTimelineIsEnabled(substate.toJS())
);

const checkTimelineIsEnabled = (client) => {
  let timelineIsEnabled = false;
  if (!client.id) {
    return timelineIsEnabled;
  }
  for (let i = 0; i < client.attributes.length; i += 1) {
    if (client.attributes[i] === TIMELINE_IS_ENABLED) {
      timelineIsEnabled = true;
      break;
    }
  }

  return timelineIsEnabled;
};

export {
  selectClient,
  selectCurrentClient,
  selectTimelineIsEnabled,
};

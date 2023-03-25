import { ResourceActions, ResourceState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ResourceState = {
  name: 'resource',
  parentRequired: false,
};

handle
  .reducer(initialState)
  .on(ResourceActions.setOptions, (state, { options }) => {
    Object.assign(state, options);
  });

// --- Module ---
export const useResource = () => handle();

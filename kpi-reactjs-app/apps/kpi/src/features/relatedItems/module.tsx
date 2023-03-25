import * as Rx from 'src/rx';
import { RelatedItemsActions, RelatedItemsState, handle } from './interface';
import { getRelatedItems } from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle.epic().on(RelatedItemsActions.show, ({ type, id }) => {
  return getRelatedItems(type, id).pipe(
    Rx.map(ret => RelatedItemsActions.loaded(ret)),
    catchErrorAndShowModal()
  );
});

// --- Reducer ---
const initialState: RelatedItemsState = {
  type: null!,
  id: null!,
  items: [],
  isLoaded: false,
};

handle
  .reducer(initialState)
  .on(RelatedItemsActions.show, (state, { type, id }) => {
    state.type = type;
    state.id = id;
    state.items = [];
    state.isLoaded = false;
  })
  .on(RelatedItemsActions.loaded, (state, { items }) => {
    state.isLoaded = true;
    state.items = items;
  })
  .on(RelatedItemsActions.created, (state, { item }) => {
    state.items.push(item);
  });

// --- Module ---
export const useRelatedItemsModule = () => handle();

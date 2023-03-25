import { Reducer, useReducer, useMemo, useRef } from 'react';
import _map from 'lodash/map';
import update, { Spec } from 'immutability-helper';

type Flatten<T> = T extends any[] ? T[number] : T;

export interface CollectionItem {
  id: string;
}

export interface CollectionActions<T extends CollectionItem = CollectionItem> {
  add: { items: T[]; skipIdentical?: boolean };
  updateBatch: { items: (Partial<T> & { id: string })[] };
  update: { id: string; props: Partial<T> };
  move: { id: string; atIndex: number };
  remove: { id: string };
}
export type CollectionAction<S extends any[]> = {
  [K in keyof CollectionActions as number]: { type: `${K}`; payload: CollectionActions<Flatten<S>>[K] };
}[number];

export type CollectionMethod<S extends any[]> = {
  [K in keyof CollectionActions]: <T extends CollectionItem>(
    payload: CollectionActions<Flatten<S>>[K],
  ) => (currentState: S) => S;
};
const isCollectionAction = <T extends CollectionItem[]>(action: any): action is CollectionAction<T> =>
  typeof action === 'object' && action.hasOwnProperty('type');

function applyActions<T extends CollectionItem, A extends any = any, S extends T[] = T[]>(
  reducer: Reducer<S, A>,
): (actions: CollectionMethod<S>) => (state: S, action: A | CollectionAction<S>) => S {
  return (actions) => {
    return (state, action) => {
      // todo check type value
      if (isCollectionAction<S>(action)) {
        const nextState = actions[action.type](action.payload as any)(state);
        return nextState;
      }
      return reducer(state, action);
    };
  };
}
interface CollectionStateApi<T extends {}> {
  items: T[];
  findBy<K extends keyof T>(key: K, value: T[K]): T[];
  findIndex(id: string): number;
}

export const useCollectionStateApi = <T extends CollectionItem>(items: T[]): CollectionStateApi<T> => {
  const thisRef: { current: CollectionStateApi<T> } = useRef({
    items: items,
    findBy(key, value) {
      return thisRef.current.items.filter((item) => item[key] === value);
    },
    findIndex(id) {
      return thisRef.current.items.findIndex((item) => item.id === id);
    },
  });
  thisRef.current.items = items;
  return thisRef.current;
};

export const useReducerCollection = <T extends CollectionItem, E extends any = any>(
  initialState: T[],
  external?: E,
) => {
  const reducer = useMemo(
    () =>
      applyActions<T, { type: 'skip' } | { type: 'reset' }>((state, action) => {
        switch (action.type) {
          case 'reset':
            return initialState;
          default:
            return state;
        }
      })({
        add:
          ({ items, skipIdentical = true }) =>
          (state) => {
            const alreadyExists = _map(state, 'id');
            return update(state, {
              $push: skipIdentical ? items.filter((f) => !alreadyExists.includes(f.id)) : items,
            });
          },
        updateBatch:
          ({ items }) =>
          (state) => {
            return update(
              state,
              items.reduce((r, { id, ...item }) => {
                const index = state.findIndex((i) => i.id === id).toString();
                return { ...r, [index]: { $merge: item } };
              }, {}),
            );
          },
        update:
          ({ id, props }) =>
          (state) => {
            const index = state.findIndex((i) => i.id === id).toString();
            return update(state, { [index]: { $merge: props } as Spec<typeof state[number]> });
          },
        move:
          ({ id, atIndex }) =>
          (state) => {
            const index = state.findIndex((i) => i.id === id);
            const item = state[index];
            return update(state, {
              $splice: [
                [index, 1],
                [atIndex, 0, item],
              ],
            });
          },
        remove:
          ({ id }) =>
          (state) => {
            const index = state.findIndex((i) => i.id === id);
            return update(state, { $splice: [[index, 1]] });
          },
      }),
    [],
  );

  return useReducer(reducer, initialState);
};

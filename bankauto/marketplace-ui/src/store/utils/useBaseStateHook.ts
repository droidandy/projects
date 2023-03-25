import { useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { StateModel } from 'store/types';
import { ActionRecord, AsyncDispatch } from 'types/AsyncAction';
import { getDispatchedActions, DispatchedActions } from './dispatchedActions';

type ProxyItem<T> = T extends {} ? T : never;

type Selector<TState, TSelected> = (state: TState) => TSelected;

export const useStateSelectorObject = <S extends {}, V extends {}>(selector: Selector<S, V>): V => {
  const stateKeys = useRef<(keyof V)[]>([]);
  const equalFunction = (left: V, right: V): boolean => {
    if (stateKeys.current.length) {
      const l = pick(left, stateKeys.current);
      const r = pick(right, stateKeys.current);
      return isEqual(l, r);
    }
    return isEqual(left, right);
  };
  const stateItem = useSelector<S, V>((stateModel) => selector(stateModel), equalFunction);

  return useMemo<V>(
    () =>
      new Proxy<V>(stateItem, {
        get(target, name) {
          if (!stateKeys.current.includes(name as never as keyof V)) {
            stateKeys.current.push(name as never as keyof V);
          }
          return target[name as never as keyof V];
        },
      }),
    [stateItem],
  );
};

export const useStateSelector = <T extends {}, K extends keyof T>(key: K, sleep?: boolean, debug?: any): T[K] => {
  const stateKeys = useRef<(string | number | symbol)[]>([]);
  const equalFunction = (left: T[K], right: T[K]): boolean => {
    if (typeof left === 'object' && stateKeys.current.length) {
      const l = pick(left, stateKeys.current);
      const r = pick(right, stateKeys.current);
      const equal = isEqual(l, r);
      if (debug && !equal) {
        console.log('State equal debug', debug, stateKeys.current, l, r, equal);
      }
      return equal;
    }

    return sleep ? true : isEqual(left, right);
  };
  const stateItem = useSelector<T, T[K]>((stateModel) => stateModel[key], equalFunction);

  return useMemo<T[K]>(() => {
    return typeof stateItem === 'object'
      ? new Proxy<ProxyItem<T[K]>>(stateItem, {
          get(target, name) {
            if (!stateKeys.current.includes(name)) {
              stateKeys.current.push(name);
            }
            return target[name as never as keyof T[K]];
          },
        })
      : stateItem;
  }, [stateItem]);
};

type UseStateModel<S extends {} = Object> = <K extends keyof S, R extends ActionRecord, A extends ActionRecord>(
  state: K,
  reducers: R,
  actions: A,
  debug?: any,
) => { state: S[K] } & DispatchedActions<R> & DispatchedActions<A>;

export const useStateModel: UseStateModel<StateModel> = <
  K extends keyof StateModel,
  R extends ActionRecord,
  A extends ActionRecord,
>(
  selector: K,
  reducers: R,
  actions: A,
  debug: any,
) => {
  const stateIsUsed = useRef<boolean>(false);
  const dispatch = useDispatch<AsyncDispatch>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchedActions = useMemo(() => getDispatchedActions(dispatch, actions), [dispatch]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchedReducers = useMemo(() => getDispatchedActions(dispatch, reducers), [dispatch]);
  const state = useStateSelector<StateModel, K>(selector, !stateIsUsed.current, debug);
  const stateProxy = useMemo<StateModel[K]>(
    () =>
      new Proxy<ProxyItem<StateModel[K]>>(state, {
        get(target, name) {
          if (!stateIsUsed.current) {
            stateIsUsed.current = true;
          }
          return target[name as never as keyof StateModel[K]];
        },
      }),
    [state],
  );
  return {
    state: stateProxy,
    ...dispatchedActions,
    ...dispatchedReducers,
  };
};

type UseStateBase<S extends {} = Object> = <K extends keyof S, R extends ActionRecord, A extends ActionRecord>(
  state: K,
  reducers: R,
  actions: A,
) => S[K] & DispatchedActions<R> & DispatchedActions<A>;

export const useStateBase: UseStateBase<StateModel> = <
  K extends keyof StateModel,
  R extends ActionRecord,
  A extends ActionRecord,
>(
  selector: K,
  reducers: R,
  actions: A,
) => {
  const dispatch = useDispatch<AsyncDispatch>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchedReducers = useMemo(() => getDispatchedActions(dispatch, reducers), [dispatch]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatchedActions = useMemo(() => getDispatchedActions(dispatch, actions), [dispatch]);
  const state = useSelector<StateModel, StateModel[K]>((stateModel) => stateModel[selector], isEqual);
  return {
    ...state,
    ...dispatchedReducers,
    ...dispatchedActions,
  };
};

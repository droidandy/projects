import { Action } from 'redux';
import { AsyncDispatch, AsyncActionContainer, ActionCase, ActionContainer } from 'types/AsyncAction';

export type DispatchedActions<T extends Record<string, ActionCase>> = {
  [K in keyof T]: T[K] extends AsyncActionContainer
    ? (...a: Parameters<T[K]>) => ReturnType<T[K]> extends (...args: any[]) => infer R ? R : ReturnType<T[K]>
    : T[K] extends ActionContainer
    ? (...a: Parameters<T[K]>) => ReturnType<T[K]>
    : T[K];
};

type GetDispatchedActions = <T extends Record<string, ActionCase>>(
  dispatch: AsyncDispatch,
  actions: T,
) => DispatchedActions<T>;

export const getDispatchedActions: GetDispatchedActions = (dispatch, actions) => {
  return Object.keys(actions).reduce((result, key) => {
    const action = actions[key as keyof typeof actions];
    if (typeof action === 'function') {
      const callableAction = action as AsyncActionContainer;
      return {
        ...result,
        [key]: (...a: Parameters<typeof callableAction>) => dispatch(callableAction(...a)),
      };
    }
    const typedAction = action as Action<string>;
    return {
      ...result,
      [key]: dispatch(typedAction),
    };
  }, {} as DispatchedActions<typeof actions>);
};

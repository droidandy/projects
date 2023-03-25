import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { StateModel, DispatchType, ReduxExtraArgument } from 'store/types';

export type AsyncDispatch = DispatchType;

export type AsyncAction<ReturnType extends any = void> = ThunkAction<
  ReturnType,
  StateModel,
  ReduxExtraArgument,
  Action<string>
>;

export type AsyncActionContainer = <A extends any[]>(...a: A & any) => AsyncAction<unknown>;

export type ActionContainer = <T extends any[]>(action: T & any) => Action<unknown>;

export type ActionCase = AsyncActionContainer | ActionContainer | Action<string>;

export type ActionRecord = Record<string, ActionCase>;

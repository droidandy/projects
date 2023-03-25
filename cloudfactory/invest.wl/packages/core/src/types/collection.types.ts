import { TObject } from './base.types';

export interface IObjectItem<V, K = string> {
  key: K;
  value: V;
}

export interface ISelectItem<V = any> {
  name: string;
  value?: V;
}

export enum EDSortDirection {
  Asc = 'asc',
  Desc = 'desc',
  // TODO: remove?
  None = 'none',
}

export interface IDSortResult<T extends TObject> {
  field: keyof T;
  direction: EDSortDirection;
}

import { EDSortDirection, TObject } from '@invest.wl/core';
import { IDModelXValue } from '../../ModelX/ModelX.types';

// TODO: need add Array (Object too?)
export enum EDSortXType {
  String = 'string',
  Number = 'number',
  Date = 'Date',
  Boolean = 'boolean',
}

export type TDSortXTypeMapper<T extends TDSortXType> = T extends Date ? EDSortXType.Date : T extends number
  ? EDSortXType.Number : T extends boolean ? EDSortXType.Boolean : EDSortXType.String;

export type TDSortXType = Date | number | string | boolean;

export interface IDSortXItem<T extends TDSortXType> {
  isActive: boolean;
  readonly type: EDSortXType;
  readonly isEmpty: boolean;
  config?: IDSortXConfigModel<T>;
  clear(): void;
  clone(): IDSortXModel<T>;
  sort(a: T, b: T): number;
}

export interface IDSortXProps {
  single?: boolean;
}

export interface IDSortXModel<T extends TDSortXType> extends IDSortXItem<T>, IDModelXValue<EDSortDirection | undefined> {
}

export type IDSortXMap<I extends TObject> = {
  [K in keyof I]: IDSortXModel<I[K]>;
};

export interface IDSortXConfigItem<T extends TDSortXType, E extends EDSortXType = TDSortXTypeMapper<T>> {
  type: E;
}

export type IDSortXConfigItemMap<I extends TObject> = {
  [K in keyof I]: IDSortXConfigItem<I[K]>;
};

export interface IDSortXConfigModel<T extends TDSortXType> extends IDSortXConfigItem<T> {
  list: EDSortDirection[];
}

export type IDSortXConfigMap<I extends TObject> = {
  [K in keyof I]: IDSortXConfigModel<I[K]>;
};


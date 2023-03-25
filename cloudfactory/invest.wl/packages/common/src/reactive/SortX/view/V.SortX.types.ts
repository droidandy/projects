import { EDSortDirection, ISelectItem, TObject } from '@invest.wl/core';
import { IVModalModel } from '../../../model/Modal/V.Modal.types';
import { IVModelXValue } from '../../ModelX/ModelX.types';
import { IDSortXConfigModel, IDSortXModel, TDSortXType } from '../domain/D.SortX.types';

export interface IVSortXItem<T extends TDSortXType> {
  readonly display?: string;
  config: IVSortXConfigModel<T>;
}

export interface IVSortXModel<T extends TDSortXType>
  extends IVModelXValue<IDSortXModel<T>>, IVSortXItem<T> {
}

// list Sort
export interface IVSortXProps {
  applyOnChange?: boolean;
  // TODO: make IT. in src(?)
  // сортировка ТОЛЬКО по одному свойству за раз
  single?: boolean;
}

export type IVSortXMap<I extends TObject> = {
  [K in keyof I]: IVSortXModel<I[K]>
};

// config
export type IVSortXConfigItemMap<I extends TObject> = {
  [K in keyof I]: IVSortXConfigItem;
};

export interface IVSortXConfigItem {
  title?: string;
  // скрытые, управляются не из view слоя
  hidden?: boolean;
}

export interface IVSortXConfigModel<T extends TDSortXType>
  extends IVSortXConfigItem {
  domain: IDSortXConfigModel<T>;
  list: ISelectItem<EDSortDirection>[];
}

export type IVSortXConfigMap<I extends TObject> = {
  [K in keyof I]: IVSortXConfigModel<I[K]>
};

// Sort modal
export type VSortXModalMap<I extends TObject> = {
  [K in keyof I]: IVModalModel<IVSortXModalContext<I, K>>
};

export interface IVSortXModalContext<I extends TObject, K extends keyof I> {
  model: IVSortXModel<I[K]>;
  key: K;
}

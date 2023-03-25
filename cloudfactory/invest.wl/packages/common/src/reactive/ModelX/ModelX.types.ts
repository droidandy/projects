import { TModelId } from '@invest.wl/core';
import { ILambda } from '../LambdaX';

export type TModelFieldValue = string | number | boolean | Date | undefined | any;

export interface TModelDTO {
  [key: string]: TModelFieldValue | TModelDTO | (TModelFieldValue | TModelDTO)[];
};

export interface IModelBase {
  id: TModelId | { toString(): string };
}

export interface IModelXValueBase<V> {
  lvSet(dtoLv: ILambda<V>): void;
}

export interface IModelXBase<DTO> extends IModelXValueBase<DTO>, IModelBase {
}

export interface IDModelXValue<DTO> extends IModelXValueBase<DTO> {
  readonly dto: DTO;
  readonly isLambda: boolean;
  // @deprecated - использовать lvSet()
  dtoSet(dtoLv: ILambda<DTO>): void;
}

export interface IDModelX<DTO> extends IDModelXValue<DTO>, IModelBase {
}

export interface IVModelXValue<V extends IDModelXValue<any>> extends IModelXValueBase<V> {
  readonly domain: V;
  // @deprecated - использовать lvSet()
  domainSet(domain: ILambda<V>): void;
}

export interface IVModelX<M extends IDModelX<any>> extends IVModelXValue<M> {
  readonly id: TModelId;
}

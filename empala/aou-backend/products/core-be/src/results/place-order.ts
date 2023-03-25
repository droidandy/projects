import {
  createUnionType, Field, Float, ObjectType,
} from 'type-graphql';
import { OrderError } from '../errors/order-error';
import { TPSPDataFetchError } from '../errors/tpsp-data-fetch-error';
import { OrderId } from '../models/order';

@ObjectType()
export class OrderPreviewSuccess {
  @Field(() => Float, { description: 'The number of shares that are expected to be executed if the previewed order is placed.' })
  public expectedQuantity: number;

  @Field(() => Float, { description: 'The fill price that is expected if the previewed order is placed.' })
  public expectedPrice: number;
}

@ObjectType()
export class OrderPlacementSuccess {
  @Field(() => OrderId, { description: 'ID of the order that was placed, can be used to get the status of the order.' })
  public orderId: string;
}

@ObjectType()
export class CancelSuccess {
  @Field(() => OrderId, { description: 'ID of the order that was cancelled.' })
  public orderId: string;

  public constructor(id: string) {
    this.orderId = id;
  }
}

export const OrderPreviewResult = createUnionType({
  name: 'OrderPreviewResult',
  types: () => [OrderPreviewSuccess, OrderError, TPSPDataFetchError],
});

export const OrderPlacementResult = createUnionType({
  name: 'OrderPlacementResult',
  types: () => [OrderPlacementSuccess, OrderError, TPSPDataFetchError],
});

export const CancelResult = createUnionType({
  name: 'CancelResult',
  types: () => [CancelSuccess, OrderError, TPSPDataFetchError],
});

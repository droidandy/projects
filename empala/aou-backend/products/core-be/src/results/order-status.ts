import {
  createUnionType, Field, ObjectType,
} from 'type-graphql';
import { OrderError } from '../errors/order-error';
import { AnyOrder } from '../models/order';

@ObjectType()
export class OrderStatusSuccess {
  @Field(() => AnyOrder)
  public order: typeof AnyOrder;
}

@ObjectType()
export class OrdersSuccess {
  @Field(() => [AnyOrder])
  public orders: typeof AnyOrder[];
}

export const OrderStatusResult = createUnionType({
  name: 'OrderStatusResult',
  types: () => [OrderStatusSuccess, OrderError],
});

export const OrdersResult = createUnionType({
  name: 'OrdersResult',
  types: () => [OrdersSuccess, OrderError],
});

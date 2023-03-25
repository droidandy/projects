/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field, Float, registerEnumType, ObjectType, Int, createUnionType,
} from 'type-graphql';
import { GraphQLScalarType } from 'graphql';
import { EOrderType, ETransactionType } from '../inputs/create-order';
import { Instrument } from './instrument';

@ObjectType({ isAbstract: true })
export class BaseOrder {
  @Field((type) => OrderId)
  public orderId: string;

  @Field((type) => Instrument)
  public instrument: Instrument;

  @Field((type) => ETransactionType)
  public transactionType: ETransactionType;

  @Field((type) => EOrderStatus, { description: 'The current status of this order.' })
  public status: EOrderStatus;

  @Field((type) => Float, { description: 'Number of shares that have been filled so far.' })
  public executedQuantity: number;

  @Field((type) => Float, { description: 'Number of shares that are still waiting to be filled.' })
  public remainingQuantity: number;

  @Field((type) => Float, { description: 'The price where the shares were executed.' })
  public executedPrice: number;

  @Field((type) => Date, { description: 'The date and time when the order was placed.' })
  public createdAt: Date;

  public symbol: string;

  public static createFromData(data: any): BaseOrder {
    let order: BaseOrder;
    if (data.orderType === NotionalOrderType) {
      order = new NotionalOrder();
    } else if (data.quantity !== Math.floor(data.quantity)) {
      order = new FractionalOrder();
    } else { order = new RegularOrder(); }
    order.setFields(data);

    return order;
  }

  public static translateStatusCode(code: string): EOrderStatus {
    switch (code) {
      case 'B': return EOrderStatus.PLACED;
      case 'W': return EOrderStatus.ACCEPTED_AT_EXCHANGE;
      case 'C': return EOrderStatus.CANCELLED;
      case 'E': return EOrderStatus.FILLED;
      case 'P': return EOrderStatus.PARTIALLY_FILLED;
      case 'A': return EOrderStatus.WAITING_FOR_CANCELLATION;
      case 'R': return EOrderStatus.REJECTED;
      case 'G': return EOrderStatus.WAITING_FOR_CANCEL_REPLACE;
      default: return EOrderStatus.UNKNOWN;
    }
  }

  protected setFields(data: any): void {
    this.symbol = data.symbol;
    this.orderId = data.ourRef;
    this.transactionType = data.transaction === ETransactionType.BUY ? ETransactionType.BUY : ETransactionType.SELL;
    this.status = BaseOrder.translateStatusCode(data.translatedStatus);
    this.executedQuantity = data.execQty;
    this.remainingQuantity = data.remainingQty;
    this.executedPrice = data.execPx;
    this.createdAt = new Date(data.createDate);
  }
}

@ObjectType()
export class RegularOrder extends BaseOrder {
  @Field((type) => EOrderType)
  public orderType: EOrderType;

  @Field((type) => Int, { description: 'Number of shares that were originally placed in this order.' })
  public orderQuantity: number;

  @Field((type) => Float, { description: 'The limit price of the order, used with LIMIT and STOP_LIMIT order types.' })
  public limitPrice: number;

  @Field((type) => Float, { description: 'The stop price of the order, used with STOP and STOP_LIMIT order types.' })
  public stopPrice: number;

  protected setFields(data: any): void {
    super.setFields(data);

    this.orderType = data.orderType;
    this.orderQuantity = data.quantity;
    this.limitPrice = data.limitPx;
    this.stopPrice = data.stopPx;
  }
}

@ObjectType()
export class FractionalOrder extends BaseOrder {
  @Field((type) => Float, { description: 'Number of fractional shares that were originally placed in this order.' })
  public fractionalOrderQuantity: number;

  protected setFields(data: any): void {
    super.setFields(data);

    this.fractionalOrderQuantity = data.quantity;
  }
}

@ObjectType()
export class NotionalOrder extends BaseOrder {
  @Field((type) => Float, { description: 'Number of fractional shares that were originally placed in this order.' })
  public notionalValue: number;

  protected setFields(data: any): void {
    super.setFields(data);

    this.notionalValue = data.expectedValue;
  }
}

export const AnyOrder = createUnionType({
  name: 'AnyOrder',
  types: () => [RegularOrder, FractionalOrder, NotionalOrder],
});

export enum EOrderStatus {
  PLACED = 'PLACED',
  ACCEPTED_AT_EXCHANGE = 'ACCEPTED_AT_EXCHANGE',
  CANCELLED = 'CANCELLED',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  WAITING_FOR_CANCELLATION = 'WAITING_FOR_CANCELLATION',
  REJECTED = 'REJECTED',
  WAITING_FOR_CANCEL_REPLACE = 'WAITING_FOR_CANCEL_REPLACE',
  UNKNOWN = 'UNKNOWN',
}

registerEnumType(EOrderStatus, {
  name: 'EOrderStatus',
  description: 'Status of the order',
  valuesConfig: {
    PLACED: {
      description: 'Order is received, but not accepted at the exchange yet',
    },
    ACCEPTED_AT_EXCHANGE: {
      description: 'Order is received and accepted at the exchange',
    },
    CANCELLED: {
      description: 'Order is cancelled with no fills at all',
    },
    FILLED: {
      description: 'Order is filled and is no longer open',
    },
    PARTIALLY_FILLED: {
      description: 'Order is partially filled and is still open',
    },
    WAITING_FOR_CANCELLATION: {
      description: 'Cancel request is received, but not cancelled at the exchange yet',
    },
    REJECTED: {
      description: 'Order is rejected and is no longer open',
    },
    WAITING_FOR_CANCEL_REPLACE: {
      description: 'The replace request is received, but not replaced at the exhange yet',
    },
    UNKNOWN: {
      description: 'Unkown error with the order',
    },
  },
});

export const OrderId = new GraphQLScalarType({
  name: 'OrderId',
  serialize: (value: unknown): any => value,
  parseValue: /* istanbul ignore next */ (value: unknown): any => value,
  parseLiteral: (ast: any): any => ast.value,
});

export const NotionalOrderType = 'Notional';

import {
  InputType, Field, Float, registerEnumType, ID, Int,
} from 'type-graphql';
import 'reflect-metadata';

export enum ETransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  // APEX SUPPORTS OTHER TYPES, THIS IS JUST TO START OFF THE POC
}
registerEnumType(ETransactionType, { name: 'ETransactionType' });

export enum EOrderListingType {
  COST = 'cost',
  EXECUTED = 'executed',
  LATEST = 'latest',
  OPEN = 'open',
  TODAY = 'today',
}
registerEnumType(EOrderListingType, {
  name: 'EOrderListingType',
  description: 'Defines a type to retrieve orders filtered by various statuses',
  valuesConfig: {
    COST: {
      description: 'Used to lookup the order initiated by a particular position',
    },
    EXECUTED: {
      description: 'All orders that have been executed in the current trading day',
    },
    LATEST: {
      description: 'The last ten orders placed',
    },
    OPEN: {
      description: 'All orders that are currently open',
    },
    TODAY: {
      description: 'All of the orders placed in the current trading day',
    },
  },
});

export enum EOrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
  // APEX SUPPORTS OTHER TYPES, THIS IS JUST TO START OFF THE POC
}
registerEnumType(EOrderType, {
  name: 'EOrderType',
  description: 'Defines a type for placing various kinds of orders (for POC; others pending)',
  valuesConfig: {
    MARKET: {
      description: 'Execute order without condition at the best price at the moment',
    },
    LIMIT: {
      description: 'Execute at the price stated in the limitPrice field order better',
    },
    STOP: {
      description: 'Execute a MARKET order when the price moves past the price stated in the stopPrice field',
    },
    STOP_LIMIT: {
      description: 'Execute a LIMIT order at the price stated in limitPrice when the price moves past the price stated in the stopPrice field',
    },
  },
});

@InputType({ isAbstract: true })
export class BaseCreateOrderInput {
  @Field(() => ID, { description: 'ID of the security/instrument to send to the market.' })
  public instId: BigInt;

  @Field(() => ETransactionType)
  public transactionType: ETransactionType;
}

@InputType()
export class CreateFractionalOrderInput extends BaseCreateOrderInput {
  @Field(
    () => Float,
    { description: 'The fractional number of shares to execute. Note that only the first 5 decimal places are used, any more get rounded.' },
  )
  public quantity: number;
}

@InputType()
export class CreateNotionalOrderInput extends BaseCreateOrderInput {
  @Field(
    () => Float,
    { description: 'The expected value of the entire order, i.e. shares * price.  Note that only the first 2 decimal places are used, any more get rounded.' },
  )
  public notionalValue: number;
}

@InputType()
export class CreateOrderInput extends BaseCreateOrderInput {
  @Field(
    () => EOrderType,
    {
      description: `MARKET - Execute order without condition at the best price at the moment
LIMIT - Execute at the price stated in the limitPrice field order better
STOP - Execute a MARKET order when the price moves past the price stated in the stopPrice field
STOP_LIMIT - Execute a LIMIT order at the price stated in limitPx when the price moves past the price stated in the stopPx field.`,
    },
  )
  public orderType: EOrderType;

  @Field(() => Int, { description: 'Number of shares to execute.' })
  public quantity: number;

  @Field(() => Float, { nullable: true, description: 'Execute at this price or better when the orderType is LIMIT or STOP_LIMIT.' })
  public limitPrice: number;

  @Field(() => Float, { nullable: true, description: 'When orderType is STOP or STOP_LIMIT, this price will be used to trigger the order.' })
  public stopPrice: number;
}

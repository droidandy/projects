/* eslint-disable class-methods-use-this */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloError } from 'apollo-server';
import {
  Resolver, Arg, Mutation, Query, Authorized, FieldResolver, Root, Ctx,
} from 'type-graphql';
import { Instrument } from '../models/instrument';
import { ApexTokenManager } from '../utils/apex-token-manager';
import { BaseOrder, NotionalOrderType, OrderId } from '../models/order';
import {
  BaseCreateOrderInput, CreateFractionalOrderInput, CreateNotionalOrderInput, EOrderListingType, CreateOrderInput, EOrderType,
}
  from '../inputs/create-order';
import { OrderError } from '../errors/order-error';
import {
  OrderPreviewSuccess, OrderPreviewResult, OrderPlacementSuccess, OrderPlacementResult, CancelSuccess, CancelResult,
} from '../results/place-order';
import { convertErrorCode } from '../apex-extend/trade/apex-error-code-converter';
import { EAccessRole } from '../security/auth-checker';
import {
  OrdersResult, OrdersSuccess, OrderStatusResult, OrderStatusSuccess,
} from '../results/order-status';
import { logger } from '../../../utils/src/logger';
import instrumentsCache from '../utils/instruments-cache';
import { TPSPDataFetchError } from '../errors/tpsp-data-fetch-error';
import { TradeAccountResolver } from './trade-account';

@Resolver(BaseOrder)
export class OrderResolver {
  private static readonly ORDER_QUANTITY_LIMIT: number = 1000000;

  @FieldResolver()
  public async instrument(@Root() order: BaseOrder) {
    const inst = await Instrument.findOne({ where: { symbol: order.symbol } });
    return inst;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Query(() => OrderStatusResult, { description: 'Returns the order matching the provided order id.' })
  public async orderStatus(@Ctx() ctx: any, @Arg('orderId', () => OrderId) orderId: string): Promise<typeof OrderStatusResult> {
    const result = await ApexTokenManager.sendTradeApiAxiosRequest('get', `/api/orders/status/${orderId}`);
    if (result.data.symbol) { return Object.assign(new OrderStatusSuccess(), { order: BaseOrder.createFromData(result.data) }); }

    const msg = `Error getting status for order ${orderId}`;
    logger.error(msg, result, result.data);
    return new OrderError(msg, ctx.requestId);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Query(() => OrdersResult, { description: 'Returns all the orders filtered by listing type.' })
  public async orders(@Ctx() ctx: any, @Arg('orderListingType', () => EOrderListingType) orderListingType: EOrderListingType): Promise<typeof OrdersResult> {
    const accountId = await TradeAccountResolver.getTradeAccountId(ctx.metadata.user.id);
    const result = await ApexTokenManager.sendTradeApiAxiosRequest('get', `/api/orders/${orderListingType}?account=${accountId}`);

    /* istanbul ignore else */
    if (Array.isArray(result.data)) {
      return Object.assign(new OrdersSuccess(), { orders: result.data.map((o) => BaseOrder.createFromData(o)) });
    } else {
      logger.error('Error getting orders:', result, result.data);
      return new OrderError('Error getting orders', ctx.requestId);
    }
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => CancelResult, { description: 'API for cancelling an order using its orderId.' })
  public async cancelOrder(@Ctx() ctx: any, @Arg('orderId', () => OrderId) orderId: string): Promise<typeof CancelResult> {
    logger.info(`Cancelling order ${orderId}`);
    const accountId = await TradeAccountResolver.getTradeAccountId(ctx.metadata.user.id);
    const body = {
      account: {
        accountNumber: accountId,
      },
      order: {
        orderRef: orderId,
      },
    };
    const result = await ApexTokenManager.sendTradeApiAxiosRequest('post', '/api/orders/v2/cancel', body);
    return new CancelSuccess(result.data.orderRef);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPreviewResult, {
    description: 'Before placing an order, use this API first for the purpose of order validation.'
      + 'Expected price and quantity are returned.  This API is for transacting a whole number of shares, not fractional.',
  })
  public async previewRegularOrder(@Ctx() ctx: any, @Arg('data', () => CreateOrderInput) data: CreateOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(false, data, ctx.requestId, ctx.metadata.user.id);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPreviewResult, {
    description: 'Before placing an order, use this API first for the purpose of order validation.  '
      + 'Expected price and quantity are returned.  This only API supports selling a fractional number shares at this time, not buying.',
  })
  public async previewFractionalOrder(@Ctx() ctx: any, @Arg('data', () => CreateFractionalOrderInput) data: CreateFractionalOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(false, data, ctx.requestId, ctx.metadata.user.id);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPreviewResult, {
    description: 'Before placing an order, use this API first for the purpose of order validation.  '
      + 'Expected price and quantity are returned.  '
      + 'This API is for buying and selling by total/notional order value instead or specifying the number of shares.',
  })
  public async previewNotionalOrder(@Ctx() ctx: any, @Arg('data', () => CreateNotionalOrderInput) data: CreateNotionalOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(false, data, ctx.requestId, ctx.metadata.user.id);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPlacementResult, {
    description: 'This is the API for placig an order and sending it to the market.  '
      + 'The same validation is done as with the preview API but an order ID is returned after successful placement.  '
      + 'This API is for transacting a whole number of shares, not fractional.',
  })
  public async placeRegularOrder(@Ctx() ctx: any, @Arg('data', () => CreateOrderInput) data: CreateOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(true, data, ctx.requestId, ctx.metadata.user.id);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPlacementResult, {
    description: 'This is the API for placing an order and sending it to the market.  '
      + 'The same validation is done as with the preview API but an order ID is returned after successful placement.  '
      + 'This only API supports selling a fractional number shares at this time, not buying.',
  })
  public async placeFractionalOrder(@Ctx() ctx: any, @Arg('data', () => CreateFractionalOrderInput) data: CreateFractionalOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(true, data, ctx.requestId, ctx.metadata.user.id);
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => OrderPlacementResult, {
    description: 'This is the API for placing an order and sending it to the market.  '
      + 'The same validation is done as with the preview API but an order ID is returned after successful placement.  '
      + 'This API is for buying and selling by total/notional order value instead or specifying the number of shares.',
  })
  public async placeNotionalOrder(@Ctx() ctx: any, @Arg('data', () => CreateNotionalOrderInput) data: CreateNotionalOrderInput): Promise<any> {
    return this.previewOrPlaceOrder(true, data, ctx.requestId, ctx.metadata.user.id);
  }

  private async previewOrPlaceOrder(
    isPlacement: boolean,
    data: BaseCreateOrderInput,
    requestId: string,
    userId: number | string,
  ): Promise<typeof OrderPreviewResult | typeof OrderPlacementResult> {
    const action = isPlacement ? 'placement' : 'preview';
    const accountId = await TradeAccountResolver.getTradeAccountId(userId);

    try {
      logger.info(`Order ${action}:`, data);

      const validationResult = await this.validateAndCreateOrder(data, accountId, requestId);
      if (validationResult instanceof OrderError) {
        logger.info(`Order validation failed for ${action} (${accountId}):`, validationResult.message);
        return validationResult;
      }
      const order = validationResult;

      try {
        const url = isPlacement ? '/api/orders/v2/place/equity' : '/api/orders/v2/preview/equity';
        const result = await ApexTokenManager.sendTradeApiAxiosRequest('post', url, order);
        logger.info(`Order ${action} result (symbol: ${order.order.quote.symbol}, account: ${accountId}):`, result.data);
        return this.generateResult(isPlacement, result.data);
      } catch (error) {
        // Separate catch block to handle invalid order responses from APEX, which are not really system  errors
        /* istanbul ignore else */
        if (error instanceof ApolloError && error.extensions) {
          if (error.extensions.responseData) {
            const errorData = error.extensions.responseData;
            logger.info(`Order ${action} error for account ${accountId}:`, errorData);
            return new OrderError(convertErrorCode(errorData.error), requestId);
          } else if (error.extensions.isConnectionError) {
            return new TPSPDataFetchError('Error connecting to execution server', requestId);
          }
          return new OrderError(`Error occurred during order ${action}, please contact support.`, requestId);
        } else throw error;
        return new OrderError(`Error occurred during order ${action}, please contact support.`, requestId);
      }
    } catch (error) /* istanbul ignore next */ {
      logger.error(`Exception during order ${action} for account ${accountId}:`, error);
      return new OrderError(`Error occurred during order ${action}, please contact support.`, requestId);
    }
  }

  private generateResult(isPlacement: boolean, data: any): OrderPreviewSuccess | OrderPlacementSuccess {
    if (isPlacement) {
      const result = new OrderPlacementSuccess();
      result.orderId = data.orderRef;
      return result;
    }
    const result = new OrderPreviewSuccess();
    result.expectedPrice = data.expectedPx;
    result.expectedQuantity = data.expectedQty;
    return result;
  }

  private async validateAndCreateOrder(data: BaseCreateOrderInput, accountId: string, requestId: string): Promise<any> {
    // let fractionalOrder: CreateFractionalOrderInput;
    // if (data instanceof CreateFractionalOrderInput) fractionalOrder = data;

    if (data instanceof CreateOrderInput) {
      if (data.orderType === EOrderType.LIMIT || data.orderType === EOrderType.STOP_LIMIT) {
        if (!data.limitPrice) return new OrderError('No limit price specified', requestId);
        if (data.limitPrice <= 0) return new OrderError('Invalid limit price specified', requestId);
      }
      if (data.orderType === EOrderType.STOP || data.orderType === EOrderType.STOP_LIMIT) {
        if (!data.stopPrice) return new OrderError('No stop price specified', requestId);
        if (data.stopPrice <= 0) return new OrderError('Invalid stop price specified', requestId);
      }
    }
    if (data instanceof CreateOrderInput || data instanceof CreateFractionalOrderInput) {
      if (data.quantity <= 0 || data.quantity > OrderResolver.ORDER_QUANTITY_LIMIT) return new OrderError('Invalid order quantity', requestId);
    }
    if (data instanceof CreateNotionalOrderInput) {
      if (data.notionalValue <= 0) return new OrderError('Invalid notional value', requestId);
    }

    const symbol = await instrumentsCache.getSymbolByInstId(data.instId);
    if (!symbol) return new OrderError(`Cannot find instrument with id ${data.instId}`, requestId);

    const order: any = {
      requireNbbo: false,
      account: {
        accountNumber: accountId,
      },
      order: {
        quote: {
          symbol,
        },
        transaction: data.transactionType,
        marketTime: 'CORE_MARKET',
        fillType: 'ANY',
        validity: 'DAY',
      },
    };

    if (data instanceof CreateOrderInput || data instanceof CreateFractionalOrderInput) {
      order.order.quantity = data.quantity;
      order.order.orderType = EOrderType.MARKET;
    }
    if (data instanceof CreateOrderInput) {
      order.order.orderType = data.orderType;
      if (data.limitPrice) order.order.limitPrice = data.limitPrice;
      if (data.stopPrice) order.order.stopPrice = data.stopPrice;
    }
    if (data instanceof CreateNotionalOrderInput) {
      order.order.expectedValue = data.notionalValue;
      order.order.orderType = NotionalOrderType;
    }

    return order;
  }
}

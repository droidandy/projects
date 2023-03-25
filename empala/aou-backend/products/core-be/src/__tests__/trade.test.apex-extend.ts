import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { FractionalOrder, NotionalOrder, RegularOrder, EOrderStatus, BaseOrder } from '../models/order';
import { launchpadUserMetadata } from '../test-utils/common';
import { PortfolioEntry } from '../models/portfolio';
import { ApexTokenManager } from '../utils/apex-token-manager';
import { EOrderListingType, EOrderType, ETransactionType } from '../inputs/create-order';
import { createTradingAccount, deleteTradingAccounts } from '../test-utils/trading-account';
import { LogCapture } from '../test-utils/logger';
import { expect } from '@jest/globals';
import nock from 'nock';
import path from 'path';
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);

const C2C_AUTH_PATH = '/c2c/jws.action';
const ORDERS_QUERY_PATH = '/api/orders';
const HTTP_200_OK = 200;
const TRADE_ACCOUNTS_REGEX = /account=[a-zA-Z0-9_.-]*(&|.*)/;
const TRADE_ACCOUNT_ID_REPLACEMENT = 'account=account_id';

axios.defaults.adapter = require('axios/lib/adapters/http');
nock.back.fixtures = path.join('./', 'src', '__tests__', '__nock-fixtures__');
nock.back.setMode('record');
nock.enableNetConnect();

describe('trades', () => {
  let envVars: any;
  beforeAll(async () => {
    LogCapture.enableLogCapture();
    await connection.create();
    await createTradingAccount(launchpadUserMetadata.user.id, process.env.APEX_EXTEND_TRADE_ACCOUNT_ID.split(',')[0]);
    nock.enableNetConnect();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
    LogCapture.disableLogCapture();
  });
  beforeEach(() => {
    envVars = { ...process.env };
    jest.clearAllMocks();
    LogCapture.clear();
  });
  afterEach(() => {
    process.env = { ...envVars };
    nock.restore();
    nock.enableNetConnect();
  })

  const priceyStocks = [11321, 2662, 12315];  // 11321: AMZN, 2662: AAPL, 12315: FB
  const cheapStocks = [11, 74, 242, 2179, 2395];

  const sendOrder = async (action: string, instIds: number | number[], transactionType: ETransactionType,
    orderType?: EOrderType, quantity?: number, limitPrice?: number, stopPrice?: number, notionalValue?: number): Promise<any> => {
    if (!Array.isArray(instIds)) instIds = [instIds];
    if (instIds.length === 0) instIds = cheapStocks;

    for (const instId of instIds) {
      const result = await gCall({
        source: `
          mutation {
            ${action} (data: {
              instId: ${instId}
              transactionType: ${transactionType}
              ${quantity ? ', quantity: ' + quantity : ''}
              ${orderType ? ', orderType: ' + orderType : ''}
              ${limitPrice ? ', limitPrice: ' + limitPrice : ''}
              ${stopPrice ? ', stopPrice: ' + stopPrice : ''}
              ${notionalValue ? ', notionalValue: ' + notionalValue : ''}
            }) {${action.includes('place') ? '... on OrderPlacementSuccess { orderId }' : '... on OrderPreviewSuccess { expectedPrice expectedQuantity }'}
              ... on OrderError { message }
              ... on TPSPDataFetchError { message }
            }
          }`,
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
      if (result.data[action].message !== 'Duplicate order')
        return result;
      console.log('Duplicate order', instId, transactionType, quantity, orderType);
    }
    throw new Error('no more instruments to try');
  };

  const orderFields = `
    ... on RegularOrder {
      orderId transactionType orderType status orderQuantity executedQuantity remainingQuantity
      executedPrice limitPrice stopPrice createdAt
      instrument { id symbol }
    }
    ... on FractionalOrder {
      orderId transactionType status fractionalOrderQuantity executedQuantity remainingQuantity executedPrice createdAt instrument { id symbol }
    }
    ... on NotionalOrder {
      orderId transactionType status executedQuantity remainingQuantity executedPrice notionalValue createdAt instrument { id symbol }
    }`;

  const getOrderStatus = async (orderId: string): Promise<any> =>
    await gCall({
      source: `
        query {
          orderStatus (orderId: "${orderId}") {
            ... on OrderStatusSuccess { order { ${orderFields} } }
            ... on OrderError { message }
          }
        }`,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

  const getOrders = async (orderType: EOrderListingType): Promise<any> =>
    await gCall({
      source: `
        query {
          orders(orderListingType: ${orderType.toUpperCase()}) {
            ... on OrdersSuccess { orders { ${orderFields} } }
            ... on OrderError { message }
          }
        }`,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

  const cancelOrder = async (orderId: string): Promise<any> =>
    await gCall({
      source: `
        mutation {
          cancelOrder (orderId: "${orderId}") {
            ... on CancelSuccess { orderId }
            ... on OrderError { message }
          }
        }`,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

  const getPortfolio = async (): Promise<any> =>
    await gCall({
      source: `
        query {
          currentUser {
            ... on User {
              portfolio {
                portfolioEntries {
                  ... on PortfolioEntries {
                    entries {
                      instrument { id symbol } quantity costBasis currentValue gain gainPercentage
                    }
                  }
                  ... on OrderError { message }
                  ... on TPSPDataFetchError { message }
                }
              }
            }
          }
        }`,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

  type P = Parameters<typeof sendOrder>;
  const validateErrorMessages = async (cases: { args: P; msg: string }[]) => {
    for (const testCase of cases) {
      const { args, msg: expectedMessage } = testCase;
      const result = await sendOrder(...args);
      expect(result.data[args[0]].message).toEqual(expectedMessage);
    }
  };

  const prepareFixtureAfterRecord = (records: any[]) => {
    for (const record of records) {
      if (record.path.startsWith(C2C_AUTH_PATH)) {
        record.path = C2C_AUTH_PATH;
        record.response.token = 'token';
      }
      if (TRADE_ACCOUNTS_REGEX.test(record.path)) {
        record.path = record.path.replace(TRADE_ACCOUNTS_REGEX, TRADE_ACCOUNT_ID_REPLACEMENT);
      }
      if (record.body && record.body.account && record.body.account.accountNumber) {
        record.body.account.accountNumber = 'accountNumber';
      }
    }
    return records;
  };

  const prepareFixtureBeforeUsage = (scope: any) => {
    if (scope.path.startsWith(ORDERS_QUERY_PATH) && scope.status == HTTP_200_OK) {
      if (Array.isArray(scope.response)) {
        for (const order of scope.response) {
          order.createDate = new Date();
        }
      } else {
        scope.response.createDate = new Date();
      }
    }

    scope.filteringPath = (path: string) => {
      if (path.startsWith(C2C_AUTH_PATH)) {
        return C2C_AUTH_PATH;
      }
      if (TRADE_ACCOUNTS_REGEX.test(path)) {
        return path.replace(TRADE_ACCOUNTS_REGEX, TRADE_ACCOUNT_ID_REPLACEMENT);
      }
      return path;
    }

    scope.filteringRequestBody = (body: any) => {
      if (typeof body === 'string' && body.length === 0) {
        return body;
      }
      const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
      if (parsedBody && parsedBody.account && parsedBody.account.accountNumber) {
        parsedBody.account.accountNumber = 'accountNumber';
      }
      return JSON.stringify(parsedBody);
    }
  }

  const nockBackOptions = { before: prepareFixtureBeforeUsage, afterRecord: prepareFixtureAfterRecord };

  describe('local order validation errors', () => {
    it('invalid quantity', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.MARKET, -1], msg: 'Invalid order quantity' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.MARKET, 1000001], msg: 'Invalid order quantity' }
      ]);
    });

    it('invalid limit price', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.LIMIT, 1], msg: 'No limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.LIMIT, 1, -2], msg: 'Invalid limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1], msg: 'No limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, -2], msg: 'Invalid limit price specified' }
      ]);
    });

    it('invalid stop price', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP, 1, 1], msg: 'No stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP, 1, 1, -2], msg: 'Invalid stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, 1], msg: 'No stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, 1, -2], msg: 'Invalid stop price specified' }
      ]);
    });

    it('invalid instrument', async () => {
      await validateErrorMessages([{
        args: ['previewRegularOrder', 1100000, ETransactionType.BUY, EOrderType.MARKET, 1],
        msg: 'Cannot find instrument with id 1100000'
      }]);
    });
  });

  describe('remote/apex validation errors', () => {
    it('error code conversion', async () => {
      const { nockDone } = await nock.back('trade_error_codes.json', nockBackOptions);
      await validateErrorMessages([
        { args: ['previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 2000000], msg: 'Invalid order quantity' },
        { args: ['previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 90000], msg: 'Total order value exceeds limit of: 1500000.0;' },
        {
          args: ['previewRegularOrder', [12184, 12125, 12107], ETransactionType.SELL, EOrderType.MARKET, 3000],
          msg: 'The account doesn\'t have enough shares or contracts for sell order'
        },
        { args: ['previewFractionalOrder', priceyStocks, ETransactionType.BUY, null, 1.5], msg: 'Franctional trading not supported for buys' },
        {
          args: ['previewNotionalOrder', priceyStocks, ETransactionType.BUY, null, null, null, null, 100000000000000],
          msg: 'Tried to order too many shares. Limit is: 100000;'
        },
        { args: ['previewNotionalOrder', priceyStocks, ETransactionType.BUY, null, null, null, null, -100], msg: 'Invalid notional value' }
      ]);

      const result = await sendOrder('previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 2);
      expect(result.data.previewRegularOrder.expectedQuantity).toEqual(2);
      nockDone();
    });

    it('portfolio retrieval fails', async () => {
      const backupUrl = process.env.APEX_EXTEND_TRADE_API_URL;
      expect.assertions(1);
      try {
        process.env.APEX_EXTEND_TRADE_API_URL = 'badurl';
        const result = await getPortfolio();
        expect(result.data.currentUser.portfolio.portfolioEntries.message).toEqual('Error connecting to execution server');
      } finally {
        process.env.APEX_EXTEND_TRADE_API_URL = backupUrl;
      }
    });

    it('portfolio retrieval fails but connection is ok', async () => {
      const backupEntity = process.env.APEX_EXTEND_TRADE_API_ENTITY;
      expect.assertions(1);
      try {
        ApexTokenManager.clearToken();
        process.env.APEX_EXTEND_TRADE_API_ENTITY = '';
        const result = await getPortfolio();
        expect(result.data.currentUser.portfolio.portfolioEntries.message).toEqual('Error retrieving portfolio entries');
      } finally {
        process.env.APEX_EXTEND_TRADE_API_ENTITY = backupEntity;
      }
    });

    it('placement fails due to connection issue', async () => {
      const backupUrl = process.env.APEX_EXTEND_TRADE_API_URL;
      expect.assertions(2);
      try {
        process.env.APEX_EXTEND_TRADE_API_URL = 'badurl';
        const result = await sendOrder('placeRegularOrder', 11, ETransactionType.SELL, EOrderType.MARKET, 1);
        expect(result.data.placeRegularOrder.message).toEqual('Error connecting to execution server');
        expect(LogCapture.hasLogEntry('No response received for axios request')).toBeTruthy();
      } finally {
        process.env.APEX_EXTEND_TRADE_API_URL = backupUrl;
      }
    });
  });

  // UAT can only accept trades during certain times of the day, don't run trading tests outside these hours
  const nowInNY = dayjs().tz('America/New_York');
  const marketOpenTime = nowInNY.hour(7).minute(0).second(30);
  const marketCloseTime = nowInNY.hour(19).minute(0).second(-30);
  const tradeDescribe = nowInNY > marketOpenTime && nowInNY < marketCloseTime ? describe : describe.skip;
  if (tradeDescribe === describe.skip) console.log('Currently outside UAT market hours, skipping trading tests');

  tradeDescribe('order placement tests', () => {
    const waitForOrderStatus = async (orderId: string, status: EOrderStatus, throwOnTimeout: boolean = true): Promise<BaseOrder> => {
      // an order might not be filled right away, so keep getting its status until the expected status is received
      const startTime = new Date();
      let order: RegularOrder;
      do {
        const statusResult = await getOrderStatus(orderId);
        order = statusResult.data.orderStatus.order;
        if (order.status === status) return order;
        await (new Promise(resolve => setTimeout(resolve, 250)));
      } while (new Date().valueOf() - startTime.valueOf() < 15000);
      if (throwOnTimeout) throw new Error(`Didn't get expected status of ${status} for order ${orderId}`);
      else return order;
    };

    it('gets null order status for invalid order id', async () => {
      const { nockDone } = await nock.back('trade_invalid_order_id.json', nockBackOptions);
      const result = await getOrderStatus('INVALIDDD');
      expect(result.data.orderStatus.message).toEqual('Error getting status for order INVALIDDD');
      nockDone();
    });

    it('translate order status codes', async () => {
      expect(BaseOrder.translateStatusCode('B')).toEqual(EOrderStatus.PLACED);
      expect(BaseOrder.translateStatusCode('W')).toEqual(EOrderStatus.ACCEPTED_AT_EXCHANGE);
      expect(BaseOrder.translateStatusCode('C')).toEqual(EOrderStatus.CANCELLED);
      expect(BaseOrder.translateStatusCode('E')).toEqual(EOrderStatus.FILLED);
      expect(BaseOrder.translateStatusCode('P')).toEqual(EOrderStatus.PARTIALLY_FILLED);
      expect(BaseOrder.translateStatusCode('A')).toEqual(EOrderStatus.WAITING_FOR_CANCELLATION);
      expect(BaseOrder.translateStatusCode('R')).toEqual(EOrderStatus.REJECTED);
      expect(BaseOrder.translateStatusCode('G')).toEqual(EOrderStatus.WAITING_FOR_CANCEL_REPLACE);
      expect(BaseOrder.translateStatusCode('FOO')).toEqual(EOrderStatus.UNKNOWN);
    });

    it('can place a market order', async () => {
      const { nockDone } = await nock.back('trade_market_order.json', nockBackOptions);
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.MARKET, 2);
      const orderId = orderResult.data.placeRegularOrder.orderId;
      expect(orderId.startsWith('AC')).toEqual(true);

      const order = await waitForOrderStatus(orderId, EOrderStatus.FILLED) as RegularOrder;
      await sendOrder('placeRegularOrder', Number(order.instrument.id), ETransactionType.SELL, EOrderType.MARKET, 2);

      expect(order).toEqual(expect.objectContaining({
        orderId,
        transactionType: ETransactionType.BUY,
        status: EOrderStatus.FILLED,
        orderQuantity: 2,
        executedQuantity: 2,
        remainingQuantity: 0
      }));
      expect(order.executedPrice).toBeGreaterThan(0.01);
      expect(Math.abs((new Date()).valueOf() - new Date(order.createdAt).valueOf())).toBeLessThan(600000);
      nockDone();
    });

    it('can place a limit stop order', async () => {
      const { nockDone } = await nock.back('trade_limit_stop_order.json', nockBackOptions);
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.STOP_LIMIT, 10, 17.0, 16.0);
      const orderId = orderResult.data.placeRegularOrder.orderId;
      await waitForOrderStatus(orderId, EOrderStatus.FILLED);

      const ordersResult = await getOrders(EOrderListingType.TODAY);
      const order: RegularOrder = ordersResult.data.orders.orders.find((o: any) => o.orderId === orderId);
      await sendOrder('placeRegularOrder', Number(order.instrument.id), ETransactionType.SELL, EOrderType.MARKET, 10);

      expect(order).toEqual(expect.objectContaining({
        orderId,
        transactionType: ETransactionType.BUY,
        status: EOrderStatus.FILLED,
        orderQuantity: 10,
        executedQuantity: 10,
        remainingQuantity: 0,
        executedPrice: 17,
        limitPrice: 17,
        stopPrice: 16
      }));
      nockDone();
    });

    it('can get a partial fill on a limit order', async () => {
      const { nockDone } = await nock.back('trade_partially_filled_order.json', nockBackOptions);
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.LIMIT, 2700, 1.1);
      const orderId = orderResult.data.placeRegularOrder.orderId;

      const order = await waitForOrderStatus(orderId, EOrderStatus.PARTIALLY_FILLED) as RegularOrder;
      await sendOrder('placeRegularOrder', Number(order.instrument.id), ETransactionType.SELL, EOrderType.MARKET, 700);
      await cancelOrder(orderId);

      expect(order).toEqual(expect.objectContaining({
        transactionType: ETransactionType.BUY,
        status: EOrderStatus.PARTIALLY_FILLED,
        orderQuantity: 2700,
        executedQuantity: 700,
        remainingQuantity: 2000,
        executedPrice: 1.1,
        limitPrice: 1.1
      }));
      nockDone();
    });

    it('can send a fractional order', async () => {
      const { nockDone } = await nock.back('trade_fractional_order.json', nockBackOptions);
      const buyOrderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.MARKET, 10); // buy first before selling
      const buyOrderId = buyOrderResult.data.placeRegularOrder.orderId;
      const buyOrder = await waitForOrderStatus(buyOrderId, EOrderStatus.FILLED);
      const instId = Number(buyOrder.instrument.id);

      const orderResult = await sendOrder('placeFractionalOrder', instId, ETransactionType.SELL, null, 9.987654321);
      const orderId = orderResult.data.placeFractionalOrder.orderId;

      const statusResult = await getOrderStatus(orderId);
      const order: FractionalOrder = statusResult.data.orderStatus.order;
      await cancelOrder(orderId);

      expect(order).toEqual(expect.objectContaining({
        orderId,
        transactionType: ETransactionType.SELL,
        fractionalOrderQuantity: 9.98765 // gets rounded to 5 decimal places
      }));
      nockDone();
    });

    it('can send a notional order', async () => {
      const { nockDone } = await nock.back('trade_notional_order.json', nockBackOptions);
      const orderResult = await sendOrder('placeNotionalOrder', cheapStocks, ETransactionType.BUY, null, null, null, null, 100);
      const orderId = orderResult.data.placeNotionalOrder.orderId;

      const statusResult = await getOrderStatus(orderId);
      const order: NotionalOrder = statusResult.data.orderStatus.order;
      await cancelOrder(orderId);

      expect(order.orderId).toEqual(orderId);
      expect(order.transactionType).toEqual(ETransactionType.BUY);
      expect(order.notionalValue).toBeGreaterThan(75);
      expect(order.notionalValue).toBeLessThan(125);
      nockDone();
    });

    it('portfolio is updated after sending orders', async () => {
      const { nockDone } = await nock.back('trade_portfolio_updated.json', nockBackOptions);
      // This test might take a long time to run because fractional orders sometimes take a while to get filled
      const getPortfolioEntry = async () =>
        (await getPortfolio()).data.currentUser.portfolio.portfolioEntries.entries.find((e: any) => Number(e.instrument.id) === instId);

      const orderResult1 = await sendOrder('placeRegularOrder', [2395, 2179, 242], ETransactionType.BUY, EOrderType.MARKET, 66);
      const order1 = await waitForOrderStatus(orderResult1.data.placeRegularOrder.orderId, EOrderStatus.FILLED) as RegularOrder;
      const instId = Number(order1.instrument.id);
      const entry1: PortfolioEntry = await getPortfolioEntry();

      const orderResult2 = await sendOrder('placeRegularOrder', instId, ETransactionType.SELL, EOrderType.MARKET, 30);
      await waitForOrderStatus(orderResult2.data.placeRegularOrder.orderId, EOrderStatus.FILLED);
      const entry2: PortfolioEntry = await getPortfolioEntry();
      expect(entry2.quantity).toEqual(entry1.quantity - 30);

      await sendOrder('placeRegularOrder', instId, ETransactionType.SELL, EOrderType.MARKET, 36);
      nockDone();
    });
  });

  tradeDescribe('various order listing types', () => {
    it('gets today\'s orders', async () => {
      const { nockDone } = await nock.back('trade_today_orders.json', nockBackOptions);
      let passed = true;
      const ordersResult = await getOrders(EOrderListingType.TODAY);
      const todayInNY = dayjs().tz('America/New_York').format('YYYY-MM-DD');
      ordersResult.data.orders.orders.forEach((o: any) => {
        const date = o.createdAt.slice(0, 10);
        if (todayInNY !== date) passed = false;
      });
      expect(passed).toEqual(true);
      nockDone();
    });
    it('gets open orders', async () => {
      const { nockDone } = await nock.back('trade_open_orders.json', nockBackOptions);
      let passed = true;
      const ordersResult = await getOrders(EOrderListingType.OPEN);
      ordersResult.data.orders.orders.forEach((o: any) => {
        if (o.status === EOrderStatus.FILLED) passed = false;
      });
      expect(passed).toEqual(true);
      nockDone();
    });
    it('gets latest orders', async () => {
      const { nockDone } = await nock.back('trade_latest_orders.json', nockBackOptions);
      const ordersResult = await getOrders(EOrderListingType.LATEST);
      expect(ordersResult.data.orders.orders.length).toBeLessThan(11);
      nockDone();
    });
    it('gets executed orders', async () => {
      const { nockDone } = await nock.back('trade_executed_orders.json', nockBackOptions);
      let passed = true;
      const todayInNY = dayjs().tz('America/New_York').format('YYYY-MM-DD');
      const ordersResult = await getOrders(EOrderListingType.EXECUTED);
      ordersResult.data.orders.orders.forEach((o: any) => {
        const date = o.createdAt.slice(0, 10);
        if (todayInNY !== date) passed = false;
        if (o.status !== EOrderStatus.FILLED) passed = false;
      });
      expect(passed).toEqual(true);
      nockDone();
    });
  });

  it('customer tries to get portfolio without trading account', async () => {
    process.env.NODE_ENV = 'development';
    await deleteTradingAccounts();
    expect.assertions(1);
    try {
      await getPortfolio();
    } catch (error) {
      expect(error.toString().includes('Please pass onboarding before starting trading')).toBeTruthy();
    }
  });
});

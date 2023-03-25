/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { GraphQLClient, ClientError } from 'graphql-request';
import { expect } from '@jest/globals';
import { getIdToken } from '../../../utils/src/get-idtoken';
import { EOrderListingType, EOrderType, ETransactionType } from '../../../core-be/src/inputs/create-order';
import { CreateApplicationInput } from '../../../core-be/src/inputs/create-application';
import {
  BaseOrder, EOrderStatus, FractionalOrder, NotionalOrder, RegularOrder,
} from '../../../core-be/src/models/order';
import { PortfolioEntry } from '../../../core-be/src/models/portfolio';
import { isValidLogosObject } from '../../../utils/src/test-utils/matchers';

dayjs.extend(utc);
dayjs.extend(timezone);

const APOLLO_ENDPOINT = process.env.APOLLO_SERVER_HOST_URI || 'http://localhost:3000';
const GRAPHQL_CLIENT = new GraphQLClient(APOLLO_ENDPOINT);

const EXTENDED_APEX_TEST_TIMEOUT_MS = 20_000;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const VALID_APPLICATION_INPUT = require('../../../core-be/src/__tests__/data/apex-valid-payload-tod-trusted-contact-only-residential-address.json');

describe('Apex Extend related requests', () => {
  let testUserIdToken: string;
  beforeAll(async () => {
    const result = Object(await getIdToken(
      process.env.AWS_COGNITO_TEST_USER_EMAIL,
      process.env.AWS_COGNITO_TEST_USER_PASSWORD,
    ));
    expect(result.statusCode).toBe(200);
    testUserIdToken = Object(result.response).token;
  }, 15000);
  afterAll(async () => {
    await removeTradeAccount();
  });

  const priceyStocks = [11321, 2662, 12315]; // 11321: AMZN, 2662: AAPL, 12315: FB
  const cheapStocks = [11, 74, 242, 2179, 2395];

  const makeGqlRequest = (
    source: string,
    variables: any = {},
  ): Promise<any> => GRAPHQL_CLIENT.request(source, variables, { authorization: `Bearer ${testUserIdToken}` });

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

  const sendOrder = async (
    action: string,
    instIds: number | number[],
    transactionType: ETransactionType,
    orderType?: EOrderType,
    quantity?: number,
    limitPrice?: number,
    stopPrice?: number,
    notionalValue?: number,
  ): Promise<any> => {
    if (!Array.isArray(instIds)) instIds = [instIds];
    if (instIds.length === 0) instIds = cheapStocks;
    for (const instId of instIds) {
      const result = await makeGqlRequest(`
        mutation {
          ${action} (data: {
          instId: ${instId}
          transactionType: ${transactionType}
          ${quantity ? `, quantity: ${quantity}` : ''}
          ${orderType ? `, orderType: ${orderType}` : ''}
          ${limitPrice ? `, limitPrice: ${limitPrice}` : ''}
          ${stopPrice ? `, stopPrice: ${stopPrice}` : ''}
          ${notionalValue ? `, notionalValue: ${notionalValue}` : ''}
          }) {${action.includes('place') ? '... on OrderPlacementSuccess { orderId }' : '... on OrderPreviewSuccess { expectedPrice expectedQuantity }'}
          ... on OrderError { message }
          ... on TPSPDataFetchError { message }
        }
        }`);
      if (result[action].message !== 'Duplicate order') { return result; }
      console.log('Duplicate order', instId, transactionType, quantity, orderType);
    }
    throw new Error('no more instruments to try');
  };

  const getOrderStatus = async (orderId: string): Promise<any> => makeGqlRequest(
    `
        query {
          orderStatus (orderId: "${orderId}") {
            ... on OrderStatusSuccess { order { ${orderFields} } }
            ... on OrderError { message }
          }
        }`,
  );

  const getOrders = async (orderType: EOrderListingType): Promise<any> => makeGqlRequest(
    `
        query {
          orders(orderListingType: ${orderType.toUpperCase()}) {
            ... on OrdersSuccess { orders { ${orderFields} } }
            ... on OrderError { message }
          }
        }`,
  );

  const cancelOrder = async (orderId: string): Promise<any> => makeGqlRequest(
    `
        mutation {
          cancelOrder (orderId: "${orderId}") {
            ... on CancelSuccess { orderId }
            ... on OrderError { message }
          }
        }`,
  );

  const getPortfolio = async (): Promise<any> => makeGqlRequest(
    `
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
  );

  const createApplicationMutation = `
    mutation CreateApplication($data: CreateApplicationInput!) {
      createApplication(data: $data) {
        ... on CreateApplicationSuccess {
          applicationId
          requestId
        }
        ... on UnsupportedAccountTypeError {
          unsupportedAccountTypeErrors: errors {
            message
            reason
            fieldName
          }
        }
        ... on TradeAccountAlreadyExistsError {
          # tradeAccountAlreadyExistsError: errors {
            message
          # }
        }
        ... on AccountInputValidationError {
          accountInputValidationError: errors {
            message
            reason
            fieldName
          }
        }
        ... on InternalProcessingError {
          message
        }
      }
    }
  `;

  const createApplication = async (applicationInput: CreateApplicationInput) => makeGqlRequest(
    createApplicationMutation,
    {
      data: applicationInput,
    },
  );

  const getApplicationStatus = async (applicationId: number | string) => makeGqlRequest(
    `
      query Query($applicationId: ID!) {
        getApplicationStatus(applicationId: $applicationId) {
          status
          requestId
          validationErrors {
            errors
            fieldName
          }
          tradeAccountId
        }
      }
    `,
    { applicationId },
  );

  const removeTradeAccount = async () => makeGqlRequest(
    `
    mutation Mutation($accountType: EAccountType!) {
      removeTradeAccount(accountType: $accountType) {
        ... on RemoveTradeAccountSuccess {
          message
        }
        ... on ApplicationNotFoundResult {
          message
          requestId
        }
      }
    }`,
    { accountType: 'CASH' },
  );

  type P = Parameters<typeof sendOrder>;
  const validateErrorMessages = async (cases: { args: P; msg: string }[]) => {
    for (const testCase of cases) {
      const { args, msg: expectedMessage } = testCase;
      const result = await sendOrder(...args);
      expect(result[args[0]].message).toEqual(expectedMessage);
    }
  };

  it('returns error to trading attempt without onboarding passed', async () => {
    // here is 3 assertions because Jest also counts `expect(result.statusCode).toBe(200);` in beforeAll section
    expect.assertions(3);
    try {
      await sendOrder('previewRegularOrder', 11, ETransactionType.BUY, EOrderType.MARKET, 1);
    } catch (error) {
      expect((error as ClientError).response.errors[0].message).toEqual('Please pass onboarding before starting trading');
      expect((error as ClientError).response.errors[0].extensions.requestId).toEqual(expect.any(String));
    }
  });

  it('returns error to portfolio query without onboarding passed', async () => {
    expect.assertions(2);
    try {
      await getPortfolio();
    } catch (error) {
      expect((error as ClientError).response.errors[0].message).toEqual('Please pass onboarding before starting trading');
      expect((error as ClientError).response.errors[0].extensions.requestId).toEqual(expect.any(String));
    }
  });

  it('can fetch instrument logos', async () => {
    const TESLA_SYMBOL = 'TSLA';

    const queryResult = await GRAPHQL_CLIENT.request(`
      query Query {
        instruments(nMax: 1, pattern: "${TESLA_SYMBOL}") {
          ... on Instruments {
            instruments {
              logos {
                ... on InstrumentLogos {
                  logo
                  logoOriginal
                  logoNormal
                  logoThumbnail
                  logoSquare
                  logoSquareStrict
                }
              }
            }
          }
        }
      }
    `, {}, { authorization: `Bearer ${testUserIdToken}` });
    const logosData = queryResult.instruments.instruments[0].logos;
    expect(isValidLogosObject(logosData)).toBe(true);
  });

  it('returns error for invalid onboarding variables', async () => {
    expect.assertions(5);
    try {
      await createApplication({} as CreateApplicationInput);
    } catch (error) {
      expect(error).toBeInstanceOf(ClientError);
      expect((error as ClientError).response.status).toEqual(400);
      expect((error as ClientError).response.errors.length).toBeGreaterThan(0);
      expect((error as ClientError).response.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
      expect((error as ClientError).response.errors[0].extensions.requestId).toEqual(expect.any(String));
    }
  });

  it('returns error for missing required variable', async () => {
    const payload = JSON.parse(JSON.stringify(VALID_APPLICATION_INPUT));
    delete payload.sourceOfIncome;
    const response = await createApplication(payload as CreateApplicationInput);
    expect(response.createApplication.accountInputValidationError.length).toEqual(1);
    expect(response.createApplication.accountInputValidationError).toEqual(expect.arrayContaining([expect.objectContaining({
      message: 'Source of income should be provided for unemployed',
      reason: 'MISSING_EMPLOYMENT_STATUS_FIELDS',
      fieldName: 'sourceOfIncome',
    })]));
    const removeAccountResult = await removeTradeAccount();
    expect(removeAccountResult.removeTradeAccount.message).toEqual('Application not found');
    expect(removeAccountResult.removeTradeAccount.requestId).toEqual(expect.any(String));
  });

  it('can create trading account', async () => {
    const createApplicationResult = await createApplication(VALID_APPLICATION_INPUT);
    const { applicationId } = createApplicationResult.createApplication;
    const applicationStatusResult = await getApplicationStatus(applicationId);
    expect(applicationStatusResult.getApplicationStatus.status).toEqual('COMPLETED');
    expect(applicationStatusResult.getApplicationStatus.tradeAccountId).toEqual(process.env.APEX_EXTEND_TRADE_ACCOUNT_ID.split(',')[0]);
    const removeAccountResult = await removeTradeAccount();
    expect(removeAccountResult.removeTradeAccount.message).toEqual('Successfully deleted');
  }, EXTENDED_APEX_TEST_TIMEOUT_MS);

  describe('local order validation errors', () => {
    beforeAll(async () => {
      await createApplication(VALID_APPLICATION_INPUT);
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);
    it('invalid quantity', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.MARKET, -1], msg: 'Invalid order quantity' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.MARKET, 1000001], msg: 'Invalid order quantity' },
      ]);
    });

    it('invalid limit price', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.LIMIT, 1], msg: 'No limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.LIMIT, 1, -2], msg: 'Invalid limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1], msg: 'No limit price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, -2], msg: 'Invalid limit price specified' },
      ]);
    });

    it('invalid stop price', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP, 1, 1], msg: 'No stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP, 1, 1, -2], msg: 'Invalid stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, 1], msg: 'No stop price specified' },
        { args: ['previewRegularOrder', 11, ETransactionType.BUY, EOrderType.STOP_LIMIT, 1, 1, -2], msg: 'Invalid stop price specified' },
      ]);
    });

    it('invalid instrument', async () => {
      await validateErrorMessages([{
        args: ['previewRegularOrder', 1100000, ETransactionType.BUY, EOrderType.MARKET, 1],
        msg: 'Cannot find instrument with id 1100000',
      }]);
    });
  });

  describe('remote/apex validation errors', () => {
    it('error code conversion', async () => {
      await validateErrorMessages([
        { args: ['previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 2000000], msg: 'Invalid order quantity' },
        { args: ['previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 90000], msg: 'Total order value exceeds limit of: 1500000.0;' },
        {
          args: ['previewRegularOrder', [12184, 12125, 12107], ETransactionType.SELL, EOrderType.MARKET, 3000],
          msg: 'The account doesn\'t have enough shares or contracts for sell order',
        },
        { args: ['previewFractionalOrder', priceyStocks, ETransactionType.BUY, null, 1.5], msg: 'Franctional trading not supported for buys' },
        {
          args: ['previewNotionalOrder', priceyStocks, ETransactionType.BUY, null, null, null, null, 100000000000000],
          msg: 'Tried to order too many shares. Limit is: 100000;',
        },
        { args: ['previewNotionalOrder', priceyStocks, ETransactionType.BUY, null, null, null, null, -100], msg: 'Invalid notional value' },
      ]);

      const result = await sendOrder('previewRegularOrder', priceyStocks, ETransactionType.BUY, EOrderType.MARKET, 2);
      expect(result.previewRegularOrder.expectedQuantity).toEqual(2);
    });
  });

  // UAT can only accept trades during certain times of the day, don't run trading tests outside these hours
  const nowInNY = dayjs().tz('America/New_York');
  const marketOpenTime = nowInNY.hour(7).minute(0).second(30);
  const marketCloseTime = nowInNY.hour(19).minute(0).second(-30);
  const tradeDescribe = nowInNY > marketOpenTime && nowInNY < marketCloseTime ? describe : describe.skip;
  if (tradeDescribe === describe.skip) console.log('Currently outside UAT market hours, skipping trading tests');

  tradeDescribe('order placement tests', () => {
    const waitForOrderStatus = async (orderId: string, status: EOrderStatus, throwOnTimeout = true): Promise<BaseOrder> => {
      // an order might not be filled right away, so keep getting its status until the expected status is received
      const startTime = new Date();
      let order: RegularOrder;
      do {
        const statusResult = await getOrderStatus(orderId);
        order = statusResult.orderStatus.order;
        if (order.status === status) return order;
        await (new Promise((resolve) => { setTimeout(resolve, 250); }));
      } while (new Date().valueOf() - startTime.valueOf() < 15000);
      if (throwOnTimeout) throw new Error(`Didn't get expected status of ${status} for order ${orderId}`);
      else return order;
    };

    it('gets null order status for invalid order id', async () => {
      const result = await getOrderStatus('INVALIDDD');
      expect(result.orderStatus.message).toEqual('Error getting status for order INVALIDDD');
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('can place a market order', async () => {
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.MARKET, 2);
      const { orderId } = orderResult.placeRegularOrder;
      expect(orderId.startsWith('AC')).toEqual(true);

      const order = await waitForOrderStatus(orderId, EOrderStatus.FILLED) as RegularOrder;
      await sendOrder('placeRegularOrder', Number(order.instrument.id), ETransactionType.SELL, EOrderType.MARKET, 2);
      expect(order).toEqual(expect.objectContaining({
        orderId,
        transactionType: ETransactionType.BUY,
        status: EOrderStatus.FILLED,
        orderQuantity: 2,
        executedQuantity: 2,
        remainingQuantity: 0,
      }));
      expect(order.executedPrice).toBeGreaterThan(1.0);
      expect(Math.abs((new Date()).valueOf() - new Date(order.createdAt).valueOf())).toBeLessThan(600000);
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('can place a limit stop order', async () => {
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.STOP_LIMIT, 10, 17.0, 16.0);
      const { orderId } = orderResult.placeRegularOrder;
      await waitForOrderStatus(orderId, EOrderStatus.FILLED);

      const ordersResult = await getOrders(EOrderListingType.TODAY);
      const order: RegularOrder = ordersResult.orders.orders.find((o: any) => o.orderId === orderId);
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
        stopPrice: 16,
      }));
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('can get a partial fill on a limit order', async () => {
      const orderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.LIMIT, 2700, 1.1);
      const { orderId } = orderResult.placeRegularOrder;

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
        limitPrice: 1.1,
      }));
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('can send a fractional order', async () => {
      const buyOrderResult = await sendOrder('placeRegularOrder', cheapStocks, ETransactionType.BUY, EOrderType.MARKET, 10); // buy first before selling
      const buyOrderId = buyOrderResult.placeRegularOrder.orderId;
      const buyOrder = await waitForOrderStatus(buyOrderId, EOrderStatus.FILLED);
      const instId = Number(buyOrder.instrument.id);

      const orderResult = await sendOrder('placeFractionalOrder', instId, ETransactionType.SELL, null, 9.987654321);
      const { orderId } = orderResult.placeFractionalOrder;

      const statusResult = await getOrderStatus(orderId);
      const { order } = statusResult.orderStatus;
      await cancelOrder(orderId);

      expect(order).toEqual(expect.objectContaining({
        orderId,
        transactionType: ETransactionType.SELL,
        fractionalOrderQuantity: 9.98765, // gets rounded to 5 decimal places
      }));
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('can send a notional order', async () => {
      const orderResult = await sendOrder('placeNotionalOrder', cheapStocks, ETransactionType.BUY, null, null, null, null, 100);
      const { orderId } = orderResult.placeNotionalOrder;

      const statusResult = await getOrderStatus(orderId);
      const { order } = statusResult.orderStatus;
      await cancelOrder(orderId);

      expect(order.orderId).toEqual(orderId);
      expect(order.transactionType).toEqual(ETransactionType.BUY);
      expect(order.notionalValue).toBeGreaterThan(75);
      expect(order.notionalValue).toBeLessThan(125);
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);

    it('portfolio is updated after sending orders', async () => {
      // This test might take a long time to run because fractional orders sometimes take a while to get filled
      const getPortfolioEntry = async () => (
        await getPortfolio()
      ).currentUser.portfolio.portfolioEntries.entries.find((e: any) => Number(e.instrument.id) === instId);

      const orderResult1 = await sendOrder('placeRegularOrder', [2395, 2179, 242], ETransactionType.BUY, EOrderType.MARKET, 66);
      const order1 = await waitForOrderStatus(orderResult1.placeRegularOrder.orderId, EOrderStatus.FILLED) as RegularOrder;
      const instId = Number(order1.instrument.id);
      const entry1: PortfolioEntry = await getPortfolioEntry();

      const orderResult2 = await sendOrder('placeRegularOrder', instId, ETransactionType.SELL, EOrderType.MARKET, 30);
      await waitForOrderStatus(orderResult2.placeRegularOrder.orderId, EOrderStatus.FILLED);
      const entry2: PortfolioEntry = await getPortfolioEntry();
      expect(entry2.quantity).toEqual(entry1.quantity - 30);

      await sendOrder('placeRegularOrder', instId, ETransactionType.SELL, EOrderType.MARKET, 36);
    }, EXTENDED_APEX_TEST_TIMEOUT_MS);
  });

  tradeDescribe('various order listing types', () => {
    it('gets today\'s orders', async () => {
      let passed = true;
      const ordersResult = await getOrders(EOrderListingType.TODAY);
      const todayInNY = dayjs().tz('America/New_York').format('YYYY-MM-DD');
      ordersResult.orders.orders.forEach((o: any) => {
        const date = o.createdAt.slice(0, 10);
        if (todayInNY !== date) passed = false;
      });
      expect(passed).toEqual(true);
    });
    it('gets open orders', async () => {
      let passed = true;
      const ordersResult = await getOrders(EOrderListingType.OPEN);
      ordersResult.orders.orders.forEach((o: any) => {
        if (o.status === EOrderStatus.FILLED) passed = false;
      });
      expect(passed).toEqual(true);
    });
    it('gets latest orders', async () => {
      const ordersResult = await getOrders(EOrderListingType.LATEST);
      expect(ordersResult.orders.orders.length).toBeLessThan(11);
    });
    it('gets executed orders', async () => {
      let passed = true;
      const todayInNY = dayjs().tz('America/New_York').format('YYYY-MM-DD');
      const ordersResult = await getOrders(EOrderListingType.EXECUTED);
      ordersResult.orders.orders.forEach((o: any) => {
        const date = o.createdAt.slice(0, 10);
        if (todayInNY !== date) passed = false;
        if (o.status !== EOrderStatus.FILLED) passed = false;
      });
      expect(passed).toEqual(true);
    });
  });
});

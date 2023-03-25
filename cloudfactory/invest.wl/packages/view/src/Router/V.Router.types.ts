import { EnumValues } from '@invest.wl/common';
import { ISRouterNested, ISRouterParams, ISRouterResetParams } from '@invest.wl/core';
import { EVAccountScreen, IVAccountScreenParams } from '../Account/V.Account.types';
import { EVApplicationScreen, IVApplicationScreenParams } from '../Application/V.Application.types';
import { EVAuthScreen, IVAuthScreenParams } from '../Auth/V.Auth.types';
import { EVCustomerScreen, IVCustomerScreenParams } from '../Customer/V.Customer.types';
import { EVFeedbackScreen, IVFeedbackScreenParams } from '../Feedback/V.Feedback.types';
import { EVInstrumentScreen, IVInstrumentScreenParams } from '../Instrument/V.Instrument.types';
import { EVInstrumentAlertScreen, IVInstrumentAlertScreenParams } from '../InstrumentAlert/V.InstrumentAlert.types';
import { EVInvestIdeaScreen, IVInvestIdeaScreenParams } from '../InvestIdea/V.InvestIdea.types';
import { EVLayoutScreen, IVLayoutScreenParams } from '../Layout/V.Layout.types';
import { EVNewsScreen, IVNewsScreenParams } from '../News/V.News.types';
import { EVOperationScreen, IVOperationScreenParams } from '../Operation/V.Operation.types';
import { EVOrderScreen, IVOrderScreenParams } from '../Order/V.Order.types';
import { EVOwnerScreen, IVSupportScreenParams } from '../Owner/V.Owner.types';
import { EVPortfelScreen, IVPortfelScreenParams } from '../Portfel/V.Portfel.types';
import { EVSecurityScreen, IVSecurityScreenParams } from '../Security/V.Security.types';
import { EVStoryScreen, IVStoryScreenParams } from '../Story/V.Story.types';
import { EVTradeScreen, IVTradeScreenParams } from '../Trade/V.Trade.types';

// nested navigation support https://reactnavigation.org/docs/nesting-navigators/
export interface IVRouterNested extends ISRouterNested<EVRouterScreen> {
}

export interface IVRouterParams extends ISRouterParams<EVRouterScreen> {
}

export interface IVRouterResetParams extends ISRouterResetParams<EVRouterScreen> {
}

// TODO: move EVScreen to invest.wl
// названия скринов всегда должны быть уникальными!
export type EVRouterScreen =
  | keyof typeof EVLayoutScreen
  | keyof typeof EVSecurityScreen
  | keyof typeof EVAuthScreen
  | keyof typeof EVCustomerScreen
  | keyof typeof EVInstrumentScreen
  | keyof typeof EVInvestIdeaScreen
  | keyof typeof EVNewsScreen
  | keyof typeof EVTradeScreen
  | keyof typeof EVStoryScreen
  | keyof typeof EVPortfelScreen
  | keyof typeof EVOrderScreen
  | keyof typeof EVOperationScreen
  | keyof typeof EVApplicationScreen
  | keyof typeof EVOwnerScreen
  | keyof typeof EVAccountScreen
  | keyof typeof EVFeedbackScreen
  | keyof typeof EVInstrumentAlertScreen;

export const VRouterScreenList: EVRouterScreen[] = [
  ...(EnumValues.getNames(EVLayoutScreen)),
  ...(EnumValues.getNames(EVSecurityScreen)),
  ...(EnumValues.getNames(EVAuthScreen)),
  ...(EnumValues.getNames(EVCustomerScreen)),
  ...(EnumValues.getNames(EVInstrumentScreen)),
  ...(EnumValues.getNames(EVInvestIdeaScreen)),
  ...(EnumValues.getNames(EVNewsScreen)),
  ...(EnumValues.getNames(EVTradeScreen)),
  ...(EnumValues.getNames(EVStoryScreen)),
  ...(EnumValues.getNames(EVPortfelScreen)),
  ...(EnumValues.getNames(EVOrderScreen)),
  ...(EnumValues.getNames(EVOperationScreen)),
  ...(EnumValues.getNames(EVApplicationScreen)),
  ...(EnumValues.getNames(EVOwnerScreen)),
  ...(EnumValues.getNames(EVAccountScreen)),
  ...(EnumValues.getNames(EVFeedbackScreen)),
  ...(EnumValues.getNames(EVInstrumentAlertScreen)),
];

export interface IVRouterParamsTypeMap extends IVLayoutScreenParams, IVCustomerScreenParams,
  IVNewsScreenParams, IVAuthScreenParams, IVOperationScreenParams, IVInstrumentScreenParams,
  IVInstrumentAlertScreenParams, IVInvestIdeaScreenParams, IVOrderScreenParams, IVPortfelScreenParams,
  IVStoryScreenParams, IVTradeScreenParams, IVSecurityScreenParams, IVApplicationScreenParams,
  IVSupportScreenParams, IVAccountScreenParams, IVFeedbackScreenParams {
}

// Error: TS2536: Type 'K' cannot be used to index type 'IScreenParamsTypes'.
// Значит в ScreenNameEnum добавлен новый скрин, а в ScreenParamsTypesMap не добавлен.
export type IVRouterParamsMap<P extends IVRouterParams = IVRouterParams> = { [S in EVRouterScreen]: IVRouterParamsTypeMap[S] & P };
export const VRouterServiceTid = Symbol.for('VRouterServiceTid');
export const VRouterListenerTid = Symbol.for('VRouterListenerTid');

export interface IVRouterService {
  resetTo<R extends EVRouterScreen>(name: R, params?: IVRouterParamsMap<IVRouterResetParams>[R]): void;
  navigateTo<R extends EVRouterScreen>(name: R, params?: IVRouterParamsMap[R]): void;
  push<R extends EVRouterScreen>(name: R, params?: IVRouterParamsMap[R]): void;
  pop(count?: number): void;
  popToTop(): void;
  replaceTo<R extends EVRouterScreen>(name: R, params?: IVRouterParamsMap[R]): void;
  canGoBack(): boolean;
  back(): void;
}


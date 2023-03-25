import { DCurrencyCodeRuble, EDCurrencyCode, EDInstrumentAssetType, EDPortfelOperationType } from '@invest.wl/core';

interface IInstrumentAccounting {
  operationTypeId?: EDPortfelOperationType;
  assetType?: EDInstrumentAssetType;
  currency?: string;
}

export const moneyOperationList = [EDPortfelOperationType.Trade, EDPortfelOperationType.Debts, EDPortfelOperationType.Debts2];

export function instrumentIsMoneyOperation(operationTypeId?: EDPortfelOperationType) {
  return operationTypeId != null && moneyOperationList.includes(operationTypeId);
}

export function instrumentIsPosition(item: IInstrumentAccounting) {
  return item.assetType !== EDInstrumentAssetType.Money || instrumentIsMoneyOperation(item.operationTypeId);
}

export function instrumentIsRuble(item: IInstrumentAccounting) {
  return (
    item.assetType === EDInstrumentAssetType.Money &&
    instrumentIsMoneyOperation(item.operationTypeId) &&
    DCurrencyCodeRuble.includes(item.currency as EDCurrencyCode)
  );
}

export function instrumentIsShown(item: IInstrumentAccounting) {
  return item.assetType !== EDInstrumentAssetType.Money || item.operationTypeId !== EDPortfelOperationType.Trade;
}

export function instrumentIsShownNoFX(item: IInstrumentAccounting) {
  return item.assetType !== EDInstrumentAssetType.FX && instrumentIsShown(item);
}

export class DInstrumentFilter {
  public static moneyOperationList = moneyOperationList;

  public static isPosition = instrumentIsPosition;
  public static isMoneyOperation = instrumentIsMoneyOperation;
  public static isShown = instrumentIsShown;
  public static isShownNoFX = instrumentIsShownNoFX;
  public static isRouble = instrumentIsRuble;
}

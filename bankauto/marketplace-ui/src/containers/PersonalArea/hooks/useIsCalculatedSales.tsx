import { useMemo } from 'react';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_TRADE_IN_STATUS,
  APPLICATION_VEHICLE_STATUS,
} from '@marketplace/ui-kit/types';

interface Props {
  creditStatus?: APPLICATION_CREDIT_STATUS;
  tradeInStatus?: APPLICATION_TRADE_IN_STATUS;
  vehicleStatus?: APPLICATION_VEHICLE_STATUS;
}

export const useCalculatedSales = ({ vehicleStatus, creditStatus, tradeInStatus }: Props) =>
  useMemo(() => {
    const isActiveOrder =
      !!vehicleStatus &&
      ![APPLICATION_VEHICLE_STATUS.CANCEL, APPLICATION_VEHICLE_STATUS.EXPIRED].includes(vehicleStatus);

    if (!isActiveOrder) return { isCalculatedCredit: false, isCalculatedTradeIn: false };

    const isCalculatedCredit =
      !!creditStatus &&
      [
        APPLICATION_CREDIT_STATUS.SUCCESS,
        APPLICATION_CREDIT_STATUS.APPROVED,
        APPLICATION_CREDIT_STATUS.FROZEN,
        APPLICATION_CREDIT_STATUS.CALCULATED,
      ].includes(creditStatus);
    const isCalculatedTradeIn =
      !!tradeInStatus &&
      [
        APPLICATION_TRADE_IN_STATUS.SUCCESS,
        APPLICATION_TRADE_IN_STATUS.FROZEN,
        APPLICATION_TRADE_IN_STATUS.CALCULATED,
      ].includes(tradeInStatus);

    return { isCalculatedCredit, isCalculatedTradeIn, isActiveOrder };
  }, [creditStatus, tradeInStatus, vehicleStatus]);

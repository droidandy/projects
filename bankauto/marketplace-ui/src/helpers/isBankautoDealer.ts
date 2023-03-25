import { isProduction } from 'constants/isProduction';

const BANKAUTO_DEALER_ID = isProduction ? 1787 : 1787;
const BANKAUTO_DEALER_NAME = isProduction ? '#БАНКАВТО' : '#БАНКАВТО';

export const isBankautoDealerId = (id: string | number): boolean => id === BANKAUTO_DEALER_ID;
export const isBankautoDealerName = (name: string): boolean => name === BANKAUTO_DEALER_NAME;

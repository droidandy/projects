import { StateModel } from 'store/types';

export const selectCreditData = (state: StateModel) => state.application.simpleCredit;

import { createSagaRequestSelectors } from './utils';

const selectors = createSagaRequestSelectors('interactions');

export const selectInteractions = selectors.selectInteractions;
export const selectInteractionsData = selectors.selectInteractionsData;
export const selectInteractionsCount = selectors.selectInteractionsCount;
export const selectInteractionsLoading = selectors.selectInteractionsLoading;
export const selectInteractionsError = selectors.selectInteractionsError;

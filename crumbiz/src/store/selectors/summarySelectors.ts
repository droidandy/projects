import { createSagaRequestSelectors } from './utils';

const selectors = createSagaRequestSelectors('summary');

export const selectSummary = selectors.selectSummary;
export const selectSummaryData = selectors.selectSummaryData;
export const selectSummaryLoading = selectors.selectSummaryLoading;
export const selectSummaryError = selectors.selectSummaryError;

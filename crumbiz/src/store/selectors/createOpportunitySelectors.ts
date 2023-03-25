import { TemplatesEnum } from '../../types/enums';

// const createSelector = (chunk: string, specificState:string) => (state: any) =>
// createOpportunitySelector(state)[chunk][];

// const createSelector = (...selectors) => (state: any) => {
//   return selectors.reduce((currentState, selector) => {
//     return selector(currentState)
//   },state);
// }

// createSelector(
//   createOpportunitySelector,
//   (createOpportunity) => createOpportunity.budget
// )

export const createOpportunitySelector = (state: any) =>
	state.createOpportunity;

export const verticalsSelector = (state: any) =>
	createOpportunitySelector(state).verticals;

export const providersSelector = (state: any) =>
	state.createOpportunity[TemplatesEnum.SERVICE_PROVIDER_ID];

export const initialBudgetSelector = (state: any) =>
	state.createOpportunity[TemplatesEnum.BUDGET_ID];

export const initialVerticalSelector = (state: any) =>
	state.createOpportunity[TemplatesEnum.VERTICAL_ID];

export const budgetSelector = (state: any) => state.createOpportunity.budget;

export const getSelectedOppTypeId = (state: any) =>
	createOpportunitySelector(state).opType.id;

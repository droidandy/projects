import { IMyOppsState } from '../reducers/myOppsReducer';

export const oppsSelector = (state: any): IMyOppsState => state.myOpps;
export const oppsLoading = (state: any) => oppsSelector(state).isLoading;

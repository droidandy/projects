import { StateModel } from 'store/types';

export const selectServiceRequest = (state: StateModel) => state.serviceRequest;
export const selectServiceRequestForm = (state: StateModel) => state.serviceRequest.values;

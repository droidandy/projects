import { useStateModel, useStateSelectorObject } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';
import { StateModel } from 'store/types';
import { ReviewCreateFormData } from 'types/Review';

export const useCreateReviewData = () => {
  return useStateModel('createReviewData', actions, thunkActions);
};

export const useCreateReviewDataProperties = () => {
  return useStateSelectorObject<StateModel, ReviewCreateFormData>((state) => state.createReviewData.data);
};

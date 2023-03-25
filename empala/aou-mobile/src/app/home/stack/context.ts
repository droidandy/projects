import { createStackScreens } from './screensConfig';

import { Layer } from '~/components/containers/Layer';
import { StepContainerConfiguration } from '~/components/StepContainer/types';

export type CreateStackScreensContextData = StepContainerConfiguration & {
  name: string;
  selectedCompanies: { id: string }[];
};

export const initialState: CreateStackScreensContextData = {
  name: '',
  selectedCompanies: [],
  config: createStackScreens,
  container: ({ children }) => Layer({ children }),
};

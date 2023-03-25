import { EmptyInstrument } from './hunchMocData';
import { createHunchScreens } from './screensConfig';

import { StepContainerConfiguration } from '~/components/StepContainer/types';
import { Layer } from '~/components/containers/Layer';
import { Instrument } from '~/graphQL/core/generated-types';

export type CreateHunchScreensContextData = StepContainerConfiguration & {
  name: string;
  selectedCompany: Instrument;
};

export const initialState: CreateHunchScreensContextData = {
  name: '',
  selectedCompany: EmptyInstrument,
  config: createHunchScreens,
  container: ({ children }) => Layer({ children }),
};

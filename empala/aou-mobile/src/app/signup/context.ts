import { fetchTagsBySelectedCompanies } from './backgroundJobs';
import { Background } from './components';
import { onboardingScreens } from './screensConfig';
import { OnboardingContextData } from './types';

export const initialState: OnboardingContextData = {
  config: onboardingScreens,
  container: ({ children, screenConfig }) => Background({ children, screenConfig }),
  backgroundJobs: {
    selectedCompanies: fetchTagsBySelectedCompanies,
  },
};

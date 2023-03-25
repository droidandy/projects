import { fundingScreens } from './screensConfig';

import { FundFlowContainer } from '~/components/containers/fund';
import { StepContainerConfiguration } from '~/components/StepContainer/types';
import { Broker } from '~/network/responses';
import { AccountProps } from '~/types/account';

export type FundScreensContextData = StepContainerConfiguration & {
  bankAccount: AccountProps | undefined;
  amount: number | undefined;
  institution: Broker | undefined;
  isPartial: boolean;
  isDeposit: boolean;
};

export const initialState: FundScreensContextData = {
  bankAccount: undefined as AccountProps | undefined,
  amount: 0,
  institution: undefined,
  isPartial: false,
  isDeposit: false,
  config: fundingScreens,
  container: FundFlowContainer,
};

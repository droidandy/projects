import { DocumentNode } from '@apollo/client';

import { OnboardingScreens } from '~/app/home/navigation/routes';
import { InterestTheme, OnboardingContextData } from '~/app/signup/types';
import { GqlTypes, onboardingGqlArrayToBubbleable, onboardingTagResponseToBubbleable } from '~/app/signup/utils';
import {
  CommunityStacksDocument,
  CommunityStacksQuery,
  GetInvestopeersDocument,
  GetInvestopeersQuery,
  GetThemesDocument,
  GetThemesQuery,
  Instrument,
  OneRandomInstDocument,
  OneRandomInstQuery,
  Theme,
} from '~/graphQL/core/generated-types';

export type FetchDataConfig = {
  prepareArgsFunc?: (ctx: OnboardingContextData) => Record<string, unknown>;
  handleDataFunc: (data: any) => Record<string, unknown> | Array<any> | string;
  gqlDoc: DocumentNode;
};

export type FetchDataConfigList = Partial<Record<OnboardingScreens, FetchDataConfig>>;

type OneRandomInst = Pick<Instrument, 'id' | 'symbol' | 'description'> & { themes: Pick<Theme, 'id' | 'name'>[] };

export const fetchDataConfig: FetchDataConfigList = {
  [OnboardingScreens.OnboardingInterests]: {
    gqlDoc: GetThemesDocument,
    handleDataFunc: (data: GetThemesQuery | undefined) => onboardingGqlArrayToBubbleable(
      data?.themes.themes, GqlTypes.Theme,
    ),
  },
  [OnboardingScreens.OnboardingCommunutyStack]: {
    gqlDoc: CommunityStacksDocument,
    handleDataFunc: (data: CommunityStacksQuery | undefined) => {
      const stacks = data?.communityStacks?.commStacks;
      return ({ data: stacks });
    },
  },
  [OnboardingScreens.OnboardingInvestorPeers]: {
    gqlDoc: GetInvestopeersDocument,
    handleDataFunc: (data: GetInvestopeersQuery | undefined) => data?.topUsers.users || [],
  },
  [OnboardingScreens.OnboardingTags]: {
    gqlDoc: OneRandomInstDocument,
    prepareArgsFunc: ({ selectedCompanies }) => {
      const iDs = Array.isArray(selectedCompanies) && selectedCompanies?.length > 0 ? selectedCompanies : [{
        id: '059a2803-f952-47a3-8292-46c08ceaccee',
        target: 429,
        text: 'CHEESECAKE FACTORY INC',
      }];
      return ({
        instIds: iDs?.map((i) => i.id),
      });
    },
    handleDataFunc: (data: OneRandomInstQuery | undefined) => onboardingTagResponseToBubbleable(
      (data?.oneRandomInst as OneRandomInst) || {},
      InterestTheme,
    ),
  },
};

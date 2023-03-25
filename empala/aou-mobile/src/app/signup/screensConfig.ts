import { Logo } from './components';
import {
  BubbleScreen,
  BubbleScreenProps,
  BubbleScreenOwnState,
  BubblesWithTextInputScreen,
  BubblesWithTextInputScreenProps,
  BadgeScreen,
  InvestorPeersScreen,
  SignUpScreen,
  SignUpExtraScreen,
  SignUpCodeScreen,
} from './containers';
import { fetchDataManager } from './fetchDataManager';
import {
  BubbleScreenData, DataFields, OnboardingContextData, SubmitFields,
} from './types';
import { selectCompanies } from './utils';

import { OnboardingScreens } from '~/app/home/navigation/routes';
import { NextScreenData } from '~/components/StepContainer/types';
import { User } from '~/graphQL/core/generated-types';

const SCREEN_INDEXES = {
  Interests: 0,
  Companies: 1,
  FirstStack: 2,
  CommunityStack: 2,
  InvestorPeers: 3,
  OnboardingTags: 4,
  OnboardingBadge: 4,
  OnboardingSignUp: 5,
  OnboardingCode: 5,
};

export const onboardingScreens = {
  [OnboardingScreens.OnboardingInterests]: {
    title: '',
    fields: [
      {
        component: BubbleScreen,
        props: {
          title: 'Your interests',
          subtitle: 'What are you сurious about?',
          dataFieldName: DataFields.selectedInterests,
          fetchData: () => fetchDataManager(OnboardingScreens.OnboardingInterests) as BubbleScreenData,
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.Interests,
          },
        } as BubbleScreenProps,
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingCompanies,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingCompanies]: {
    title: '',
    fields: [
      {
        component: BubbleScreenOwnState,
        props: {
          withAction: true,
          title: 'Companies you like',
          subtitle: 'Pick a few companies you’d want to\nkeep a closer watch on',
          dataFieldName: DataFields.selectedCompanies,
          fetchData: ({ selectedInterests }: OnboardingContextData) => selectCompanies(selectedInterests),
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.Companies,
          },
        } as BubbleScreenProps,
        nextScreen: ({ selectedCompanies }: OnboardingContextData): NextScreenData => (selectedCompanies?.length
          ? { name: OnboardingScreens.OnboardingFirstStack }
          : { name: OnboardingScreens.OnboardingCommunutyStack }),
      },

    ],
  },
  [OnboardingScreens.OnboardingFirstStack]: {
    title: '',
    fields: [
      {
        component: BubblesWithTextInputScreen,
        props: {
          title: 'Great, you just created\nyour first Investack™!',
          subtitle: 'Investacks™ are personal collections of stocks. '
            + 'With stacks, you can monitor, fine-tune, '
            + 'share, follow, and ultimately expand your '
            + 'investment universe.',
          dataFieldName: DataFields.stackName,
          fetchData: ({ selectedCompanies }: OnboardingContextData): BubbleScreenData => (
            { data: selectedCompanies || [] }
          ),
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.FirstStack,
          },
        } as BubblesWithTextInputScreenProps,
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingInvestorPeers,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingCommunutyStack]: {
    title: '',
    fields: [
      {
        component: BubbleScreen,
        props: {
          title: 'Community Stacks™',
          subtitle: 'A sample of Stacks™ to choose from, popular with Investopeer community',
          dataFieldName: DataFields.selectedCommunityStacks,
          fetchData: (): BubbleScreenData => fetchDataManager(
            OnboardingScreens.OnboardingCommunutyStack,
          ) as BubbleScreenData,
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.CommunityStack,
          },
        },
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingInvestorPeers,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingInvestorPeers]: {
    title: '',
    fields: [
      {
        component: InvestorPeersScreen,
        props: {
          title: 'Get to know our\nInvestopeer™ Community',
          subtitle: 'Investopeer community inspires collective\nwisdom. With the investopeer community\n'
            + 'you follow likeminded individuals and evolve\ntogether.',
          dataFieldName: SubmitFields.follows,
          fetchData: (): User[] => fetchDataManager(OnboardingScreens.OnboardingInvestorPeers) as User[],
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.InvestorPeers,
          },
        },
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingTags,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingTags]: {
    title: '',
    fields: [
      {
        component: BubbleScreen,
        props: {
          title: 'How would you best qualify\nthis particular company?',
          subtitle: 'Chose one attribute that best fits your perception of this company, and unlock an achievement!',
          dataFieldName: DataFields.tagThemeIds,
          selectionRequired: false,
          fetchData: (): BubbleScreenData => fetchDataManager(OnboardingScreens.OnboardingTags) as BubbleScreenData,
          children: (props: { description: string }): JSX.Element => Logo(props),
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.OnboardingTags,
          },
        },
        nextScreen: ({
          [DataFields.tagThemeIds]: tag,
        }: OnboardingContextData): NextScreenData => (tag?.length
          ? { name: OnboardingScreens.OnboardingBadge }
          : { name: OnboardingScreens.OnboardingSignUp }),
      },
    ],
  },
  [OnboardingScreens.OnboardingBadge]: {
    title: '',
    fields: [
      {
        component: BadgeScreen,
        props: {
          title: 'Achievement unlocked!',
          subtitle: 'Look out for more achievements on the platform!',
          badgeTitle: 'Beginner Tagger',
          badgeIcon: 'badge0',
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.OnboardingBadge,
          },
        },
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingSignUp,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingSignUp]: {
    title: '',
    fields: [
      {
        component: SignUpScreen,
        props: {
          title: 'Sign up with email',
          subtitle: 'Create a profile to save these settings\n'
            + 'and begin exploring the exciting\n'
            + 'Investopeer™ community!',
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.OnboardingSignUp,
          },
        },
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingSignUpExtra,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingSignUpExtra]: {
    title: '',
    fields: [
      {
        component: SignUpExtraScreen,
        props: {
          title: 'What is your\nInvestopeer™ name?',
          subtitle: 'Benefit from the wisdom of the crowd,\nbe discovered by Investopeers™',
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.OnboardingSignUp,
          },
        },
        nextScreen: (): NextScreenData => ({
          name: OnboardingScreens.OnboardingCode,
        }),
      },
    ],
  },
  [OnboardingScreens.OnboardingCode]: {
    title: '',
    fields: [
      {
        component: SignUpCodeScreen,
        props: {
          title: 'Email verification',
          subtitle: 'Please enter the code you received via email to verify your email address',
          meta: {
            totalScreens: 6,
            screenIndex: SCREEN_INDEXES.OnboardingCode,
          },
        },
      },
    ],
  },
};

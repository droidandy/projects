import { CreateStackScreens, CreateHunchScreens } from '~/app/home/navigation/routes';
import { DataFields } from '~/app/home/types/investack';
import { NextScreenData } from '~/components/StepContainer/types';
import { IntroScreen } from '~/components/molecules/introScreen';
import { NameStack } from '~/components/molecules/nameStack';
import { SelectCompany } from '~/components/molecules/selectCompany';
import { useThrottlesCompanySearchQuery } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';

export const createStackScreens = {
  [CreateHunchScreens.Intro]: {
    headerShown: false,
    fields: [
      {
        component: IntroScreen,
        props: {
          title: 'Investack™ Creation',
          subtitle: 'Investacks™ are personal collections of stocks. With investacks™,'
            + 'you can monitor, fine-tune, share, follow, and ultimately expand your investment universe.',
          image: 'stackIntro',
          imageWidthPercent: 0.6,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateStackScreens.SelectCompany,
        }),
      },
    ],
  },

  [CreateStackScreens.SelectCompany]: {
    headerShown: true,
    title: 'Create an Investack™',
    fields: [
      {
        component: SelectCompany,
        props: {
          title: 'Create an Investack™',
          subtitle: 'Select the companies you wish to add to\nyour Investack™',
          dataFieldName: DataFields.selectedCompanies,
          fetchData: useThrottlesCompanySearchQuery,
          select: true,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateStackScreens.NameStack,
        }),
      },
    ],
  },

  [CreateStackScreens.NameStack]: {
    headerShown: true,
    title: 'Name your Investack™',
    fields: [
      {
        component: NameStack,
        props: {
          title: 'Create an Investack™',
          subtitle: 'Investacks™ are personal collections of\nstocks.',
          dataFieldName: DataFields.stackName,
          select: true,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateStackScreens.NameStack,
        }),
      },
    ],
  },
};

export const screens = Object.keys(createStackScreens).map((key) => ({ key, field: createStackScreens[key] }));

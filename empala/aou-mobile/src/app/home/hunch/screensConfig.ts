import { CreateHunchScreens } from '~/app/home/navigation/routes';
import { DataFields } from '~/app/home/types/hunch';
import { NextScreenData } from '~/components/StepContainer/types';
import { IntroScreen } from '~/components/molecules/introScreen';
import { SelectCompany } from '~/components/molecules/selectCompany';
import { SetPriceAndDate } from '~/components/molecules/setPriceAndDate';
import { useThrottlesCompanySearchQuery } from '~/graphQL/hooks/useThrottlesCompanySearchQuery';

export const createHunchScreens = {
  [CreateHunchScreens.Intro]: {
    title: '',
    headerShown: false,
    fields: [
      {
        component: IntroScreen,
        props: {
          title: 'Hunch™ Creation',
          subtitle: 'Hunches™  are community insights. With hunches™, you can use the community '
            + 'as your sounding board and share your investment ideas.',
          image: 'hunchIntro',
          imageWidthPercent: 0.9,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateHunchScreens.SelectCompany,
        }),
      },
    ],
  },

  [CreateHunchScreens.SelectCompany]: {
    headerShown: true,
    title: 'Create a Hunch™',
    fields: [
      {
        component: SelectCompany,
        props: {
          title: 'Create a Hunch™',
          subtitle: 'Select the company you wish to create a Hunch™ for.',
          dataFieldName: DataFields.selectedCompany,
          fetchData: useThrottlesCompanySearchQuery,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateHunchScreens.SetPriceAndDate,
        }),
      },
    ],
  },

  [CreateHunchScreens.SetPriceAndDate]: {
    title: 'Create a Hunch™',
    headerShown: true,
    fields: [
      {
        component: SetPriceAndDate,
        props: {
          title: 'Create a Hunch™',
          subtitle: 'Please set the target price and date for your Hunch™',
          dataFieldName: DataFields.selectedCompany,
        },
        nextScreen: (): NextScreenData => ({
          name: CreateHunchScreens.SelectCompany,
        }),
      },
    ],
  },

  [CreateHunchScreens.CreateHunch]: {
    title: '',
    fields: [

    ],
  },
};

export const screens = Object.keys(createHunchScreens).map((key) => ({ key, field: createHunchScreens[key] }));

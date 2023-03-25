import { FundingScreens } from '~/app/home/navigation/routes';

import { FundScreensContextData } from './context';

import { BankAccount } from '~/components/atoms/funding/bankAccount';
import { ClipboardCopy } from '~/components/atoms/funding/clipboardCopy';
import { FundingButton } from '~/components/atoms/funding/fundingButton/FundingButton';
import { SelectAccount } from '~/components/atoms/funding/selectAccount/SelectAccount';
import { WireTransfer } from '~/components/atoms/funding/wireTransfer';
import { bankRequisites } from '~/components/atoms/funding/wireTransfer/WireTransfer';
import { ScreenField } from '~/components/StepContainer/types';
import { ACATSFromWhere } from '~/components/molecules/acatsFromWhere';
import { AllSet } from '~/components/molecules/allSet';
import { HowMuch } from '~/components/molecules/howMuch';
import { PlaidComponent } from '~/components/molecules/plaidComponent';
import { PlaidComponentText } from '~/components/molecules/plaidComponent/PlaidComponentText';

export const fundingScreens = {
  [FundingScreens.FundingStack]: {
    title: 'Deposit or Withdraw?',
    fields: [
      {
        component: FundingButton,
        props: {
          title: 'Deposit into All of Us',
          subtitle: 'Transfer cash or holding into All of Us in a few simple steps',
        },
        nextScreen: () => ({
          name: FundingScreens.HowScreen,
          navTitle: 'Add funds',
        }),
      },
      {
        component: FundingButton,
        props: {
          title: 'Withdraw from All of Us',
          subtitle: 'Move cash out of All of Us to an external account',
        },
        nextScreen: () => ({
          name: FundingScreens.ToWhereScreen,
          navTitle: 'Withdraw funds',
        }),
      },
    ],
  },

  [FundingScreens.HowScreen]: {
    title: 'How?',
    fields: [
      {
        component: SelectAccount,
        props: {},
      },
      {
        component: FundingButton,
        props: {
          title: 'Make a deposit by bank transfer',
          subtitle: 'Simply connect your bank to All of Us to quickly add cash (usually takes 1-2 business days)',
        },
        nextScreen: () => ({
          name: FundingScreens.ACHFromWhereScreen,
          navTitle: 'Bank transfer',
        }),
      },
      {
        component: FundingButton,
        props: {
          title: 'Move an account',
          subtitle: 'Move all of your stock holdings from an existing brokerage account to All of Us',
        },
        nextScreen: () => ({
          name: FundingScreens.ACATSFromWhereScreen,
          params: { partial: false },
          navTitle: 'Move an account',
        }),
      },
      {
        component: FundingButton,
        props: {
          title: 'Move a stock',
          subtitle: 'Move stocks from an existing brokerage account to All of Us',
        },
        nextScreen: () => ({
          name: FundingScreens.ACATSFromWhereScreen,
          params: { partial: true },
          navTitle: 'Move a stock',
        }),
      },
      {
        component: FundingButton,
        props: {
          title: 'Make a deposit by wire transfer',
          subtitle: 'Get our info to move cash from your bank to All of Us by wire (usually takes 1-2 business days)',
        },
        nextScreen: () => ({
          name: FundingScreens.WireTransferScreen,
          navTitle: 'Wire transfer',
        }),
      },
    ],
  },
  [FundingScreens.ToWhereScreen]: {
    title: 'To where?',
    fields: [
      {
        component: SelectAccount,
        props: {},
      },
      {
        component: BankAccount,
        props: {},
        nextScreen: () => ({
          name: FundingScreens.HowMuchScreen,
          params: { isDeposit: false },
          navTitle: 'Withdraw funds',
        }),
      },
      {
        component: PlaidComponent,
        props: {
          children: PlaidComponentText(),
        },
      },
    ],
  },
  [FundingScreens.ACHFromWhereScreen]: {
    title: 'From where?',
    fields: [
      {
        component: SelectAccount,
        props: {},
      },
      {
        component: BankAccount,
        props: {},
        nextScreen: () => ({
          name: FundingScreens.HowMuchScreen,
          params: { isDeposit: true },
          navTitle: 'Bank transfer',
        }),
      },
      {
        component: PlaidComponent,
        props: {
          children: PlaidComponentText(),
        },
      },
    ],
  },
  [FundingScreens.ACATSFromWhereScreen]: {
    title: 'From where?',
    fields: [
      {
        component: ACATSFromWhere,
        props: {},
        nextScreen: () => ({
          name: FundingScreens.ACHFromWhereScreen,
        }),
      },
    ],
  },
  [FundingScreens.HowMuchScreen]: {
    title: 'How much?',
    fields: [
      {
        component: HowMuch,
        nextScreen: ({ isDeposit }: FundScreensContextData) => ({
          name: FundingScreens.AllSetScreen,
          navTitle: isDeposit ? 'Bank transfer' : 'Withdraw funds',
        }),
      } as ScreenField,
    ],
  },
  [FundingScreens.AllSetScreen]: {
    title: 'AllSet?',
    fields: [
      {
        component: AllSet,
        nextScreen: () => ({
          name: FundingScreens.AllSetScreen,
        }),
      },
    ],
  },
  [FundingScreens.WireTransferScreen]: {
    title: "Here's the info",
    fields: [
      {
        component: WireTransfer,
      },
      {
        component: ClipboardCopy,
        props: {
          text: bankRequisites,
        },
      },
    ],
  },
  [FundingScreens.PlaidScreen]: {
    title: '',
    fields: [
      {
        component: FundingButton,
        props: {
          title: '',
          subtitle: '',
        },
        nextScreen: () => ({
          name: FundingScreens.ACHFromWhereScreen,
        }),
      },
    ],
  },
};

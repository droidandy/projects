import { BaseResponse } from '~/network/useFetch';

export interface AccountProps extends BaseResponse {
  type: string;
  id: number;
  apexAccountNumber: string;
  logo: string;
  institutionName: string;
  accountNumber: string;
}

export type SettingsType = {
  accounts: Array<AccountProps>;
  selectedAccount: AccountProps | undefined;
  accountTypeToAdd: string | null;
};

export type FundingType = {
  ach: {
    form: {
      bankAccount: null;
      amount: null;
    };
  };
  acat: {
    form: {
      brokerAccount: null;
      assets: null;
      amount: null;
    };
  };
  publicToken: null;
  history: {
    items: [];
    range: undefined;
  };
  bankAccounts: [];
  brokerageAccounts: Record<string, unknown>;
  clearingFirms: [];
  constraints: { ira: { contributions: [] } };
};

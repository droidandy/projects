export interface IPortfelSummaryRequest {
  dateFrom: string;
  dateTo: string;
  clients: string;
  currencyName: string;
  accounts?: string;
}

export type IPortfelSummaryResponse = {
  Account: {
    AccountId: number;
    Name: string;
    DisplayName: string;
    Type: string;
  };
  MarketValue: number;
  FreeCash: number;
  Assets: number;
  AvailableForLoan: number;
  MarginRatio: number;
  PL: number;
  Yield: number;
  Performance: number;
  PLToday: number;
  InitMargin: number;
  MinMargin: number;
  FortsGO: number;
  InAllAssets: number;
  LimNonMargin: number;
  ValShort: number;
  ValLong: number;
  OpenBal: number;
  UDS: number;
  CDS: number;
  Varmargin: number;
  CbpPrevLimit: number;
  CbplUsed: number;
  CorrectedMargin: number;
  NPR1: number;
  NPR2: number;
}[];

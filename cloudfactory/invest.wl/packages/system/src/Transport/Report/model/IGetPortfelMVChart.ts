export interface IGetPortfelMVChartRequest {
  dateFrom: string | Date;
  dateTo: string | Date;
  currencyName: string;
  accounts?: string;
  type?: number;
}

export interface IGetPortfelMVChartResponseItem {
  Date: Date;
  Client: string;
  PL: number;
  MarketValue: number;
}

export interface IGetPortfelMVChartResponse extends Array<IGetPortfelMVChartResponseItem> {
}

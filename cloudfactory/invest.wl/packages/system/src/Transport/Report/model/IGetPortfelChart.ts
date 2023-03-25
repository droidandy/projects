export interface IGetPortfelChartRequest {
  dateFrom: string | Date;
  dateTo: string | Date;
  clients: string;
  currencyName: string;
  accounts?: string;
}

export interface IGetPortfelChartResponseItem {
  Date: Date;
  Name: string;
  Yield: number;
}

export interface IGetPortfelChartResponse extends Array<IGetPortfelChartResponseItem> {
}

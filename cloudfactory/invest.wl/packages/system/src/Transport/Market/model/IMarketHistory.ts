export interface IMarketHistoryRequest {
  mode: string;
  classCode: string;
  secCode: string;
  length: string;
  from?: Date | string;
  to?: Date | string;
  offset?: number;
  pagesize?: number;
}

type ChartColumn = 'time' | 'o' | 'h' | 'l' | 'c' | 'v';

export interface IMarketHistoryResponse {
  results: [{
    statement_id: number;
    series: [{
      name: string;
      columns: [ChartColumn, ChartColumn, ChartColumn, ChartColumn, ChartColumn, ChartColumn];
      values: [string, number, number, number, number, number][];
    }];
  }];
}

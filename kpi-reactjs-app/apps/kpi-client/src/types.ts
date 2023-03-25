import { ReportStats, ExcellenceRequirement } from 'shared/types';

export * from 'shared/types';

export interface Notification {
  id: number;
  type: 'error' | 'success';
  text: string;
}

export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean;
  component: React.ReactElement<any>;
}

export type ChartColor = 'green' | 'red' | 'yellow' | 'gray' | 'blue';

export interface ReportStatsWithColor extends ReportStats {
  color: ChartColor;
  performance: number;
}

export interface SelectOption<T = any> {
  label: any;
  value: T;
}

export type DashboardPerformanceType = 'KPI' | 'Excellence';

export interface BaseCommentProps {
  kpiId?: number;
  kpiDataSeriesId?: number;
  excellenceRequirementId?: number;
}

export type CalcStatusExcellence =
  | 'Completed'
  | 'Active'
  | 'Exist'
  | 'NotExist';

export interface CalcExcellence extends ExcellenceRequirement {
  calcStatus: CalcStatusExcellence;
}

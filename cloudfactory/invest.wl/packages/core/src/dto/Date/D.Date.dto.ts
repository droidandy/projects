import { Moment, unitOfTime } from 'moment';

export enum EDDateDayPart {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night'
}

export enum EDDatePeriodEdge {
  Start = 0,
  End = 1
}

export type TDDatePeriodDates = [Moment, Moment];
type TDDatePeriodValueDuration = [number, unitOfTime.Base];
export type TDDatePeriodUnitCustom = 'custom';
export type TDDatePeriodUnitBase = 'm1' | 'm5' | 'h1' | 'D1' | 'W1' | 'M1' | 'M3' | 'M6' | 'Y1' | 'Y3';
export type TDDatePeriodUnit = TDDatePeriodUnitBase | TDDatePeriodUnitCustom;
export type TDDatePeriodValue = TDDatePeriodUnitBase | TDDatePeriodDates;

export interface IDDatePeriodItem {
  value: TDDatePeriodValueDuration;
}

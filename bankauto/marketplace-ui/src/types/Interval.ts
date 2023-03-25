export interface Interval {
  min: number;
  max: number;
}

export interface IntervalWithDefault extends Interval {
  default?: number;
}

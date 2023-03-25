export const DDateAdapterTid = Symbol.for('DDateAdapterTid');

export interface IDDateAdapter {
  readonly serverOffsetMin: number;
  readonly pickerDateMin: Date;
  readonly pickerDateMax: Date | undefined;
}

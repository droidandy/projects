export interface WithOnBlur<Data> {
  onBlur?: (values?: Data, ban?: boolean) => void;
}

export enum FilterDirection {
  disabled,
  down,
  up,
}

export type FilterOrderItem = {
  id: string | number;
  label: string;
};

export type FilterDirectionPair = {
  [key in string | number]: FilterDirection;
};

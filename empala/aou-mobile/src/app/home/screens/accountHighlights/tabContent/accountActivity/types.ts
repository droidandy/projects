export enum Filter {
  company,
  date,
  type,
}

export type Activity = {
  id: string | number;
  name: string;
  type: string;
  image: JSX.Element;
  date: Date;
  value: number | string;
};

export type Section = {
  name: string;
  data: Activity[];
};

export enum ActivityTypes {
  divident = 'Divident',
  interest = 'Interest',
  linked = 'Linked',
  removed = 'Removed',
  updated = 'Updated',
  withDrawal = 'WithDrawal',
}

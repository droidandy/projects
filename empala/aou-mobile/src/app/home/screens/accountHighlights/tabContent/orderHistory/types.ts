import { Order } from '~/app/home/types/trade';

export enum Filter {
  company,
  type,
  status,
}

export type Section = {
  name: string;
  data: Order[];
};

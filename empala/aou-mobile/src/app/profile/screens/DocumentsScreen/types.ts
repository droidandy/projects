export type Document = {
  id: number;
  image: JSX.Element;
  name: string;
  sym?: string;
  value?: string | number;
  type?: string;
  date: Date;
  status: string;
};

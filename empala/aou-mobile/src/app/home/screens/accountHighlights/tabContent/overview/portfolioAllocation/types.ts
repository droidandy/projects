export enum AllocationType {
  companies,
  investacks,
  interests,
}

export type Company = {
  id: number | string;
  image: JSX.Element;
  name: string;
  sharesCount: number;
  sharesValue: string;
  value: string;
  percentage: number;
  valueChange: string;
};

export type Cash = {
  id: string | number;
  image: JSX.Element;
  name: string;
  value: string;
};

export type InvestackMock = {
  id: string | number;
  name: string;
  percentage: number;
  valueChange: string;
  totalValue: string;
  companiesCount: number;
  bottomIconsCount: number;
  avatar?: JSX.Element;
};

export type InterestMock = {
  id: string | number;
  name: string;
  percentage: number;
  valueChange: string;
  totalValue: string;
  companiesCount: number;
  investacksCount: number;
};

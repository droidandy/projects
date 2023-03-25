import { ImageSourcePropType } from 'react-native';

import { BaseResponse } from './useFetch';

export class Broker implements BaseResponse {
  constructor(number: string, account_name: string) {
    this.number = number;
    this.account_name = account_name;
  }

  number: string;

  account_name: string;

  imgSource: ImageSourcePropType | undefined;

  withImageSource(imgSource: ImageSourcePropType) {
    this.imgSource = imgSource;
    return this;
  }
}

export interface ItemProps extends BaseResponse {
  symbol: string;
  companyName: string;
  marketValue: {
    formattedCurrency: string;
    shortFormattedCurrency: string;
    value: number;
  };
  percentChange: {
    formattedPercent: string;
    value: number;
  };
}

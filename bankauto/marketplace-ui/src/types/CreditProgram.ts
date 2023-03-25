import { Interval, IntervalWithDefault } from 'types/Interval';
import { CREDIT_PROGRAM_NAME, PRODUCT_SUBTYPE_FIS, PRODUCT_TYPE, PRODUCT_TYPE_FIS } from 'constants/credit';

export interface CreditProgram {
  name: CREDIT_PROGRAM_NAME;
  credit: Interval;
  term: Interval;
  rate: number;
  initialPayment?: IntervalWithDefault;
  productType?: PRODUCT_TYPE;
  productTypeFis?: PRODUCT_TYPE_FIS;
  productSubtype?: PRODUCT_SUBTYPE_FIS;
  promo?: string;
  currentInitialPayment?: number;
}

import { IVFilterXModelVariant } from '@invest.wl/common';
import { IVFlexProps } from '../../../Layout/Flex';

export interface IVFilterProps<M extends IVFilterXModelVariant<any>> extends IVFlexProps {
  model: M;
  inModal?: boolean;
  onSelect?(value: any): void;
}

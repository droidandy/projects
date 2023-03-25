import { IVSortXModalContext, IVSortXModel } from '@invest.wl/common';
import { IVFlexProps } from '../../../Layout/Flex';

export interface VSortProps<M extends IVSortXModel<any>, C = IVSortXModalContext<any, any>> extends IVFlexProps {
  model: M;
  context?: C;
  onConfirm?(context: C): void;
}

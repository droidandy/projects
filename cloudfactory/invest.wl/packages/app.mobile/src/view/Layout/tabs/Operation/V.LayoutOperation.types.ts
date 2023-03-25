import { EventX } from '@invest.wl/common/src/reactive/EventX/EventX';
import { IVInputModel } from '@invest.wl/view/src/Input/model/V.Input.model';

export interface IVLayoutOperationTabsScreenProps {
}

export interface IVLayoutOperationTabProps {
  filterEventX: EventX<boolean>;
  searchModel: IVInputModel<string>;
}

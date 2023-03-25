import { DModelX } from '../../../ModelX/D.ModelX.model';
import { IDFilterXConfigItem, IDFilterXConfigModel, IDFilterXSelectItem, TDFilterXType } from '../D.FilterX.types';

export class DFilterXConfigModel<T extends TDFilterXType>
  extends DModelX.Value<IDFilterXSelectItem<T>[] | undefined> implements IDFilterXConfigModel<T> {
  public input?: boolean;

  constructor(config: IDFilterXConfigItem<T>) {
    super(config.list);
    this.input = config.input;
  }
}

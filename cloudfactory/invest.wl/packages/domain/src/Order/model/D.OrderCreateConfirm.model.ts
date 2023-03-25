import { IDOrderRequestConfirmRequestDTO, Injectable, IoC, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DOrderConfig, DOrderConfigTid } from '../D.Order.config';
import { EDOrderConfirmStrategy } from '../D.Order.types';

export const DOrderCreateConfirmModelTid = Symbol.for('DOrderCreateConfirmModelTid');
type TDTO = Typify<IDOrderRequestConfirmRequestDTO>;

export interface IDOrderCreateConfirmModelProps {
  codeLength: number;
}

export interface IDOrderCreateConfirmModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DOrderCreateConfirmModel extends DInputFormModel<TDTO> implements IDOrderCreateConfirmModel {
  constructor(props: IDOrderCreateConfirmModelProps) {
    const cfg = IoC.get<DOrderConfig>(DOrderConfigTid);
    super({
      code: new DInputCodeModel({
        validatorList: cfg.confirmStrategy === EDOrderConfirmStrategy.SMS ? [DInputValidator.required] : undefined,
        length: props.codeLength,
      }),
      orderRequestId: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      agreementId: new DInputIdModel(),
    });
  }
}

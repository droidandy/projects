import { IDAuthCred, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';
import { DInputLoginModel } from '../../Input/model/D.InputLogin.model';
import { DInputPasswordModel } from '../../Input/model/D.InputPassword.model';

export const DAuthSigninModelTid = Symbol.for('DAuthSigninModelTid');
type TDTO = Typify<IDAuthCred>;

export interface IDAuthSigninModelProps {
  codeLength: number;
}

export interface IDAuthSigninModel extends IDInputFormModel<TDTO> {
  readonly code: DInputCodeModel;
}

@Injectable()
export class DAuthSigninModel extends DInputFormModel<TDTO> implements IDAuthSigninModel {
  public code = new DInputCodeModel({ validatorList: [DInputValidator.required], length: this.props.codeLength });

  constructor(private props: IDAuthSigninModelProps) {
    super({
      login: new DInputLoginModel({ validatorList: [DInputValidator.required] }),
      password: new DInputPasswordModel({ validatorList: [DInputValidator.required] }),
    });
  }
}

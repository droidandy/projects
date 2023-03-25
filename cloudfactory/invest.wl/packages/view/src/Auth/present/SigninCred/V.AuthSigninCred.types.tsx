import { DAuthSigninCredCase, IDAuthSigninCredCaseProps } from '@invest.wl/domain';
import { IVAuthSigninModel } from '../../model/V.AuthSignin.model';

export const VAuthSigninCredPresentTid = Symbol.for('VAuthSigninCredPresentTid');

export interface IVAuthSigninCredPresentProps extends IDAuthSigninCredCaseProps {
}

export interface IVAuthSigninCredPresent {
  model: IVAuthSigninModel;
  caseSignin: DAuthSigninCredCase;
  init(props: IVAuthSigninCredPresentProps): void;
  signin(): Promise<void>;
}

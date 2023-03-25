import { IDAuthSigninPrepareResponseDTO } from '@invest.wl/core';
import { IDAuthSigninCase, IDAuthSigninCaseProps } from '@invest.wl/domain';
import { VTimerBgModel } from '../../../Timer/model/V.TimerBg.model';
import { IVAuthSigninModel } from '../../model/V.AuthSignin.model';

export const VAuthSigninPresentTid = Symbol.for('VAuthSigninPresentTid');

export interface IVAuthSigninPresentProps extends IDAuthSigninCaseProps {

}

export interface IVAuthSigninPresent {
  model: IVAuthSigninModel;
  timer: VTimerBgModel;
  caseSignin: IDAuthSigninCase;
  init(props: IVAuthSigninPresentProps): Promise<void>;
  signin(): Promise<IDAuthSigninPrepareResponseDTO>;
  confirm(): Promise<void>;
}

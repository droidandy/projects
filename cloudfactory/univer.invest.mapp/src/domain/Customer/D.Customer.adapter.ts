import { IDCustomerAdapter } from '@invest.wl/domain/src/Customer/D.Customer.types';
import {
  IDCustomerAccountSelfRequestDTO, IDCustomerAccountSelfResponseDTO, IDCustomerCreateSelfCodeResendRequestDTO,
  IDCustomerCreateSelfCodeResendResponseDTO, IDCustomerCreateSelfConfirmRequestDTO,
  IDCustomerCreateSelfConfirmResponseDTO, IDCustomerCreateSelfRequestDTO, IDCustomerCreateSelfResponseDTO,
  IDCustomerPreferenceSetRequestDTO, IDCustomerPreferenceSetResponseDTO,
} from '@invest.wl/core/src/dto/Customer';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import {
  STransportAccountService, STransportAccountServiceTid,
} from '@invest.wl/system/src/Transport/Account/S.TransportAccount.service';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DCustomerAdapter implements IDCustomerAdapter {
  constructor(
    @Inject(STransportAccountServiceTid) private _accountTp: STransportAccountService,
  ) {}

  public accountSelf(req: IDCustomerAccountSelfRequestDTO): Promise<IApiResponse<IDCustomerAccountSelfResponseDTO>> {
    return this._accountTp.Settings().then(res => ({
      code: 0, data: {
        ...res, id: res.Email || 'id', Avatar: res.UserAvatarUri,
        phone: res.Phone, email: res.Email,
      },
    }));
  }

  public preferenceSet(req: IDCustomerPreferenceSetRequestDTO): Promise<IApiResponse<IDCustomerPreferenceSetResponseDTO>> {
    return this._accountTp.Preference(req).then(res => ({ code: 0, data: res }));
  }

  public createSelf(req: IDCustomerCreateSelfRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfResponseDTO>> {
    throw new Error('not implemented');
  }

  public createSelfCodeResend(req: IDCustomerCreateSelfCodeResendRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfCodeResendResponseDTO>> {
    throw new Error('not implemented');
  }

  public createSelfConfirm(req: IDCustomerCreateSelfConfirmRequestDTO): Promise<IApiResponse<IDCustomerCreateSelfConfirmResponseDTO>> {
    throw new Error('not implemented');
  }
}

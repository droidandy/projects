import { IApiResponse, IDBankSearchRequestDTO, IDBankSearchResponseDTO, Inject, Injectable } from '@invest.wl/core';
import { IDBankAccountAdapter } from '@invest.wl/domain/src/BankAccount/D.BankAccount.types';
import { STransportDaDataService, STransportDaDataServiceTid } from '@invest.wl/system/src/Transport/DaData/S.TransportDaData.service';

@Injectable()
export class DBankAccountAdapter implements IDBankAccountAdapter {
  constructor(
    @Inject(STransportDaDataServiceTid) private _daDataTp: STransportDaDataService,
  ) { }

  public search(req: IDBankSearchRequestDTO): Promise<IApiResponse<IDBankSearchResponseDTO>> {
    return this._daDataTp.Bank({ query: req.text }).then(res => ({
      code: 0, data: res.suggestions.map(s => ({
        id: s.data.bic, bik: s.data.bic, inn: s.data.inn, kpp: s.data.kpp,
        accountCorr: s.data.correspondent_account, name: s.value, address: {
          city: s.data.payment_city, country: 'RU',
        },
      })),
    }));
  }
}

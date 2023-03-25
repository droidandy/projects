import { IApiResponse, IDAddressSearchRequestDTO, IDAddressSearchResponseDTO, Inject, Injectable } from '@invest.wl/core';
import { IDAddressAdapter } from '@invest.wl/domain/src/Address/D.Address.types';
import { IDaDataAddressDTO } from '@invest.wl/system/src/Transport/DaData';
import { STransportDaDataService, STransportDaDataServiceTid } from '@invest.wl/system/src/Transport/DaData/S.TransportDaData.service';

@Injectable()
export class DAddressAdapter implements IDAddressAdapter {
  constructor(
    @Inject(STransportDaDataServiceTid) private _daDataTp: STransportDaDataService,
  ) { }

  public search(req: IDAddressSearchRequestDTO): Promise<IApiResponse<IDAddressSearchResponseDTO>> {
    return this._daDataTp.Address({ query: req.text }).then(res => ({
      code: 0, data: res.suggestions.map(s => ({
        id: s.data.flat_fias_id || s.data.house_fias_id || this._getGuid(s) || '',
        country: s.data.country || '', city: s.data.city || '',
        house: s.data.house, houseId: s.data.house_fias_id, street: s.data.street, block: s.data.block,
        flat: s.data.flat, flatId: s.data.flat_fias_id, full: s.value, guid: this._getGuid(s),
      })),
    }));
  }

  private _getGuid = (s: IDaDataAddressDTO) => {
    if (s.data.street_fias_id) return s.data.street_fias_id;
    if (s.data.settlement_fias_id) return s.data.settlement_fias_id;
    if (s.data.city_district_fias_id) return s.data.city_district_fias_id;
    if (s.data.city_fias_id) return s.data.city_fias_id;
    if (s.data.area_fias_id) return s.data.area_fias_id;
    if (s.data.region_fias_id) return s.data.region_fias_id;
    return '';
  };
}

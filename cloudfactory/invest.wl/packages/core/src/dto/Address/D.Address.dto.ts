import { TModelId } from '../../types';

export interface IDAddressDTO {
  guid?: string;
  // полный адрес
  full?: string;
  // страна
  country: string;
  // город
  city: string;
  // улица
  street?: string;
  // номер дома
  house?: string;
  // id дома
  houseId?: string;
  // корпус \ строение
  block?: string;
  // квартира \ офис
  flat?: string;
  // id квартиры \ офиса
  flatId?: string;
}

export interface IDAddressItemDTO extends IDAddressDTO {
  id: TModelId;
}

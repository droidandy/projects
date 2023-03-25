import { ISDeviceInfo } from '@invest.wl/system';

export interface ISDeviceInfoMobile extends ISDeviceInfo {
  productId?: string; // см. config PRODUCT_ID.
  IMEI?: string; //	Идентификатор мобильного устройства
  IMSI?: string; //	Идентификационный номер SIM (IMSI)
  simOperator?: string; //	Оператор связи мобильного устройства
}

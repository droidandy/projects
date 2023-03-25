export const SDeviceConfigTid = Symbol.for('SDeviceConfigTid');
export const SDeviceStoreTid = Symbol.for('SDeviceStoreTid');

export interface ISDeviceStore<I extends ISDeviceInfo = ISDeviceInfo> {
  getDeviceInfo(...props: (keyof I)[]): Promise<ISDeviceInfo>;
  getDeviceInfoAsString(): Promise<string>;
}

export interface ISDeviceConfig {
}

export interface ISDeviceInfo {
  applicationVersion?: string; //	Версия приложения.
  installationId?: string; //	Идентификатор установки.
  osVersion?: string; //	Версия ОС.
  deviceModel?: string; //	Модель устройства.
  manufacturer?: string; //	Производитель устройства
  coordinates?: string; //	Географические координаты мобильного устройства
  MAC?: string; //	Mac-адрес устройства
  IPAddress?: string; // IP адрес устройства
}

export interface IDaDataAddressDTO {
  value: string; //	Адрес одной строкой (как показывается в списке подсказок)
  unrestricted_value: string; // Адрес одной строкой (полный, с индексом)
  data: IDataDaData;
}

interface IDataDaData {
  postal_code?: string; // Индекс
  country?: string; //	Страна
  country_iso_code?: string; // ISO-код страны (двухсимвольный)
  federal_district?: string; // Федеральный округ

  region_fias_id?: string; // Код ФИАС региона
  region_kladr_id?: string; //	Код КЛАДР региона
  region_iso_code?: string; //	ISO-код региона
  region_with_type?: string; //	Регион с типом
  region_type?: string; //	Тип региона (сокращенный)
  region_type_full?: string; // Тип региона
  region?: string; // Регион

  area_fias_id?: string; //	Код ФИАС района в регионе
  area_kladr_id?: string; //	Код КЛАДР района в регионе
  area_with_type?: string; //	Район в регионе с типом
  area_type?: string; //	Тип района в регионе (сокращенный)
  area_type_full?: string; //	Тип района в регионе
  area?: string; //	Район в регионе

  city_fias_id?: string; //	Код ФИАС города
  city_kladr_id?: string; //	Код КЛАДР города
  city_with_type?: string; //	Город с типом
  city_type?: string; //	Тип города (сокращенный)
  city_type_full?: string; //	Тип города
  city?: string; //	Город

  city_district_fias_id?: string; //	Код ФИАС района города (заполняется, только если район есть в ФИАС)
  city_district_kladr_id?: string; //	Код КЛАДР района города (не заполняется)
  city_district_with_type?: string; //	Район города с типом
  city_district_type?: string; //	Тип района города (сокращенный)
  city_district_type_full?: string; //	Тип района города
  city_district?: string; //	Район города

  settlement_fias_id?: string; //	Код ФИАС нас. пункта
  settlement_kladr_id?: string; //	Код КЛАДР нас. пункта
  settlement_with_type?: string; //	Населенный пункт с типом
  settlement_type?: string; //	Тип населенного пункта (сокращенный)
  settlement_type_full?: string; //	Тип населенного пункта
  settlement?: string; //	Населенный пункт

  street_fias_id?: string; //	Код ФИАС улицы
  street_kladr_id?: string; //	Код КЛАДР улицы
  street_with_type?: string; //	Улица с типом
  street_type?: string; //	Тип улицы (сокращенный)
  street_type_full?: string; //	Тип улицы
  street?: string; //	Улица

  house_fias_id?: string; //	Код ФИАС дома
  house_kladr_id?: string; //	Код КЛАДР дома
  house_type?: string; //	Тип дома (сокращенный)
  house_type_full?: string; //	Тип дома
  house?: string; //	Дом

  block_type?: string; //	Тип корпуса/строения (сокращенный)
  block_type_full?: string; //	Тип корпуса/строения
  block?: string; //	Корпус/строение

  flat_fias_id?: string; //
  flat_type?: string; //	Тип квартиры (сокращенный)
  flat_type_full?: string; //	Тип квартиры
  flat?: string; //	Квартира

  postal_box?: string; //	Абонентский ящик

  // Код ФИАС:
  //   HOUSE.HOUSEGUID, если дом найден в ФИАС по точному совпадению;
  //   ADDROBJ.AOGUID в противном случае.
  fias_id?: string;
  fias_level: DaDataAddressFiasLevelEnum; //	Уровень детализации, до которого адрес найден в ФИАС:

  kladr_id?: string; //	Код КЛАДР
  geoname_id?: string; //	Идентификатор объекта в базе GeoNames. Для российских адресов не заполняется.
  capital_marker?: string; //	Признак центра района или региона:

  okato?: string; //	Код ОКАТО
  oktmo?: string; //	Код ОКТМО
  tax_office?: string; //	Код ИФНС для физических лиц
  tax_office_legal?: string; //	Код ИФНС для организаций

  geo_lat?: string; //	Координаты: широта
  geo_lon?: string; //	Координаты: долгота
  qc_geo?: DaDataAddressQcGeoEnum; //	Код точности координат:

  fias_code?: string; //	Иерархический код адреса в ФИАС (СС+РРР+ГГГ+ППП+СССС+УУУУ+ДДДД)

  // 0    — актуальный
  // 1–50 — переименован
  // 51   — переподчинен
  // 99   — удален
  fias_actuality_state?: string; //	Признак актуальности адреса в ФИАС

  city_area?: string; //	Административный округ (только для Москвы)

  beltway_hit?: string; //	Внутри кольцевой?
  beltway_distance?: string; //	Расстояние от кольцевой в километрах

  flat_area?: string; //	Площадь квартиры
  square_meter_price?: string; //	Рыночная стоимость м²
  flat_price?: string; //	Рыночная стоимость квартиры
  timezone?: string; //	Часовой пояс

  qc_complete?: string; //
  qc_house?: string; //
  qc?: string; //
  source?: string; //
  unparsed_parts?: string; //
}

export enum DaDataAddressFiasLevelEnum {
  COUNTRY = '0', // — страна
  REGION = '1', // — регион
  AREA = '3', // — район
  CITY = '4', // — город
  CITY_AREA = '5', // — район города
  LOCALITY = '6', // — населенный пункт
  STREET = '7', // — улица
  BUILDING = '8', // — дом
  KV = '9',
  PLAN = '65', // — планировочная структура
  ANY = '-1', // — иностранный или пустой
}

export enum DaDataAddressQcGeoEnum {
  ACCURATE = 0, // — точные координаты
  HOME = 1, // — ближайший дом
  STREET = 2, // — улица
  LOCALITY = 3, // — населенный пункт
  CITY = 4, // — город
  NONE = 5, // — координаты не определены
}

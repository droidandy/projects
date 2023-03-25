export interface IDaDataBankDTO {
  value: string; // Наименование банка
  unrestricted_value: string; // Наименование банка
  data: {
    bic: string; // Банковский идентификационный код (БИК) ЦБ РФ
    inn: string; // ИНН
    kpp: string;
    correspondent_account: string; // Корреспондентский счет в ЦБ РФ
    payment_city: string; // Город для платежного поручения
  };
}

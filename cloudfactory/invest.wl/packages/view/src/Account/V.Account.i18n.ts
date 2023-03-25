import { EDAccountBoard, EDAccountMarketType, EDAccountAgreementType, Injectable } from '@invest.wl/core';
import { IVAccountI18n } from './V.Account.types';

@Injectable()
export class VAccountI18n implements IVAccountI18n {
  public marketType: { [T in EDAccountMarketType]: string } = {
    [EDAccountMarketType.Currency]: 'Валютный счёт',
    [EDAccountMarketType.Fund]: 'Фондовый счёт',
    [EDAccountMarketType.FundSPB]: 'Фондовый счёт (СПБ)',
    [EDAccountMarketType.OTC]: 'Внебиржевой счёт',
    [EDAccountMarketType.Term]: 'Срочный счёт',
  };

  public board: { [T in EDAccountBoard]: string } = {
    [EDAccountBoard.Currency]: 'Валютный счёт',
    [EDAccountBoard.Other]: 'Фондовый счёт',
    [EDAccountBoard.FundSPB]: 'Фондовый счёт (СПБ)',
    [EDAccountBoard.OTC]: 'Внебиржевой счёт',
    [EDAccountBoard.Term]: 'Срочный счёт',
  };

  public agreementType: { [T in EDAccountAgreementType]: string } = {
    [EDAccountAgreementType.Default]: 'Основной счет',
    [EDAccountAgreementType.IIS]: 'ИИС',
    [EDAccountAgreementType.DU]: 'Доверительное управление',
    [EDAccountAgreementType.PIF]: 'Паевый счет',
  };
}

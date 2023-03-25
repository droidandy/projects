import { Injectable, TDQuestionSection } from '@invest.wl/core';
import { IVQuestionI18n } from './V.Question.types';

@Injectable()
export class VQuestionI18n implements IVQuestionI18n {
  section: { [S in TDQuestionSection]: string } = {
    Hidden: '',
    General: 'Анкета пользователя',
    PDL: 'Анкета публичного должностного лица',
    FatcaCrs: 'Анкета FATCA / CRS',
  };
}

import { EDDocumentStatus, Injectable } from '@invest.wl/core';
import { IVDocumentI18n } from './V.Document.types';

@Injectable()
export class VDocumentI18n implements IVDocumentI18n {
  public status: { [T in EDDocumentStatus]: string } = {
    [EDDocumentStatus.Draft]: 'Черновик',
    [EDDocumentStatus.New]: 'На подпись',
    [EDDocumentStatus.Processed]: 'Обработан',
    [EDDocumentStatus.Signed]: 'Подписан',
    [EDDocumentStatus.Archive]: 'В архиве',
    [EDDocumentStatus.Error]: 'Ошибка',
  };
}

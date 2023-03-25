import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVInstrumentExchangeItemModel, VInstrumentExchangeItemModel, VInstrumentExchangeItemModelTid } from './model/V.InstrumentExchangeItem.model';
import { IVInstrumentExchangeListModel, VInstrumentExchangeListModel, VInstrumentExchangeListModelTid } from './model/V.InstrumentExchangeList.model';
import { IVInstrumentInfoModel, VInstrumentInfoModel, VInstrumentInfoModelTid } from './model/V.InstrumentInfo.model';
import { IVInstrumentMarketHistoryModel, VInstrumentMarketHistoryModel, VInstrumentMarketHistoryModelTid } from './model/V.InstrumentMarketHistory.model';
import { IVInstrumentQuoteModel, VInstrumentQuoteModel, VInstrumentQuoteModelTid } from './model/V.InstrumentQuote.model';
import { IVInstrumentSearchModel, VInstrumentSearchModel, VInstrumentSearchModelTid } from './model/V.InstrumentSearch.model';
import { IVInstrumentSummaryModel, VInstrumentSummaryModel, VInstrumentSummaryModelTid } from './model/V.InstrumentSummary.model';
import { VInstrumentPresent, VInstrumentPresentTid } from './present/V.Instrument.present';
import { VInstrumentExchangePresent, VInstrumentExchangePresentTid } from './present/V.InstrumentExchange.present';
import { VInstrumentFavoritePresent, VInstrumentFavoritePresentTid } from './present/V.InstrumentFavorite.present';
import { VInstrumentQuoteListPresent } from './present/V.InstrumentQuoteList.present';
import { VInstrumentSearchPresent, VInstrumentSearchPresentTid } from './present/V.InstrumentSearch.present';
import { VInstrumentI18n } from './V.Instrument.i18n';
import { IVInstrumentI18n, VInstrumentI18nTid, VInstrumentQuoteListPresentTid } from './V.Instrument.types';
import { VInstrumentHistoryPresent, VInstrumentHistoryPresentTid } from './present/V.InstrumentHistory.present';

export class VInstrumentModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVInstrumentI18n>(VInstrumentI18nTid).to(VInstrumentI18n).inSingletonScope();
    ioc.bind<VInstrumentQuoteListPresent>(VInstrumentQuoteListPresentTid).to(VInstrumentQuoteListPresent);
    ioc.bind<VInstrumentPresent>(VInstrumentPresentTid).to(VInstrumentPresent);
    ioc.bind<VInstrumentHistoryPresent>(VInstrumentHistoryPresentTid).to(VInstrumentHistoryPresent);
    ioc.bind<VInstrumentExchangePresent>(VInstrumentExchangePresentTid).to(VInstrumentExchangePresent);
    ioc.bind<VInstrumentSearchPresent>(VInstrumentSearchPresentTid).to(VInstrumentSearchPresent);
    ioc.bind<VInstrumentFavoritePresent>(VInstrumentFavoritePresentTid).to(VInstrumentFavoritePresent);
    ioc.bind<NewableType<IVInstrumentInfoModel>>(VInstrumentInfoModelTid).toConstructor<IVInstrumentInfoModel>(VInstrumentInfoModel);
    ioc.bind<NewableType<IVInstrumentSummaryModel>>(VInstrumentSummaryModelTid).toConstructor<IVInstrumentSummaryModel>(VInstrumentSummaryModel);
    ioc.bind<NewableType<IVInstrumentQuoteModel>>(VInstrumentQuoteModelTid).toConstructor<IVInstrumentQuoteModel>(VInstrumentQuoteModel);
    ioc.bind<NewableType<IVInstrumentSearchModel>>(VInstrumentSearchModelTid).toConstructor<IVInstrumentSearchModel>(VInstrumentSearchModel);
    ioc.bind<NewableType<IVInstrumentMarketHistoryModel>>(VInstrumentMarketHistoryModelTid).toConstructor<IVInstrumentMarketHistoryModel>(VInstrumentMarketHistoryModel);
    ioc.bind<NewableType<IVInstrumentExchangeItemModel>>(VInstrumentExchangeItemModelTid).toConstructor<IVInstrumentExchangeItemModel>(VInstrumentExchangeItemModel);
    ioc.bind<NewableType<IVInstrumentExchangeListModel>>(VInstrumentExchangeListModelTid).toConstructor<IVInstrumentExchangeListModel>(VInstrumentExchangeListModel);
  }
}

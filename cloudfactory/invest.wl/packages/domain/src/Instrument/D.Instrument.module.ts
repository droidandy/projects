import { IoC, IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DInstrumentCase, DInstrumentCaseTid } from './case/D.Instrument.case';
import { DInstrumentExchangeCase, DInstrumentExchangeCaseTid } from './case/D.InstrumentExchange.case';
import { DInstrumentFavoriteCase, DInstrumentFavoriteCaseTid } from './case/D.InstrumentFavorite.case';
import { DInstrumentQuoteListCase, DInstrumentQuoteListCaseTid } from './case/D.InstrumentQuoteList.case';
import { DInstrumentSearchCase, DInstrumentSearchCaseTid } from './case/D.InstrumentSearch.case';
import { DInstrumentConfig, DInstrumentConfigTid } from './D.Instrument.config';
import { DInstrumentGateway, DInstrumentGatewayTid } from './D.Instrument.gateway';
import { DInstrumentService, DInstrumentServiceTid } from './D.Instrument.service';
import { DInstrumentStore, DInstrumentStoreTid } from './D.Instrument.store';
import { DInstrumentExchangeItemModel, DInstrumentExchangeItemModelTid, IDInstrumentExchangeItemModel } from './model/D.InstrumentExchangeItem.model';
import { DInstrumentExchangeListModel, DInstrumentExchangeListModelTid, IDInstrumentExchangeListModel } from './model/D.InstrumentExchangeList.model';
import { DInstrumentInfoModel, DInstrumentInfoModelTid, IDInstrumentInfoModel } from './model/D.InstrumentInfo.model';
import { DInstrumentMarketHistoryModel, DInstrumentMarketHistoryModelTid, IDInstrumentMarketHistoryModel } from './model/D.InstrumentMarketHistory.model';
import { DInstrumentQuoteModel, DInstrumentQuoteModelTid, IDInstrumentQuoteModel } from './model/D.InstrumentQuote.model';
import { DInstrumentSearchModel, DInstrumentSearchModelTid, IDInstrumentSearchModel } from './model/D.InstrumentSearch.model';
import { DInstrumentSummaryModel, DInstrumentSummaryModelTid, IDInstrumentSummaryModel } from './model/D.InstrumentSummary.model';
import { DInstrumentHistoryCase, DInstrumentHistoryCaseTid } from './case/D.InstrumentHistory.case';

export class DInstrumentModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DInstrumentConfig>(DInstrumentConfigTid).to(DInstrumentConfig).inSingletonScope();
    ioc.bind<DInstrumentGateway>(DInstrumentGatewayTid).to(DInstrumentGateway).inSingletonScope();
    ioc.bind<DInstrumentService>(DInstrumentServiceTid).to(DInstrumentService).inSingletonScope();
    ioc.bind<DInstrumentStore>(DInstrumentStoreTid).to(DInstrumentStore).inSingletonScope();
    ioc.bind<DInstrumentCase>(DInstrumentCaseTid).to(DInstrumentCase);
    ioc.bind<DInstrumentExchangeCase>(DInstrumentExchangeCaseTid).to(DInstrumentExchangeCase);
    ioc.bind<DInstrumentQuoteListCase>(DInstrumentQuoteListCaseTid).to(DInstrumentQuoteListCase);
    ioc.bind<DInstrumentSearchCase>(DInstrumentSearchCaseTid).to(DInstrumentSearchCase);
    ioc.bind<DInstrumentFavoriteCase>(DInstrumentFavoriteCaseTid).to(DInstrumentFavoriteCase);
    ioc.bind<DInstrumentHistoryCase>(DInstrumentHistoryCaseTid).to(DInstrumentHistoryCase);
    ioc.bind<NewableType<IDInstrumentInfoModel>>(DInstrumentInfoModelTid).toConstructor<IDInstrumentInfoModel>(DInstrumentInfoModel);
    ioc.bind<NewableType<IDInstrumentSummaryModel>>(DInstrumentSummaryModelTid).toConstructor<IDInstrumentSummaryModel>(DInstrumentSummaryModel);
    ioc.bind<NewableType<IDInstrumentQuoteModel>>(DInstrumentQuoteModelTid).toConstructor<IDInstrumentQuoteModel>(DInstrumentQuoteModel);
    ioc.bind<NewableType<IDInstrumentSearchModel>>(DInstrumentSearchModelTid).toConstructor<IDInstrumentSearchModel>(DInstrumentSearchModel);
    ioc.bind<NewableType<IDInstrumentMarketHistoryModel>>(DInstrumentMarketHistoryModelTid).toConstructor<IDInstrumentMarketHistoryModel>(DInstrumentMarketHistoryModel);
    ioc.bind<NewableType<IDInstrumentExchangeItemModel>>(DInstrumentExchangeItemModelTid).toConstructor<IDInstrumentExchangeItemModel>(DInstrumentExchangeItemModel);
    ioc.bind<NewableType<IDInstrumentExchangeListModel>>(DInstrumentExchangeListModelTid).toConstructor<IDInstrumentExchangeListModel>(DInstrumentExchangeListModel);
  }

  public async init() {
    IoC.get<DInstrumentStore>(DInstrumentStoreTid);
  }
}

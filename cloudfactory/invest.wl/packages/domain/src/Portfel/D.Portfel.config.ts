import {
  EDAccountMarketType,
  EDInstrumentAssetSubType,
  EDInstrumentAssetType,
  EDPortfelGroup,
  EDTradeMarket,
  IDPortfelPLByInstrumentItemDTO,
  IDPortfelSummaryItemDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import uniqBy from 'lodash/uniqBy';
import { instrumentIsMoneyOperation } from '../Instrument/util/D.InstrumentFilter.util';
import {
  DPortfelAdapterTid,
  IDPortfelAdapter,
  IDPortfelConfig,
  IDPortfelGroupItem,
  IDPortfelGroupMap,
  TDPortfelGroupAccountItem,
  TDPortfelGroupInstrumentItem,
} from './D.Portfel.types';

@Injectable()
export class DPortfelConfig implements IDPortfelConfig {
  constructor(
    @Inject(DPortfelAdapterTid) protected _adapter: IDPortfelAdapter,
  ) { }

  public get plUpdateInterval() {
    return this._adapter.plUpdateInterval;
  }

  public groupByAssetSubTypeList: IDPortfelGroupItem[] = [{
    id: EDInstrumentAssetSubType.Equity.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Equity
      && ![EDInstrumentAssetSubType.ETF, EDInstrumentAssetSubType.PIF, EDInstrumentAssetSubType.BondsPIF].includes(el.Instrument.AssetSubType),
  }, {
    id: EDInstrumentAssetSubType.Bond.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Bond
      || (el.Instrument.AssetType === EDInstrumentAssetType.Equity && el.Instrument.AssetSubType === EDInstrumentAssetSubType.BondsPIF),
  }, {
    id: EDInstrumentAssetSubType.ETF.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Equity
      && el.Instrument.AssetSubType === EDInstrumentAssetSubType.ETF,
  }, {
    id: EDInstrumentAssetSubType.Future.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Future,
  }, {
    id: EDInstrumentAssetSubType.Option.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Option,
  }, {
    id: EDInstrumentAssetSubType.Money.toString(),
    filter: (el: TDPortfelGroupInstrumentItem) => !!el.Amount && el.Instrument.AssetType === EDInstrumentAssetType.Money
      && instrumentIsMoneyOperation(el.OperationTypeId),
  }];

  public groupByMarketList: IDPortfelGroupItem[] = [{
    id: EDTradeMarket.Fund,
    filter: (el: TDPortfelGroupAccountItem) => ![EDAccountMarketType.Term, EDAccountMarketType.Currency].includes(el.Account.MarketType),
  }, {
    id: EDTradeMarket.Term,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.Term,
  }, {
    id: EDTradeMarket.Currency,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.Currency,
    // && (el.Instrument.AssetType === EDInstrumentAssetType.Money ? el.OperationTypeId === EDPortfelOperationType.UNKNOWN1 : true),
  }];

  public groupByAccountMarketTypeList: IDPortfelGroupItem[] = [{
    id: EDAccountMarketType.Currency,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.Currency,
  }, {
    id: EDAccountMarketType.Fund,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.Fund,
  }, {
    id: EDAccountMarketType.Term,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.Term,
  }, {
    id: EDAccountMarketType.FundSPB,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.FundSPB,
  }, {
    id: EDAccountMarketType.OTC,
    filter: (el: TDPortfelGroupAccountItem) => el.Account.MarketType === EDAccountMarketType.OTC,
  }];

  public plGroupMap: IDPortfelGroupMap<IDPortfelPLByInstrumentItemDTO> = {
    [EDPortfelGroup.All]: () => [{ id: '-1', filter: () => true }],
    [EDPortfelGroup.AgreementId]: (list) => uniqBy(list.map(p => p.Agreement), i => i.Name)
      .map(a => ({
        id: a.Name,
        filter: (item: IDPortfelPLByInstrumentItemDTO) => item.Agreement.Name === a.Name,
      })),
    [EDPortfelGroup.AccountId]: (list) => uniqBy(list.map(p => p.Account), i => i.id)
      .map(a => ({
        id: a.id,
        filter: (item: IDPortfelPLByInstrumentItemDTO) => item.Account.id === a.id,
      })),
    [EDPortfelGroup.AccountMarketType]: () => this.groupByAccountMarketTypeList,
    [EDPortfelGroup.TradeMarket]: () => this.groupByMarketList,
    [EDPortfelGroup.InstrumentAssetType]: () => this.groupByAssetSubTypeList,
    [EDPortfelGroup.InstrumentId]: (list) => uniqBy(list.map(p => p.Instrument), i => i.id.toString())
      .map(a => ({
        id: a.id.toString(),
        filter: (item: IDPortfelPLByInstrumentItemDTO) => item.Instrument.id.equals(a.id) && !!item.Amount,
      })),
  };

  public summaryGroupMap: IDPortfelGroupMap<IDPortfelSummaryItemDTO> = {
    [EDPortfelGroup.All]: () => [{ id: '-1', filter: () => true }],
    [EDPortfelGroup.AgreementId]: (list) => uniqBy(list.map(p => p.Agreement), i => i.Name)
      .map(a => ({
        id: a.Name,
        filter: (item: IDPortfelSummaryItemDTO) => item.Agreement.Name === a.Name,
      })),
    [EDPortfelGroup.AccountId]: (list) => uniqBy(list.map(p => p.Account), i => i.id)
      .map(a => ({
        id: a.id,
        filter: (item: IDPortfelSummaryItemDTO) => item.Account.id === a.id,
      })),
    [EDPortfelGroup.AccountMarketType]: () => this.groupByAccountMarketTypeList,
    [EDPortfelGroup.TradeMarket]: () => this.groupByMarketList,
    [EDPortfelGroup.InstrumentAssetType]: () => this.groupByAssetSubTypeList,
    [EDPortfelGroup.InstrumentId]: () => [{ id: '-1', filter: () => false }],
  };
}

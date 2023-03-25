import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { STransportAccountService, STransportAccountServiceTid } from './Account/S.TransportAccount.service';
import { STransportAuthService } from './Auth/S.TransportAuth.service';
import { STransportConfigService, STransportConfigServiceTid } from './Config/S.TransportConfig.service';
import { STransportDataService, STransportDataServiceTid } from './Data/S.TransportData.service';
import { STransportMarketService, STransportMarketServiceTid } from './Market/S.TransportMarket.service';
import { STransportPushNotificationService, STransportPushNotificationServiceTid } from './PushNotification/S.TransportPushNotification.service';
import { STransportQUIKService, STransportQUIKServiceTid } from './QUIK/S.TransportQUIK.service';
import { STransportReportService, STransportReportServiceTid } from './Report/S.TransportReport.service';
import { STransportConfig } from './S.Transport.config';
import { ISTransportConfig, STransportAuthServiceTid, STransportConfigTid } from './S.Transport.types';
import { STransportTradeService, STransportTradeServiceTid } from './Trade/S.TransportTrade.service';
import { STransportTransferService, STransportTransferServiceTid } from './Transfer/S.TransportTransfer.service';
import { STransportWsOb2Source, STransportWsOb2SourceTid } from './Ws/Ob2/S.TransportWsOb2.source';
import { STransportWsService, STransportWsServiceTid } from './Ws/S.TransportWs.service';

export class STransportModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISTransportConfig>(STransportConfigTid).to(STransportConfig).inSingletonScope();
    ioc.bind<STransportConfigService>(STransportConfigServiceTid).to(STransportConfigService).inSingletonScope();
    ioc.bind<STransportAuthService>(STransportAuthServiceTid).to(STransportAuthService).inSingletonScope();
    ioc.bind<STransportAccountService>(STransportAccountServiceTid).to(STransportAccountService).inSingletonScope();
    ioc.bind<STransportDataService>(STransportDataServiceTid).to(STransportDataService).inSingletonScope();
    ioc.bind<STransportMarketService>(STransportMarketServiceTid).to(STransportMarketService).inSingletonScope();
    ioc.bind<STransportQUIKService>(STransportQUIKServiceTid).to(STransportQUIKService).inSingletonScope();
    ioc.bind<STransportReportService>(STransportReportServiceTid).to(STransportReportService).inSingletonScope();
    ioc.bind<STransportTradeService>(STransportTradeServiceTid).to(STransportTradeService).inSingletonScope();
    ioc.bind<STransportTransferService>(STransportTransferServiceTid).to(STransportTransferService).inSingletonScope();
    ioc.bind<STransportPushNotificationService>(STransportPushNotificationServiceTid).to(STransportPushNotificationService).inSingletonScope();

    ioc.bind<STransportWsService>(STransportWsServiceTid).to(STransportWsService).inSingletonScope();
    ioc.bind<NewableType<STransportWsOb2Source>>(STransportWsOb2SourceTid).toConstructor<STransportWsOb2Source>(STransportWsOb2Source);
  }
}

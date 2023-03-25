import { IocContainer, IocModule } from '@invest.wl/core';
import { SNetworkHttpClient } from './client/S.NetworkHttp.client';
import { SNetworkHttpAxiosSender } from './client/S.NetworkHttpAxios.sender';
import { SNetworkSocketClient } from './client/S.NetworkSocket.client';
import { ISNetworkSocketQueue, SNetworkSocketQueue } from './client/S.NetworkSocket.queue';
import { SNetworkSocketSender } from './client/S.NetworkSocket.sender';
import { SNetworkConfig } from './S.Network.config';
import { SNetworkStore } from './S.Network.store';
import {
  ISNetworkConfig,
  ISNetworkEndpointConfigurator,
  ISNetworkEndpointProvider,
  ISNetworkHttpClient,
  ISNetworkHttpSender,
  ISNetworkSocketClient,
  ISNetworkSocketSender,
  ISNetworkStore,
  SNetworkAccessRefreshServiceTid,
  SNetworkConfigTid,
  SNetworkEndpointConfiguratorTid,
  SNetworkEndpointProviderTid,
  SNetworkHttpClientTid,
  SNetworkHttpSenderTid,
  SNetworkSocketClientTid,
  SNetworkSocketQueueTid,
  SNetworkSocketSenderTid,
  SNetworkStoreTid,
} from './S.Network.types';
import { SNetworkAccessRefreshService } from './S.NetworkAccessRefresh.service';
import { SNetworkEndpointProvider } from './S.NetworkEndpoint.provider';

export class SNetworkModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISNetworkConfig>(SNetworkConfigTid).to(SNetworkConfig).inSingletonScope();
    ioc.bind<ISNetworkStore>(SNetworkStoreTid).to(SNetworkStore).inSingletonScope();
    ioc.bind<ISNetworkHttpSender>(SNetworkHttpSenderTid).to(SNetworkHttpAxiosSender);
    ioc.bind<ISNetworkSocketSender>(SNetworkSocketSenderTid).to(SNetworkSocketSender);
    ioc.bind<ISNetworkHttpClient>(SNetworkHttpClientTid).to(SNetworkHttpClient);
    ioc.bind<ISNetworkSocketClient>(SNetworkSocketClientTid).to(SNetworkSocketClient);
    ioc.bind<ISNetworkEndpointProvider>(SNetworkEndpointProviderTid).to(SNetworkEndpointProvider).inSingletonScope();
    ioc.bind<ISNetworkEndpointConfigurator>(SNetworkEndpointConfiguratorTid).toService(SNetworkEndpointProviderTid);

    ioc.bind<SNetworkAccessRefreshService>(SNetworkAccessRefreshServiceTid).to(SNetworkAccessRefreshService).inSingletonScope();

    ioc.bind<ISNetworkSocketQueue>(SNetworkSocketQueueTid).to(SNetworkSocketQueue);
  }
}

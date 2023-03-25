import { IIocModule, IocContainer, IocModule } from '@invest.wl/core';
import {
  ISDeepLinkConfig,
  ISFeedbackMobileConfig,
  SApplicationMobileModule,
  SClipboardMobileModule,
  SConfigMobileModule,
  SDeepLinkConfigTid,
  SDeepLinkModule,
  SDeviceMobileModule,
  SErrorMobileModule,
  SFeedbackMobileModule,
  SFirebaseMobileModule,
  SHardwareBackMobileModule,
  SKeyboardMobileModule,
  SOrientationMobileModule,
  SRouterMobileModule,
  SSecurityMobileModule,
  SStorageLocalMobileModule,
} from '@invest.wl/mobile';
import { SAuthModule } from '@invest.wl/system/src/Auth/S.Auth.module';
import { ISAuthConfig, SAuthConfigTid } from '@invest.wl/system/src/Auth/S.Auth.types';
import { SFeedbackConfigTid } from '@invest.wl/system/src/Feedback/S.Feedback.types';
import { ISHardwareBackConfig, SHardwareBackConfigTid } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';
import { SLoggerModule } from '@invest.wl/system/src/Logger/S.Logger.module';
import { SNetworkModule } from '@invest.wl/system/src/Network/S.Network.module';
import { SNotificationModule } from '@invest.wl/system/src/Notification/S.Notification.module';
import { ISSecurityConfig, SSecurityConfigTid } from '@invest.wl/system/src/Security/S.Security.types';
import { ISStorageLocalConfig, SStorageLocalConfigTid } from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';
import { STransportModule } from '@invest.wl/system/src/Transport/S.Transport.module';
import { SAuthConfig } from './Auth/S.Auth.config';
import { SDeepLinkConfig } from './DeepLink/S.DeepLink.config';
import { SFeedbackConfig } from './Feedback/S.Feedback.config';
import { SHardwareBackConfig } from './HardwareBack/S.HardwareBack.config';
import { SSecurityConfig } from './Security/S.Security.config';
import { SStorageLocalConfig } from './StorageLocal/S.StorageLocal.config';

export class SystemModule extends IocModule {
  protected list: IIocModule[] = [
    // order important! don't move down this modules
    new SConfigMobileModule(),
    new SApplicationMobileModule(),
    new SSecurityMobileModule(),
    new SStorageLocalMobileModule(),
    new SErrorMobileModule(),

    // platform independent
    new SNetworkModule(),
    new STransportModule(),
    new SLoggerModule(),
    new SNotificationModule(),
    new SAuthModule(),

    // mobile only
    new SRouterMobileModule(),
    new SDeepLinkModule(),
    new SDeviceMobileModule(),
    new SHardwareBackMobileModule(),
    new SKeyboardMobileModule(),
    new SOrientationMobileModule(),
    new SClipboardMobileModule(),
    new SFeedbackMobileModule(),
    new SFirebaseMobileModule(),
  ];

  public configure(ioc: IocContainer): void {
    // config binds first
    ioc.bind<ISDeepLinkConfig>(SDeepLinkConfigTid).to(SDeepLinkConfig).inSingletonScope();
    ioc.bind<ISAuthConfig>(SAuthConfigTid).to(SAuthConfig).inSingletonScope();
    ioc.bind<ISSecurityConfig>(SSecurityConfigTid).to(SSecurityConfig).inSingletonScope();
    ioc.bind<ISFeedbackMobileConfig>(SFeedbackConfigTid).to(SFeedbackConfig).inSingletonScope();
    ioc.bind<ISHardwareBackConfig>(SHardwareBackConfigTid).to(SHardwareBackConfig).inSingletonScope();
    ioc.bind<ISStorageLocalConfig>(SStorageLocalConfigTid).to(SStorageLocalConfig).inSingletonScope();

    super.configure(ioc);
  }
}

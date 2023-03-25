import { IIocModule, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { ISDeepLinkConfig, SDeepLinkConfigTid } from '@invest.wl/mobile/src/system/DeepLink/S.DeepLink.types';
import { SDeepLinkConfig } from './DeepLink/S.DeepLink.config';
import { ISAuthConfig, SAuthConfigTid } from '@invest.wl/system/src/Auth/S.Auth.types';
import { SAuthConfig } from './Auth/S.Auth.config';
import { SApplicationMobileModule } from '@invest.wl/mobile/src/system/Application/S.ApplicationMobile.module';
import { SSecurityMobileModule } from '@invest.wl/mobile/src/system/Security/S.SecurityMobile.module';
import { SStorageLocalMobileModule } from '@invest.wl/mobile/src/system/StorageLocal/S.StorageLocalMobile.module';
import { SNetworkModule } from '@invest.wl/system/src/Network/S.Network.module';
import { SLoggerModule } from '@invest.wl/system/src/Logger/S.Logger.module';
import { SNotificationModule } from '@invest.wl/system/src/Notification/S.Notification.module';
import { SAuthModule } from '@invest.wl/system/src/Auth/S.Auth.module';
import { SDeepLinkModule } from '@invest.wl/mobile/src/system/DeepLink/S.DeepLink.module';
import { SDeviceMobileModule } from '@invest.wl/mobile/src/system/Device/S.DeviceMobile.module';
import { SHardwareBackMobileModule } from '@invest.wl/mobile/src/system/HardwareBack/S.HardwareBackMobile.module';
import { SKeyboardMobileModule } from '@invest.wl/mobile/src/system/Keyboard/S.KeyboardMobile.module';
import { SOrientationMobileModule } from '@invest.wl/mobile/src/system/Orientation/S.OrientationMobile.module';
import { SClipboardMobileModule } from '@invest.wl/mobile/src/system/Clipboard/S.ClipboardMobile.module';
import { SFeedbackMobileModule } from '@invest.wl/mobile/src/system/Feedback/S.FeedbackMobile.module';
import { SRouterMobileModule } from '@invest.wl/mobile/src/system/Router/S.RouterMobile.module';
import { SFirebaseMobileModule } from '@invest.wl/mobile/src/system/Firebase/S.FirebaseMobile.module';
import { SErrorMobileModule } from '@invest.wl/mobile/src/system/Error/S.ErrorMobile.module';
import { STransportModule } from '@invest.wl/system/src/Transport/S.Transport.module';
import { SConfigMobileModule } from '@invest.wl/mobile/src/system/Config/S.ConfigMobile.module';
import { SFeedbackConfigTid } from '@invest.wl/system/src/Feedback/S.Feedback.types';
import { ISFeedbackMobileConfig } from '@invest.wl/mobile/src/system/Feedback/S.FeedbackMobile.types';
import { SFeedbackConfig } from './Feedback/S.Feedback.config';
import { ISSecurityConfig, SSecurityConfigTid } from '@invest.wl/system/src/Security/S.Security.types';
import { SSecurityConfig } from './Security/S.Security.config';
import { ISHardwareBackConfig, SHardwareBackConfigTid } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';
import { SHardwareBackConfig } from './HardwareBack/S.HardwareBack.config';
import { ISStorageLocalConfig, SStorageLocalConfigTid } from '@invest.wl/system/src/StorageLocal/S.StorageLocal.types';
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

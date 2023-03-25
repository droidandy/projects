import { IIocModule, IocModule } from '@invest.wl/core';
import { SAuthModule, SErrorModule, SLoggerModule, SNetworkModule, SNotificationModule, STransportModule } from '@invest.wl/system';
import { SApplicationMobileModule } from './Application/S.ApplicationMobile.module';
import { SClipboardMobileModule } from './Clipboard/S.ClipboardMobile.module';
import { SConfigMobileModule } from './Config/S.ConfigMobile.module';
import { SDeepLinkModule } from './DeepLink/S.DeepLink.module';
import { SDeviceMobileModule } from './Device/S.DeviceMobile.module';
import { SFeedbackMobileModule } from './Feedback/S.FeedbackMobile.module';
import { SFirebaseMobileModule } from './Firebase/S.FirebaseMobile.module';
import { SHardwareBackMobileModule } from './HardwareBack/S.HardwareBackMobile.module';
import { SKeyboardMobileModule } from './Keyboard/S.KeyboardMobile.module';
import { SOrientationMobileModule } from './Orientation/S.OrientationMobile.module';
import { SPushNotificationModule } from './PushNotification/S.PushNotification.module';
import { SRouterMobileModule } from './Router/S.RouterMobile.module';
import { SSecurityMobileModule } from './Security/S.SecurityMobile.module';
import { SStorageLocalMobileModule } from './StorageLocal/S.StorageLocalMobile.module';

export class SystemCoreMobileModule extends IocModule {
  protected list: IIocModule[] = [
    new SConfigMobileModule(),
    new SApplicationMobileModule(),
    new SSecurityMobileModule(),
    new SStorageLocalMobileModule(),
    // new SGeoLocationWebModule(),

    // platform independent
    new SErrorModule(),
    new SNetworkModule(),
    new STransportModule(),
    new SLoggerModule(),
    new SNotificationModule(),
    new SAuthModule(),

    // mobile only
    new SRouterMobileModule(),
    new SPushNotificationModule(),
    new SDeepLinkModule(),
    new SDeviceMobileModule(),
    new SHardwareBackMobileModule(),
    new SKeyboardMobileModule(),
    new SOrientationMobileModule(),
    new SFirebaseMobileModule(),
    new SClipboardMobileModule(),
    new SFeedbackMobileModule(),
  ];
}

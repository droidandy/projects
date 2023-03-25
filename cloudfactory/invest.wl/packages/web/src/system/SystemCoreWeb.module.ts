import { IIocModule, IocModule } from '@invest.wl/core/src/di/IoC';
import { SApplicationWebModule } from './Application/S.ApplicationWeb.module';
import { SConfigWebModule } from './Config/S.ConfigWeb.module';
import { SSecurityWebModule } from './Security/S.SecurityWeb.module';
import { SStorageLocalWebModule } from './StorageLocal/S.StorageLocalWeb.module';
import { SDeviceWebModule } from './Device/S.DeviceWeb.module';
import { SHardwareBackWebModule } from './HardwareBack/S.HardwareBackWeb.module';
import { SNetworkModule } from '@invest.wl/system/src/Network/S.Network.module';
import { SAuthModule } from '@invest.wl/system/src/Auth/S.Auth.module';
import { SErrorModule } from '@invest.wl/system/src/Error/S.Error.module';
import { SLoggerModule } from '@invest.wl/system/src/Logger/S.Logger.module';
import { SNotificationModule } from '@invest.wl/system/src/Notification/S.Notification.module';
import { STransportModule } from '@invest.wl/system/src/Transport/S.Transport.module';
import { SFirebaseWebModule } from './Firebase/S.FirebaseWeb.module';
import { SClipboardWebModule } from './Clipboard/S.ClipboardWeb.module';
import { SFeedbackWebModule } from './Feedback/S.FeedbackWeb.module';
import { SRouterWebModule } from './Router/S.RouterWeb.module';

export class SystemCoreWebModule extends IocModule {
  protected list: IIocModule[] = [
    new SConfigWebModule(),
    new SApplicationWebModule(),
    new SSecurityWebModule(),
    new SStorageLocalWebModule(),
    // new SGeoLocationWebModule(),

    // platform independent
    new SErrorModule(),
    new SNetworkModule(),
    new STransportModule(),
    new SLoggerModule(),
    new SNotificationModule(),
    new SAuthModule(),

    // mobile only
    new SRouterWebModule(),
    new SDeviceWebModule(),
    new SHardwareBackWebModule(),
    new SFirebaseWebModule(),
    new SClipboardWebModule(),
    new SFeedbackWebModule(),
  ];
}

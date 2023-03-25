import { Injectable } from '@invest.wl/core';
import { ISHardwareBackConfig } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';
import { EVPortfelScreen } from '@invest.wl/view/src/Portfel/V.Portfel.types';

@Injectable()
export class SHardwareBackConfig implements ISHardwareBackConfig {
  public screenBeforeExit = EVPortfelScreen.Portfel;
}

import { ISApplicationStore, SApplicationStoreTid } from '@invest.wl/system/src/Application/S.Application.types';
import { autorun, runInAction } from 'mobx';
import {
  ISSecurityListener, ISSecurityStore, SSecurityStoreTid,
} from '@invest.wl/system/src/Security/S.Security.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { EDSecurityBiometryType } from '@invest.wl/core/src/dto/Security';
import { EDApplicationState } from '@invest.wl/core/src/dto/Application/D.Application.dto';

@Injectable()
export class SSecurityWebListener implements ISSecurityListener {
  private static async _biometryTypeSupported(): Promise<EDSecurityBiometryType> {
    // const type = await TouchID.isSupported();
    // switch (type) {
    //   case 'FaceID':
    //     return EDSecurityBiometryType.Face;
    //   case 'TouchID':
    //   case 'Fingerprint':
    //     return EDSecurityBiometryType.Finger;
    // }

    throw new Error('No biometry in browser');
  }

  constructor(
    @Inject(SApplicationStoreTid) private _appState: ISApplicationStore,
    @Inject(SSecurityStoreTid) private _securityStore: ISSecurityStore,
  ) {
    autorun(async () => {
      if (this._appState.state !== EDApplicationState.unknown) await this._biometryTypeUpdate();
    });
  }

  public async init() {
    await this._biometryTypeUpdate();
  }

  private async _biometryTypeUpdate() {
    try {
      const biometryType = await SSecurityWebListener._biometryTypeSupported();
      runInAction(() => this._securityStore.biometryType = biometryType);
    } catch (e: any) {
      /* eat all */
    }
  }
}

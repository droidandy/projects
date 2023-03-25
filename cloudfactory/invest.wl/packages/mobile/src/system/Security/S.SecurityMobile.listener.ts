import { EDApplicationState, EDSecurityBiometryType, EDSecurityType, Inject, Injectable } from '@invest.wl/core';
import { ISApplicationStore, ISSecurityListener, ISSecurityStore, SApplicationStoreTid, SSecurityStoreTid } from '@invest.wl/system';
import { reaction, runInAction } from 'mobx';
import TouchID from 'react-native-touch-id';

@Injectable()
export class SSecurityMobileListener implements ISSecurityListener {
  private static async _biometryTypeSupported(): Promise<EDSecurityBiometryType> {
    // passcodeFallback: false - считаем что TouchID отсутвует, если нет ни одного отпечатка пальца в системе
    const type = await TouchID.isSupported({ passcodeFallback: false } as any);
    switch (type) {
      case 'FaceID':
        return EDSecurityBiometryType.Face;
      case 'TouchID':
      case 'Fingerprint':
        return EDSecurityBiometryType.Finger;
    }

    throw new Error(`Unknown biometry type received from react-native-touch-id: ${type}`);
  }

  constructor(
    @Inject(SApplicationStoreTid) private _appState: ISApplicationStore,
    @Inject(SSecurityStoreTid) private _securityStore: ISSecurityStore,
  ) {
    reaction(() => this._appState.state === EDApplicationState.active,
      async (isActive) => isActive && await this._biometryTypeUpdate());
  }

  public async init() {
    await this._biometryTypeUpdate();
  }

  private async _biometryTypeUpdate() {
    let biometryType: EDSecurityBiometryType | undefined;
    try {
      biometryType = await SSecurityMobileListener._biometryTypeSupported();
    } catch (e: any) {
      // eat
    }
    if (!biometryType) await this._securityStore.accessSet(EDSecurityType.BIO, false);
    runInAction(() => this._securityStore.biometryType = biometryType);
  }
}

import { VButton, VContainer, VContent, VStub } from '@invest.wl/mobile';
import * as React from 'react';
import RNExitApp from 'react-native-exit-app';

export class VSecurityDeviceTrustFailed extends React.PureComponent {
  public render() {
    return (
      <VContainer>
        <VContent pa={'lg'}>
          <VStub.Empty title={'Ваше устройство уязвимо'}>На вашем устройстве обнаружен root доступ. Устраните уязвимость
            для работы приложения</VStub.Empty>
          <VButton.Fill mt={'md'} onPress={this._onPress}>Выйти</VButton.Fill>
        </VContent>
      </VContainer>

    );
  }

  private _onPress = () => RNExitApp.exitApp();
}
